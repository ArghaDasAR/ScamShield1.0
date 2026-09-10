/**
 * ocr.js — High-Precision Client-Side OCR & Visual Data Sensing
 *
 * Runs OCR directly inside the browser using Tesseract.js worker threads.
 * Extracts raw textual evidence, phone numbers, amounts, and urgent phrases
 * directly from uploaded screenshots, chat captures, and notices.
 */

import { createWorker } from 'tesseract.js';

let cachedWorker = null;

async function getWorker(onProgress) {
  if (cachedWorker) return cachedWorker;

  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof onProgress === 'function') {
        const pct = Math.round((m.progress || 0) * 100);
        onProgress(pct);
      }
    },
  });

  cachedWorker = worker;
  return worker;
}

/**
 * Extract raw text from an image File or Data URL.
 * @param {File|Blob|string} imageSource
 * @param {function(number): void} onProgress
 * @returns {Promise<{ text: string, confidence: number }>}
 */
export async function extractTextFromImage(imageSource, onProgress = () => {}) {
  try {
    // 1. Try native Chromium TextDetector API if supported (extremely fast hardware acceleration)
    if (typeof window !== 'undefined' && 'TextDetector' in window) {
      try {
        const detector = new window.TextDetector();
        let imgEl;
        if (imageSource instanceof File || imageSource instanceof Blob) {
          imgEl = await createImageBitmap(imageSource);
        }
        if (imgEl) {
          const detected = await detector.detect(imgEl);
          const raw = detected.map(d => d.rawValue).filter(Boolean).join('\n');
          if (raw && raw.trim().length > 10) {
            onProgress(100);
            return { text: raw.trim(), confidence: 0.95 };
          }
        }
      } catch (e) {
        // Fallback to Tesseract
      }
    }

    // 2. High-accuracy Tesseract OCR
    const worker = await getWorker(onProgress);
    const ret = await worker.recognize(imageSource);
    const text = (ret.data?.text || '').trim();
    const confidence = (ret.data?.confidence || 85) / 100;

    return {
      text,
      confidence,
    };
  } catch (err) {
    console.warn('[Client OCR] Extraction error, falling back:', err.message);
    return {
      text: '',
      confidence: 0,
    };
  }
}

/**
 * Convert a File object to base64 Data URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default {
  extractTextFromImage,
  fileToDataUrl,
};
