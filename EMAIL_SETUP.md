# 📧 Email Service Setup Guide

This guide will help you set up the email functionality to send generated logos to email lists.

## 🚀 Quick Setup with EmailJS

EmailJS is the easiest way to send emails directly from the frontend without a backend server.

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. You get 200 free emails per month

### Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy your **Service ID**

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: {{subject}} Hi {{to_name}}, {{message}} Check out this amazing logo I
created: [Image will be attached/linked] Best regards, {{from_name}} --- Created
with Logo Reactivator
```

**Template Variables:**

- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{from_name}}` - Sender name
- `{{subject}}` - Email subject
- `{{message}}` - Custom message
- `{{image_url}}` - Generated logo URL

4. Copy your **Template ID**

### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Update Environment Variables

Add these to your `.env.local` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 🎯 How It Works

1. **User generates logo** → Pays for generation
2. **Email button appears** → Click 📧 on any generated image
3. **Email modal opens** → Enter recipient emails and message
4. **Emails sent** → Each recipient gets individual email with logo

## 📝 Features

- **Bulk email sending** - Send to multiple recipients at once
- **Email validation** - Automatically validates email addresses
- **Custom messages** - Personalize each email
- **Image attachment** - Generated logo included in email
- **Neobrutalism UI** - Matches the app's design aesthetic

## 🔧 Advanced Setup (Optional)

For production use, consider:

- **Resend API** - More reliable for high volume
- **SendGrid** - Enterprise email service
- **Custom backend** - Full control over email sending

## 🎨 Email Template Customization

You can customize the email template in EmailJS dashboard:

- Add your branding
- Include social media links
- Add call-to-action buttons
- Customize styling

## 🚨 Troubleshooting

**Emails not sending?**

1. Check console for errors
2. Verify environment variables
3. Check EmailJS dashboard for quota limits
4. Ensure email addresses are valid

**Template not working?**

1. Check variable names match exactly
2. Test template in EmailJS dashboard
3. Verify template ID is correct

## 💡 Tips

- **Free tier**: 200 emails/month with EmailJS
- **Rate limits**: Don't send too many emails at once
- **Spam prevention**: Include unsubscribe links
- **Testing**: Test with your own email first

Happy emailing! 📧✨
