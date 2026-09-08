import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { uploadToCloudinary, validateFile, isDemoMode } from '../services/cloudinary';

export default function UploadBox({ onImageReady }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef(null);

  const processFile = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const result = await uploadToCloudinary(file, setProgress);
      setUploaded(true);
      onImageReady({ url: result.url, file, localUrl });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setUploaded(false);
    setProgress(0);
    setError('');
    onImageReady(null);
  };

  return (
    <div className="w-full">
      {isDemoMode && (
        <div className="mb-3 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
          <AlertCircle size={14} className="text-blue-400 flex-shrink-0" />
          <span className="text-xs text-blue-300">Demo mode — images are previewed locally without uploading</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(37,99,235,0.3)' }}
          >
            <img src={preview} alt="Preview" className="w-full max-h-64 object-contain"
              style={{ background: 'rgba(9,24,44,0.8)' }} />

            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: 'rgba(2,8,23,0.8)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(37,99,235,0.2)' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <RefreshCw size={28} className="text-blue-400" />
                  </motion.div>
                </div>
                <p className="text-white font-medium mb-2">Uploading... {progress}%</p>
                <div className="w-40 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="progress-bar h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Success state */}
            {uploaded && !uploading && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.4)' }}>
                <CheckCircle size={13} className="text-green-400" />
                <span className="text-xs text-green-300 font-medium">Ready</span>
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={removeImage}
              className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(2,8,23,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Remove image"
            >
              <X size={14} className="text-slate-300" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              border: `2px dashed ${isDragging ? 'rgba(37,99,235,0.8)' : 'rgba(37,99,235,0.25)'}`,
              background: isDragging ? 'rgba(37,99,235,0.08)' : 'rgba(9,24,44,0.5)',
            }}
            whileHover={{ borderColor: 'rgba(37,99,235,0.5)', background: 'rgba(37,99,235,0.05)' }}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Upload size={28} className="text-blue-400" />
            </motion.div>
            <p className="text-base font-semibold text-white mb-1">Drag & drop your image here</p>
            <p className="text-sm text-slate-500 mb-4">or</p>
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200"
              style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)' }}
            >
              Choose File
            </button>
            <p className="text-xs text-slate-500 mt-3">Supports JPG, PNG, WEBP • Max 5MB</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
        >
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-300">{error}</span>
        </motion.div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onFileChange}
        className="hidden"
        aria-label="Upload screenshot"
      />
    </div>
  );
}
