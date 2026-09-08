/**
 * ScamShield AI Analysis Service
 * 
 * Simulates future AI engine behavior with realistic mock data.
 * Architecture designed for easy backend replacement:
 * - Replace analyzeContent() with real API call
 * - All other UI logic remains unchanged
 */

import { demoScams } from '../data/demoScams.js';

// Simulated scan delay in ms (realistic feel without being slow)
const SCAN_DELAY = 2800;

/**
 * Main analysis function
 * @param {Object} input - { type, content, imageUrl, sender, subject }
 * @returns {Promise<AnalysisResult>}
 */
export const analyzeContent = async (input) => {
  // Simulate AI processing time
  await delay(SCAN_DELAY);

  // Check if content matches a demo scam
  const matched = findMatchingScam(input);
  if (matched) return formatResult(matched.expectedResult, input);

  // Generate a dynamic result based on heuristics
  return generateDynamicResult(input);
};

/**
 * Try to match input against known demo scams
 */
const findMatchingScam = (input) => {
  const content = (input.content || '').toLowerCase();
  const type = input.type;

  // Direct ID match (from example buttons)
  if (input.demoId) {
    return demoScams.find(s => s.id === input.demoId);
  }

  // Keyword matching for natural input
  if (content.includes('electricity') || content.includes('bescom') || content.includes('disconnected')) {
    return demoScams.find(s => s.id === 'electricity-scam');
  }
  if (content.includes('kyc') || content.includes('aadhaar')) {
    return demoScams.find(s => s.id === 'kyc-scam');
  }
  if (content.includes('hdfc') || content.includes('suspicious activity')) {
    return demoScams.find(s => s.id === 'bank-alert');
  }
  if (content.includes('upi') || content.includes('cashback') || content.includes('gpay')) {
    return demoScams.find(s => s.id === 'upi-cashback');
  }
  if (content.includes('sbi') && (content.includes('netbanking') || content.includes('xyz'))) {
    return demoScams.find(s => s.id === 'suspicious-url');
  }

  return null;
};

/**
 * Generate a plausible result for unrecognized input
 */
/**
 * Generate a plausible result for unrecognized input with rich spectrum scoring
 */
