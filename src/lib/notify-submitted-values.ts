// Simple notification utility for form submissions
export function notifySubmittedValues(values: Record<string, unknown>) {
  // In a real app, this would integrate with a toast notification system
  // For development, values can be logged if needed

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Form submitted with values:', values);
  }
}

// Export with typo for backward compatibility
export const nofitySubmittedValues = notifySubmittedValues;
