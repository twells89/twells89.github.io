
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A simple helper to format file sizes
export function formatFileSize(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Helper to validate file types
export function isValidFileType(file: File, allowedTypes: string[]) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.some(type => 
    type.toLowerCase().includes(extension) || 
    type.toLowerCase() === `.${extension}`
  );
}

// Helper to truncate text
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Helper to generate a random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// Format percentage values
export function formatPercentage(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

// Format a score (0-100) with appropriate color class
export function getScoreColorClass(score: number) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

// Simple data anonymization for display purposes
export function anonymizeData(data: string) {
  // This is a simple implementation - in production, you'd use a more sophisticated approach
  if (!data) return '';
  
  // If it looks like an email
  if (data.includes('@')) {
    const [username, domain] = data.split('@');
    return `${username.substring(0, 2)}***@${domain}`;
  }
  
  // If it looks like a name (contains spaces)
  if (data.includes(' ')) {
    return data.split(' ').map(part => 
      `${part.substring(0, 1)}${'*'.repeat(part.length > 1 ? part.length - 1 : 1)}`
    ).join(' ');
  }
  
  // Default anonymization
  if (data.length <= 2) return data;
  return `${data.substring(0, 1)}${'*'.repeat(data.length - 2)}${data.substring(data.length - 1)}`;
}
