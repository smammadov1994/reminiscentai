# Supabase Authentication Setup

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - Name: `logo-reactivator`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
7. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Update Environment Variables

Update your `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3002`
3. Under **Redirect URLs**, add: `http://localhost:3002`
4. Enable **Email confirmations** if you want email verification
5. Configure **Email templates** if needed

## 5. Optional: Email Configuration

For production, configure email settings:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (SendGrid, Mailgun, etc.)
3. Or use Supabase's built-in email service

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Click the "🔑 LOGIN" button on the landing page
3. Try creating an account
4. Check the Supabase dashboard under **Authentication** → **Users**

## Features Included

✅ **Sign Up** - Create new accounts with email/password
✅ **Login** - Authenticate existing users  
✅ **Sign Out** - Secure logout functionality
✅ **User State** - Persistent authentication across sessions
✅ **Protected Routes** - User-specific features
✅ **Neobrutalism Design** - Matches your app's aesthetic
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Smooth UX during auth operations

## Next Steps

- Set up user profiles table
- Add social login (Google, GitHub, etc.)
- Implement password reset
- Add user-specific history storage
- Set up Row Level Security (RLS) policies

The authentication is now fully integrated with your Logo Reactivator app! 🚀
