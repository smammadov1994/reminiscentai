import emailjs from '@emailjs/browser';
import { processImageForEmail, createImageShareLink } from './imageHostingService';
import { uploadImageToSupabase } from './supabaseStorage';

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
  userId?: string; // Add userId for Supabase storage
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
    let processedImageUrl = emailData.imageUrl;
    let imageInfo = '';
    let uploadError = false;
    
    // If it's a base64 image and we have a userId, upload to Supabase
    if (emailData.imageUrl.startsWith('data:image') && emailData.userId) {
      try {
        const uploadResult = await uploadImageToSupabase(
          emailData.imageUrl, 
          emailData.userId,
          `shared_logo_${Date.now()}.png`
        );
        
        if (uploadResult.error) {
          console.error('Supabase upload failed:', uploadResult.error);
          uploadError = true;
        } else {
          processedImageUrl = uploadResult.url;
          imageInfo = 'Image hosted securely';
        }
      } catch (error) {
        console.error('Failed to upload to Supabase:', error);
        uploadError = true;
      }
    }
    
    // Fallback: If Supabase upload failed or no userId, compress the image
    if (uploadError || !emailData.userId) {
      if (emailData.imageUrl.startsWith('data:image')) {
        const processed = await processImageForEmail(emailData.imageUrl);
        processedImageUrl = processed.url;
        imageInfo = `Image: ${processed.size} ${processed.format}`;
        
        // If still too large, create a text-only email
        if (processed.url.length > 40000) {
          processedImageUrl = 'IMAGE_TOO_LARGE_FOR_EMAIL';
          imageInfo = 'Image was too large for email - see instructions below';
        }
      }
    }
    
    // For each recipient, send individual email
    const emailPromises = emailData.recipients.map(async (recipient) => {
      // Create HTML content with embedded image
      const htmlMessage = processedImageUrl === 'IMAGE_TOO_LARGE_FOR_EMAIL' 
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Check out this amazing logo!</h2>
            <p>${emailData.message}</p>
            <p><strong>Note:</strong> The generated logo was too large to include in this email. Please visit Logo Reactivator to download your image directly.</p>
            <p>Logo Reactivator lets you create logos that change based on user behavior - just like Duolingo's owl!</p>
            <p>Best regards,<br>${emailData.senderName || 'Logo Reactivator User'}</p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Check out this amazing logo!</h2>
            <p>${emailData.message}</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${processedImageUrl}" alt="Generated Logo" style="max-width: 100%; height: auto; border: 2px solid #000; border-radius: 8px;" />
            </div>
            <p>Logo Reactivator lets you create logos that change based on user behavior - just like Duolingo's owl!</p>
            <p>Best regards,<br>${emailData.senderName || 'Logo Reactivator User'}</p>
          </div>
        `;

      const templateParams = {
        to_email: recipient.email,
        to_name: recipient.name || recipient.email,
        from_name: emailData.senderName || 'Logo Reactivator',
        subject: emailData.subject,
        message: emailData.message.substring(0, 500), // Shorter text message
        html_content: htmlMessage,
        image_url: processedImageUrl === 'IMAGE_TOO_LARGE_FOR_EMAIL' ? '' : processedImageUrl,
        image_info: imageInfo,
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