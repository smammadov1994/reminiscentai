import { supabase } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

// Convert base64 to file
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

// Upload image to Supabase Storage
export const uploadImageToSupabase = async (
  base64Image: string, 
  userId: string,
  filename?: string
): Promise<UploadResult> => {
  try {
    if (!supabase) {
      return { url: '', path: '', error: 'Supabase not configured' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const finalFilename = filename || `logo_${timestamp}_${randomId}.png`;
    
    // Create file path: user_id/images/filename
    const filePath = `${userId}/images/${finalFilename}`;
    
    // Convert base64 to file
    const file = base64ToFile(base64Image, finalFilename);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-images')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
};

// Delete image from Supabase Storage
export const deleteImageFromSupabase = async (filePath: string): Promise<boolean> => {
  try {
    if (!supabase) {
      return false;
    }

    const { error } = await supabase.storage
      .from('user-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
};

// List user's images
export const getUserImages = async (userId: string): Promise<string[]> => {
  try {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase.storage
      .from('user-images')
      .list(`${userId}/images`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data?.map(file => `${userId}/images/${file.name}`) || [];
  } catch (error) {
    console.error('Failed to list images:', error);
    return [];
  }
};

// Get public URL for an image
export const getImageUrl = (filePath: string): string => {
  if (!supabase) {
    return '';
  }

  const { data } = supabase.storage
    .from('user-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};