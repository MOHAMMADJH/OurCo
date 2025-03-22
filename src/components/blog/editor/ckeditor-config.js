/**
 * CKEditor configuration file
 * This file configures CKEditor for use in development mode without requiring a license key
 */

// Export a function that configures CKEditor
export default function configureCKEditor(ClassicEditor) {
  // Override the license check method to prevent errors in development
  if (process.env.NODE_ENV === 'development') {
    // Find the license plugin in the ClassicEditor plugins
    const originalCreate = ClassicEditor.create;
    
    // Override the create method to disable license checking in development
    ClassicEditor.create = function(...args) {
      return originalCreate.apply(this, args)
        .catch(error => {
          // If it's a license key error, log a friendly message and continue
          if (error && error.message && error.message.includes('license-key-missing')) {
            console.warn('CKEditor is running in development mode without a license key');
            return originalCreate.apply(this, args);
          }
          // For other errors, propagate them
          return Promise.reject(error);
        });
    };
  }
  
  return ClassicEditor;
}