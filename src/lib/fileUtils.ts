
/**
 * Parses a CSV file and returns an array of objects representing rows
 * @param file The CSV file to parse
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  try {
    const text = await file.text();
    const lines = text.split('\n');
    
    // Extract headers (first line)
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Process data rows (remaining lines)
    const data = lines.slice(1)
      .filter(line => line.trim() !== '') // Skip empty lines
      .map(line => {
        const values = line.split(',');
        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          const value = values[index] ? values[index].trim() : '';
          row[header] = value;
        });
        
        return row;
      });
    
    return data;
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    throw new Error('Failed to parse CSV file');
  }
};

/**
 * Validates a file is a CSV
 * @param file The file to validate
 */
export const isCSV = (file: File): boolean => {
  return file.type === 'text/csv' || file.name.endsWith('.csv');
};
