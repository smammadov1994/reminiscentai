# Supabase Storage Setup for Logo Reactivator

This guide will help you set up Supabase Storage to store user-generated logos for email sharing.

## 1. Create Storage Bucket

1. **Go to your Supabase Dashboard**

   - Navigate to Storage > Buckets
   - Click "Create Bucket"

2. **Create the bucket:**
   ```
   Bucket name: user-images
   Public bucket: ✅ (checked)
   ```

## 2. Set Up Storage Policies

Go to Storage > Policies and create these policies:

### Policy 1: Allow authenticated users to upload their own images

```sql
-- Policy name: Users can upload their own images
-- Operation: INSERT
-- Target roles: authenticated

(auth.uid())::text = (storage.foldername(name))[1]
```

### Policy 2: Allow public read access to all images

```sql
-- Policy name: Public read access
-- Operation: SELECT
-- Target roles: public, authenticated

true
```

### Policy 3: Allow users to delete their own images

```sql
-- Policy name: Users can delete their own images
-- Operation: DELETE
-- Target roles: authenticated

(auth.uid())::text = (storage.foldername(name))[1]
```

## 3. Folder Structure

The app will automatically create this folder structure:

```
user-images/
├── [user-id-1]/
│   └── images/
│       ├── logo_1234567890_abc123.png
│       └── shared_logo_1234567891.png
├── [user-id-2]/
│   └── images/
│       └── logo_1234567892_def456.png
```

## 4. Benefits of This Setup

✅ **Reliable Email Images**: Images are hosted on Supabase CDN, not embedded as base64
✅ **User Organization**: Each user's images are stored in their own folder
✅ **Security**: Users can only access their own images
✅ **Performance**: Fast CDN delivery for email recipients
✅ **Storage Management**: Easy to manage and delete old images

## 5. Usage in App

When users share logos via email:

1. Image is uploaded to Supabase Storage under their user ID
2. Public URL is generated and used in email
3. Recipients see a fast-loading, properly displayed image
4. No more base64 text in emails!

## 6. Storage Limits

- **Free tier**: 1GB storage
- **Pro tier**: 8GB storage + additional storage available
- Images are automatically compressed for email sharing
- Old images can be cleaned up periodically

## 7. Troubleshooting

If images don't upload:

1. Check that the bucket exists and is public
2. Verify the storage policies are correctly set
3. Ensure user is authenticated
4. Check browser console for error messages

The app will automatically fall back to compressed base64 if Supabase upload fails.
