import axios from 'axios';

interface PerformanceMetrics {
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  loading_speed: number;
  mobile_friendly: boolean;
  errors: string[];
}

export const analyzeWebsite = async (url: string): Promise<PerformanceMetrics> => {
  // This is a mock implementation
  // In a real application, you would integrate with actual performance testing APIs
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

  // Generate realistic-looking performance data
  const performance_score = Math.floor(Math.random() * 30) + 70; // 70-100
  const accessibility_score = Math.floor(Math.random() * 40) + 60; // 60-100
  const best_practices_score = Math.floor(Math.random() * 35) + 65; // 65-100
  const seo_score = Math.floor(Math.random() * 25) + 75; // 75-100
  const loading_speed = (Math.random() * 3) + 1; // 1-4 seconds
  const mobile_friendly = Math.random() > 0.3; // 70% chance of being mobile friendly

  // Generate potential errors
  const possibleErrors = [
    'Images missing alt text',
    'Contrast ratio too low for text elements',
    'Missing meta description',
    'Render-blocking resources detected',
    'Cumulative Layout Shift (CLS) issues found',
    'First Contentful Paint (FCP) too slow',
    'Largest Contentful Paint (LCP) exceeds threshold',
    'First Input Delay (FID) issues detected',
    'JavaScript execution time too long',
    'Unoptimized images detected'
  ];
  
  // Randomly select 0-3 errors
  const errorCount = Math.floor(Math.random() * 4);
  const errors = [];
  for (let i = 0; i < errorCount; i++) {
    const randomIndex = Math.floor(Math.random() * possibleErrors.length);
    errors.push(possibleErrors[randomIndex]);
    // Remove the selected error to avoid duplicates
    possibleErrors.splice(randomIndex, 1);
  }

  return {
    performance_score,
    accessibility_score,
    best_practices_score,
    seo_score,
    loading_speed,
    mobile_friendly,
    errors
  };
};