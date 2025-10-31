import emailjs from '@emailjs/browser';

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

export interface SimpleEmailData {
  recipients: EmailRecipient[];
  subject: string;
  message: string;
  senderName?: string;
}

// Send simple text email without image (to avoid 50KB limit)
export const sendSimpleEmailToList = async (emailData: SimpleEmailData): Promise<boolean> => {
  try {
    // For each recipient, send individual email
    const emailPromises = emailData.recipients.map(async (recipient) => {
      const templateParams = {
        to_email: recipient.email,
        to_name: recipient.name || recipient.email,
        from_name: emailData.senderName || 'Logo Reactivator User',
        subject: emailData.subject,
        message: emailData.message,
        // Keep it simple - no image data
        app_link: 'https://your-logo-reactivator-app.com',
        signature: 'Created with Logo Reactivator - Transform your static logos into emotional experiences!',
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