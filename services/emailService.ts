import emailjs from '@emailjs/browser';
import { processImageForEmail, createImageShareLink } from './imageHostingService';

// Email service configuration
const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
export const initEmailService = () => {
  if (EMAIL_PUBLIC_KEY) {
    emailjs.init(EMAIL_PUBLIC_KEY);
  }
};

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailData {
  recipients: EmailRecipient[];
  subject: string;
  message: string;
  imageUrl: string;
  senderName?: string;
}

// Convert base64 image to blob for attachment
export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const byteCharacters = atob(base64.split(',')[1] || base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};



// Send email with generated image
export const sendImageToEmailList = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Process the image to reduce size
    let processedImageUrl = emailData.imageUrl;
    let imageInfo = '';
    
    // If it's a base64 image, compress it heavily
    if (emailData.imageUrl.startsWith('data:image')) {
      const processed = await processImageForEmail(emailData.imageUrl);
      processedImageUrl = processed.url;
      imageInfo = `Image: ${processed.size} ${processed.format}`;
      
      // If still too large, create a text-only email with download instructions
      if (processed.url.length > 40000) { // ~40KB limit to be safe
        processedImageUrl = 'IMAGE_TOO_LARGE_FOR_EMAIL';
        imageInfo = 'Image was too large for email - see instructions below';
      }
    }
    
    // For each recipient, send individual email
    const emailPromises = emailData.recipients.map(async (recipient) => {
      const templateParams = {
        to_email: recipient.email,
        to_name: recipient.name || recipient.email,
        from_name: emailData.senderName || 'Logo Reactivator',
        subject: emailData.subject,
        message: emailData.message.substring(0, 1000), // Limit message length
        image_url: processedImageUrl === 'IMAGE_TOO_LARGE_FOR_EMAIL' ? '' : processedImageUrl,
        image_info: imageInfo,
        download_instructions: processedImageUrl === 'IMAGE_TOO_LARGE_FOR_EMAIL' 
          ? 'The generated logo was too large to include in this email. Please visit Logo Reactivator to download your image directly.'
          : '',
      };

      return emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams
      );
    });

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('Failed to send emails:', error);
    return false;
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Parse email list from text (comma or newline separated)
export const parseEmailList = (emailText: string): EmailRecipient[] => {
  const emails = emailText
    .split(/[,\n\r]+/)
    .map(email => email.trim())
    .filter(email => email && isValidEmail(email))
    .map(email => ({ email }));
  
  return emails;
};