// Simple image hosting service for email attachments
// This creates a temporary blob URL that can be used in emails

export interface ProcessedImage {
  url: string;
  size: string;
  format: string;
}

// Compress and resize image for email
export const processImageForEmail = async (base64: string): Promise<ProcessedImage> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Resize to email-friendly dimensions
      const maxWidth = 600;
      const maxHeight = 400;
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image with white background
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Convert to JPEG with high compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
      
      // Calculate size
      const sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
      const sizeInKB = Math.round(sizeInBytes / 1024);
      
      resolve({
        url: compressedBase64,
        size: `${sizeInKB}KB`,
        format: 'JPEG'
      });
    };
    
    img.src = base64;
  });
};

// Create a downloadable link for the image
export const createDownloadLink = (base64: string, filename: string = 'logo.png'): string => {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    // Create object URL
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to create download link:', error);
    return base64; // Fallback to base64
  }
};

// Generate a simple image hosting solution using GitHub Gist or similar
export const createImageShareLink = async (base64: string): Promise<string> => {
  try {
    // For now, we'll return the compressed base64
    // In production, you could upload to:
    // - GitHub Gist
    // - Imgur
    // - Cloudinary
    // - Your own server
    
    const processed = await processImageForEmail(base64);
    return processed.url;
  } catch (error) {
    console.error('Failed to create share link:', error);
    return base64;
  }
};