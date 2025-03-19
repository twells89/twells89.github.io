
# backend/app.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import io
import json
from sklearn.ensemble import IsolationForest, RandomForestRegressor, RandomForestClassifier
from sklearn.impute import SimpleImputer
import os

app = FastAPI(title="Data Sage API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthAnalysisResponse(BaseModel):
    summary: Dict[str, Any]
    columns: List[Dict[str, Any]]
    dataQualityIssues: List[str]
    recommendations: List[str]

class PredictiveInsightsResponse(BaseModel):
    predictionType: str
    targetColumn: Optional[str] = None
    featureImportance: Dict[str, float]
    predictivePotential: str
    suggestedModels: List[str]
    applicationAreas: List[str]

@app.post("/api/analyze-health", response_model=HealthAnalysisResponse)
async def analyze_data_health(file: UploadFile = File(...)):
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Determine file type and read with pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Basic data summary
        row_count = len(df)
        column_count = len(df.columns)
        
        # Missing values analysis
        missing_counts = df.isnull().sum()
        total_missing = missing_counts.sum()
        missing_percentage = (total_missing / (row_count * column_count) * 100)
        
        # Column analysis
        columns_info = []
        for col in df.columns:
            col_type = str(df[col].dtype)
            missing = int(df[col].isnull().sum())
            unique_count = df[col].nunique()
            
            # Calculate some basic stats based on data type
            if np.issubdtype(df[col].dtype, np.number):
                min_val = float(df[col].min()) if not pd.isna(df[col].min()) else None
                max_val = float(df[col].max()) if not pd.isna(df[col].max()) else None
                mean_val = float(df[col].mean()) if not pd.isna(df[col].mean()) else None
                
                columns_info.append({
                    "name": col,
                    "type": col_type,
                    "missingValues": missing,
                    "uniqueValues": unique_count,
                    "min": min_val,
                    "max": max_val,
                    "mean": mean_val
                })
            else:
                columns_info.append({
                    "name": col,
                    "type": col_type,
                    "missingValues": missing,
                    "uniqueValues": unique_count
                })
        
        # Identify data quality issues
        quality_issues = []
        
        if missing_percentage > 0:
            quality_issues.append(f"Dataset contains {missing_percentage:.1f}% missing values")
        
        # Check for columns with high missing values
        high_missing_cols = [col for col in df.columns if df[col].isnull().sum() / row_count > 0.2]
        if high_missing_cols:
            quality_issues.append(f"Columns with >20% missing values: {', '.join(high_missing_cols)}")
        
        # Check for columns with low variance
        for col in df.select_dtypes(include=['number']).columns:
            if df[col].nunique() == 1:
                quality_issues.append(f"Column '{col}' has no variance (constant value)")
        
        # Detect potential outliers in numerical columns
        for col in df.select_dtypes(include=['number']).columns:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            outlier_count = ((df[col] < (q1 - 1.5 * iqr)) | (df[col] > (q3 + 1.5 * iqr))).sum()
            if outlier_count > row_count * 0.05:  # More than 5% outliers
                quality_issues.append(f"Column '{col}' may contain significant outliers ({outlier_count} values)")
        
        # Calculate quality score (simplified)
        completeness = 100 - missing_percentage
        consistency_score = 80  # Placeholder - would need more complex logic
        if high_missing_cols:
            consistency_score -= 10 * len(high_missing_cols) / len(df.columns)
        
        quality_score = int((completeness * 0.7 + consistency_score * 0.3))
        
        # Generate recommendations
        recommendations = []
        if missing_percentage > 0:
            recommendations.append("Consider imputing missing values or removing rows/columns with high missing rates")
        
        if high_missing_cols:
            recommendations.append("Evaluate if columns with high missing values are necessary for your analysis")
        
        for col in df.select_dtypes(include=['object']).columns:
            if df[col].nunique() < 10 and df[col].nunique() / row_count < 0.05:
                recommendations.append(f"Consider encoding the '{col}' categorical column")
        
        # Add generic recommendations if we don't have many specific ones
        if len(recommendations) < 3:
            recommendations.append("Normalize numerical columns for better model performance")
            recommendations.append("Consider feature engineering to create more predictive variables")
        
        response = {
            "summary": {
                "rowCount": row_count,
                "columnCount": column_count,
                "missingValuesPercentage": round(missing_percentage, 1),
                "qualityScore": quality_score,
            },
            "columns": columns_info,
            "dataQualityIssues": quality_issues,
            "recommendations": recommendations
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/api/analyze-predictive", response_model=PredictiveInsightsResponse)
async def analyze_predictive_potential(file: UploadFile = File(...), target_column: Optional[str] = None):
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Determine file type and read with pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Handle if target_column is not provided
        if target_column is None or target_column not in df.columns:
            # Try to guess a target column - use the last numerical column
            numerical_cols = df.select_dtypes(include=['number']).columns
            if len(numerical_cols) > 0:
                target_column = numerical_cols[-1]
            else:
                raise HTTPException(status_code=400, detail="No numerical columns found for prediction and no target column specified")
        
        # Make a copy of the target before preprocessing
        y = df[target_column].copy()
        
        # Drop rows where the target is null
        null_target_mask = y.isnull()
        if null_target_mask.any():
            df = df[~null_target_mask]
            y = y[~null_target_mask]
        
        # Prepare data for modeling
        X = df.drop(columns=[target_column])
        
        # Handle non-numeric features (simple approach)
        X = pd.get_dummies(X)
        
        # Impute missing values
        numeric_features = X.select_dtypes(include=['number']).columns
        if len(numeric_features) > 0:
            # Use median imputation for numeric columns
            numeric_imputer = SimpleImputer(strategy='median')
            X[numeric_features] = numeric_imputer.fit_transform(X[numeric_features])
        
        # Fill any remaining NaNs with 0 (for non-numeric columns after one-hot encoding)
        X = X.fillna(0)
        
        # Determine if classification or regression
        is_classification = False
        unique_values = y.nunique()
        if unique_values < 10:
            is_classification = True
        
        # Train a simple model to get feature importance
        if is_classification:
            model = RandomForestClassifier(n_estimators=100, random_state=42)
        else:
            model = RandomForestRegressor(n_estimators=100, random_state=42)
        
        # Fit model
        model.fit(X, y)
        
        # Get feature importance
        feature_importance = {}
        for feat, importance in zip(X.columns, model.feature_importances_):
            feature_importance[feat] = round(float(importance), 4)
        
        # Sort and keep top features
        feature_importance = dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:10])
        
        # Determine predictive potential based on best feature importance
        top_importance = max(feature_importance.values()) if feature_importance else 0
        if top_importance > 0.2:
            predictive_potential = "high"
            potential_text = "The data shows strong predictive patterns"
        elif top_importance > 0.1:
            predictive_potential = "medium"
            potential_text = "The data shows moderate predictive patterns"
        else:
            predictive_potential = "low"
            potential_text = "The data shows weak predictive patterns"
        
        # Suggest models based on problem type
        if is_classification:
            suggested_models = ["Random Forest", "Gradient Boosting", "Logistic Regression"]
            if unique_values == 2:
                application_areas = ["Customer Churn Prediction", "Fraud Detection", "Binary Classification"]
            else:
                application_areas = ["Customer Segmentation", "Product Categorization", "Multi-class Classification"]
        else:
            suggested_models = ["Random Forest Regressor", "XGBoost", "Linear Regression"]
            application_areas = ["Sales Forecasting", "Price Prediction", "Numerical Estimation"]
        
        response = {
            "predictionType": "classification" if is_classification else "regression",
            "targetColumn": target_column,
            "featureImportance": feature_importance,
            "predictivePotential": predictive_potential,
            "suggestedModels": suggested_models,
            "applicationAreas": application_areas
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