const generateDynamicResult = (input) => {
  const content = (input.content || '').toLowerCase();
  const url = (input.type === 'url' ? input.content : '').toLowerCase();

  // Fine-grained base calculation
  let score = 15;
  const tactics = [];

  const criticalUrgency = ['within 1 hour', 'immediate arrest', 'electricity disconnected tonight', 'blocked within 24 hours', 'final notice', 'action required now'];
  const softUrgency = ['urgent', 'hurry', 'limited time', 'soon', 'today', 'offer expires', 'deadline'];
  const threatWords = ['block', 'suspend', 'disconnect', 'arrest', 'legal action', 'penalty', 'court', 'freeze'];
  const authorityWords = ['bank', 'police', 'government', 'ministry', 'rbi', 'income tax', 'customs', 'sbi', 'hdfc', 'icici', 'axis'];
  const financeWords = ['pay', 'payment', 'transfer', 'wallet', 'upi', '₹', 'rupee', 'credit card', 'debit card', 'cashback', 'lottery'];
  const phishingUrls = ['.xyz', '.top', '.ru', '.cc', 'bit.ly', 'tinyurl', 'tiny.cc', 'secure-', '-login', '-verify', 'update-', 'kyc-'];
  const commonWeb = ['http://', 'https://', 'www.', '.com', '.in', '.org', '.net'];

  // Keyword weights
  if (criticalUrgency.some(w => content.includes(w))) {
    score += 24;
    tactics.push({ name: 'Extreme Urgency', description: 'Manufactures panic to suppress rational verification.', icon: 'clock', color: 'red' });
  } else if (softUrgency.some(w => content.includes(w))) {
    score += 14;
    tactics.push({ name: 'Urgency Cue', description: 'Applies mild artificial time limitation.', icon: 'clock', color: 'orange' });
  }

  if (threatWords.some(w => content.includes(w))) {
    score += 22;
    tactics.push({ name: 'Threat & Extortion', description: 'Intimidates with punitive actions or legal consequences.', icon: 'alert-triangle', color: 'red' });
  }

  if (authorityWords.some(w => content.includes(w))) {
    score += 18;
    tactics.push({ name: 'Authority Impersonation', description: 'Poses as an official financial or judicial body.', icon: 'shield-alert', color: 'red' });
  }

  if (phishingUrls.some(w => content.includes(w) || url.includes(w))) {
    score += 26;
    tactics.push({ name: 'Deceptive Hyperlink', description: 'Contains suspicious domain extensions or deceptive lookalikes.', icon: 'link', color: 'red' });
  } else if (commonWeb.some(w => content.includes(w) || url.includes(w))) {
    score += 12; // Unverified link
    tactics.push({ name: 'External Web Redirection', description: 'Prompts user to navigate outside verified platforms.', icon: 'globe', color: 'orange' });
  }

  if (financeWords.some(w => content.includes(w))) {
    score += 16;
    tactics.push({ name: 'Financial Solicitation', description: 'Requests money movement, credentials or claims prizes.', icon: 'credit-card', color: 'red' });
  }

  // Add realistic natural variance (+/- 3%) so scores don't look artificial or repetitively 20%
  const variance = (content.length % 7) - 3;
  score = Math.max(8, Math.min(98, score + variance));

  // Determine Severity Category & Verdict across wide spectrum
  let severity, verdict;
  if (score >= 85) {
    severity = 'CRITICAL';
    verdict = 'CRITICAL DANGER / SCAM';
  } else if (score >= 70) {
    severity = 'HIGH';
    verdict = 'HIGH RISK SCAM';
  } else if (score >= 55) {
    severity = 'SUSPICIOUS';
    verdict = 'MAYBE SUSPICIOUS';
  } else if (score >= 35) {
    severity = 'MODERATE';
    verdict = 'PROCEED WITH CAUTION';
  } else {
    severity = 'LOW';
    verdict = 'LIKELY SAFE / VERIFIED';
  }

  let urlRisk = 'Safe';
  if (score >= 80) urlRisk = 'Malicious';
  else if (score >= 55) urlRisk = 'Suspicious Domain';
  else if (score >= 35) urlRisk = 'Unverified Web Target';

  return {
    riskScore: score,
    severity,
    verdict,
    tactics,
    recommendations: getRecommendations(severity),
    extractedText: input.content?.slice(0, 90) || '',
    urlRisk,
  };
};

const getRecommendations = (severity) => {
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    return [
      'Do not click any links, open attachments, or make payments.',
      'Block and report the contact immediately.',
      'Never disclose OTPs, PINs, or banking passwords.',
      'Report incident to official authorities at cybercrime.gov.in or helpline 1930.',
    ];
  }
  if (severity === 'SUSPICIOUS') {
    return [
      'Website or message exhibits suspicious characteristics (60% risk band).',
      'Verify the domain spelling carefully before entering credentials.',
      'Do not approve 2FA/OTP prompts triggered unexpectedly.',
      'Confirm directly through official customer care channels.',
    ];
  }
  if (severity === 'MODERATE') {
    return [
      'Proceed with caution — promotional or third-party format detected.',
      'Double check sender origin and cross-reference on official portals.',
      'Refrain from downloading attachments from unknown senders.',
    ];
  }
  return [
    'This message or domain appears consistent with genuine correspondence.',
    'Continue practicing routine cyber hygiene.',
    'Always authenticate directly on primary apps or bookmarks.',
  ];
};

const formatResult = (result, input) => ({
  ...result,
  analyzedAt: new Date().toISOString(),
  inputType: input.type,
  inputSummary: (input.content || '').slice(0, 80),
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
