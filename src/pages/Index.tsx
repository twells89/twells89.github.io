
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileCheck, LineChart, BrainCircuit, Download, Share2 } from "lucide-react";
import FileUploader from '@/components/FileUploader';
import DataHealthDisplay from '@/components/DataHealthDisplay';
import PredictiveInsightsDisplay from '@/components/PredictiveInsightsDisplay';
import ConsultationForm from '@/components/ConsultationForm';
import { useToast } from '@/hooks/use-toast';
import { AIAnalysisService, HealthAnalysis } from '@/services/aiAnalysisService';
import { PredictiveInsight } from '@/components/PredictiveInsightsDisplay';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";
import ApiKeyInput from '@/components/ApiKeyInput';
import { exportDataHealthToPDF, exportPredictionsToPDF } from '@/utils/exportUtils';

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight | null>(null);
  const [nlpInsights, setNlpInsights] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File | null) => {
    if (uploadedFile) {
      setFile(uploadedFile);
      setHealthAnalysis(null);
      setPredictiveInsights(null);
      setNlpInsights([]);
      
      toast({
        title: "File uploaded successfully",
        description: `${uploadedFile.name} is ready for analysis.`,
      });
      
      analyzeData(uploadedFile);
    }
  };

  const analyzeData = async (dataFile: File) => {
    try {
      setIsAnalyzing(true);
      
      const analysis = await AIAnalysisService.analyzeDataHealth(dataFile);
      setHealthAnalysis(analysis);
      
      setActiveTab("health");
      
      toast({
        title: "Analysis complete",
        description: "We've analyzed your data quality and structure.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePredictions = async () => {
    if (!file) return;
    
    try {
      setIsPredicting(true);
      
      const insights = await AIAnalysisService.generatePredictiveInsights(file);
      setPredictiveInsights(insights);
      
      const nlp = await AIAnalysisService.generateNLPInsights(file, healthAnalysis, insights);
      setNlpInsights(nlp);
      
      setActiveTab("prediction");
      
      toast({
        title: "Predictive analysis complete",
        description: "We've identified potential prediction targets in your data.",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction analysis failed",
        description: "There was an error generating predictions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleShareResults = () => {
    setShareDialogOpen(true);
  };

  const handleExportPDF = async () => {
    toast({
      title: "Export initiated",
      description: "Your PDF report is being generated and will download shortly.",
    });
    
    try {
      if (activeTab === "health") {
        await exportDataHealthToPDF(healthAnalysis);
      } else if (activeTab === "prediction") {
        await exportPredictionsToPDF(predictiveInsights);
      }
      
      toast({
        title: "Export complete",
        description: "Your PDF report has been downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="container mx-auto py-12 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gradient">
              Pivot Analytics Data Sage
            </h1>
            <div className="ml-4">
              <ApiKeyInput />
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Upload your data to analyze quality, identify patterns, and uncover predictive potential with AI-powered insights
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Data</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2" disabled={!file || isAnalyzing}>
              <FileCheck className="h-4 w-4" />
              <span>Data Health</span>
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2" disabled={!healthAnalysis || isPredicting}>
              <BrainCircuit className="h-4 w-4" />
              <span>Predictions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8 animate-fade-up">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Dataset</CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file to begin your data analysis journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFileUpload={handleFileUpload} />
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">What happens next?</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>We'll scan your data for quality issues and inconsistencies</li>
                    <li>Our AI will identify patterns and relationships in your dataset</li>
                    <li>You'll receive personalized recommendations for potential predictions</li>
                    <li>All data is processed securely and deleted after analysis</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<FileCheck className="h-8 w-8" />}
                title="Data Health Check" 
                description="Identify missing values, outliers, and data quality issues" 
              />
              <FeatureCard 
                icon={<LineChart className="h-8 w-8" />}
                title="Pattern Discovery" 
                description="Uncover hidden relationships and trends in your data" 
              />
              <FeatureCard 
                icon={<BrainCircuit className="h-8 w-8" />}
                title="AI-Powered Insights" 
                description="Get plain-English explanations of your data's potential" 
              />
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6 animate-fade-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Health Analysis</CardTitle>
                  <CardDescription>
                    {file ? `Analyzing ${file.name}` : 'Please upload a file first'}
                  </CardDescription>
                </div>
                {healthAnalysis && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareResults}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <DataHealthDisplay 
                  analysis={healthAnalysis} 
                  loading={isAnalyzing} 
                />
                
                {healthAnalysis && (
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={generatePredictions}
                      disabled={isPredicting}
                    >
                      {isPredicting ? 'Generating Predictions...' : 'Continue to Predictive Analysis'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-6 animate-fade-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Predictive Analytics Simulator</CardTitle>
                  <CardDescription>
                    {file ? `Exploring predictive potential for ${file.name}` : 'Please upload a file first'}
                  </CardDescription>
                </div>
                {predictiveInsights && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareResults}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <PredictiveInsightsDisplay 
                  insights={predictiveInsights}
                  loading={isPredicting} 
                />
                
                {nlpInsights.length > 0 && (
                  <Card className="mt-6 border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-base">AI-Generated Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {nlpInsights.map((insight, index) => (
                          <li key={index} className="flex gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p>{insight}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {predictiveInsights && !showConsultationForm && (
                  <div className="mt-6 p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Take the Next Step</h3>
                    <p className="text-muted-foreground mb-4">
                      Want to discover what advanced analytics could reveal in your data? 
                      Schedule a consultation with our data science experts.
                    </p>
                    <Button onClick={() => setShowConsultationForm(true)}>
                      Schedule a Consultation
                    </Button>
                  </div>
                )}
                
                {showConsultationForm && (
                  <div className="mt-6">
                    <ConsultationForm />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Results</DialogTitle>
            <DialogDescription>
              Share these insights with colleagues or stakeholders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input 
                value={`https://pivot-analytics.com/share/${generateId()}`} 
                readOnly 
              />
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(`https://pivot-analytics.com/share/${generateId()}`).then(() => {
                  toast({
                    title: "Link copied",
                    description: "Shareable link has been copied to clipboard",
                  });
                });
              }}>
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This link will expire in 7 days. Recipients don't need an account to view the results.
            </p>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Or share directly via:</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Email</Button>
                <Button variant="outline" size="sm">LinkedIn</Button>
                <Button variant="outline" size="sm">Twitter</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string; 
  description: string;
}) => (
  <Card className="transition-all hover:shadow-md">
    <CardContent className="pt-6">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
