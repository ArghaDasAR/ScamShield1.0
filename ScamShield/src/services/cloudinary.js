/**
 * Cloudinary upload service
 * Handles image uploads for screenshot analysis
 * Falls back to demo mode if credentials are missing
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isDemoMode = !CLOUD_NAME || CLOUD_NAME === 'your_cloud_name' || !UPLOAD_PRESET;

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Validate file before upload
 */
export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPG, PNG, or WEBP image.' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_SIZE_MB}MB.` };
  }
  return { valid: true };
};

/**
 * Upload file to Cloudinary
 * Returns a promise with { url, publicId }
 */
export const uploadToCloudinary = async (file, onProgress) => {
  const validation = validateFile(file);
  if (!validation.valid) throw new Error(validation.error);

  // Demo mode: simulate upload with local object URL
  if (isDemoMode) {
    return simulateUpload(file, onProgress);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'scamshield');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
        });
      } else {
        reject(new Error('Upload failed. Please try again.'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload. Please check your connection.'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Simulate upload in demo mode using local object URLs
 */
const simulateUpload = async (file, onProgress) => {
  const steps = [10, 25, 45, 65, 80, 95, 100];
  for (const step of steps) {
    await delay(120);
    if (onProgress) onProgress(step);
  }
  const url = URL.createObjectURL(file);
  return { url, publicId: `demo-${Date.now()}`, demo: true };
};

/**
 * Create a local preview URL (for immediate display before upload)
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a previously created object URL to free memory
 */
export const revokePreviewUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
