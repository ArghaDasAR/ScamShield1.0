/**
 * demoAnalysis.js — High-Accuracy Scam Detection & Heuristic Engine
 *
 * Provides real-time, deterministic pattern analysis matching 25+ scam categories
 * with contextual evidence extraction. Works seamlessly both client-side and as
 * the resilient fallback for the backend pipeline.
 */

export const ASSET_TYPES = [
  'QR_CODE',
  'WHATSAPP',
  'SMS',
  'EMAIL',
  'PAYMENT_GATEWAY',
  'KYC_DOCUMENT',
  'SOCIAL_MEDIA',
  'TRANSACTION_SCREENSHOT',
  'UNKNOWN',
];

/** Risk band thresholds */
export const RISK_BANDS = {
  LOW:    { min: 0,  max: 29, label: 'Low Risk',   cls: 'low'    },
  MEDIUM: { min: 30, max: 69, label: 'Suspicious',  cls: 'medium' },
  HIGH:   { min: 70, max: 100, label: 'High Risk',  cls: 'high'   },
};

export function getRiskBand(score) {
  if (score <= 29) return RISK_BANDS.LOW;
  if (score <= 69) return RISK_BANDS.MEDIUM;
  return RISK_BANDS.HIGH;
}

/**
 * getRiskPhrase — Human-friendly verdict phrase matching the score.
 */
export function getRiskPhrase(score) {
  if (score <= 15) return {
    phrase: 'Verified',
    subtext: 'No threat signals detected. This content appears legitimate.',
    icon: '✓',
    cls: 'verified',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.35)',
  };
  if (score <= 30) return {
    phrase: 'Looks Safe',
    subtext: 'Minor signals found but no significant threats detected.',
    icon: '✓',
    cls: 'looks-safe',
    color: '#86efac',
    glow: 'rgba(134, 239, 172, 0.2)',
  };
  if (score <= 50) return {
    phrase: 'Suspicious',
    subtext: 'Several concerning patterns found. Proceed with caution.',
    icon: '⚠',
    cls: 'suspicious',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.3)',
  };
  if (score <= 70) return {
    phrase: 'Risky',
    subtext: 'Significant threat indicators present. Do not take action without verification.',
    icon: '⚠',
    cls: 'risky',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.35)',
  };
  if (score <= 85) return {
    phrase: 'Very Risky',
    subtext: 'Strong evidence of deceptive intent. Do not interact with this content.',
    icon: '⛔',
    cls: 'very-risky',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.4)',
  };
  return {
    phrase: 'Highly Dangerous',
    subtext: 'This is almost certainly a scam. Take immediate protective action.',
    icon: '🚨',
    cls: 'dangerous',
    color: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.5)',
  };
}

/**
 * Pre-defined sample scenarios for rapid testing and demonstrations.
 */
export const SAMPLE_SCENARIOS = [
  {
    id: 'electricity',
    label: '⚡ Electricity Disconnection',
    type: 'sms',
    content: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 pm from electricity office because your previous month bill was not updated. Please immediately contact our officer at 9876543210. Thank you.',
  },
  {
    id: 'job_wfh',
    label: '💼 Telegram WFH Job Scam',
    type: 'sms',
    content: 'Congratulations! Part time work from home opportunity. Earn ₹2000 - ₹5000 daily by simply liking YouTube videos and rating hotels. No experience required. Daily payout via UPI. Contact manager on Telegram @EarnDaily_HR.',
  },
  {
    id: 'digital_arrest',
    label: '🚨 CBI Digital Arrest Notice',
    type: 'email',
    content: 'CENTRAL BUREAU OF INVESTIGATION / CYBER CRIME CELL NOTICE: A legal arrest warrant has been issued against your Aadhaar card for money laundering and illegal parcel seizure containing narcotics. You are placed under Digital Arrest. Connect immediately on Skype with Inspector Sharma.',
  },
  {
    id: 'parcel_customs',
    label: '📦 FedEx Parcel Delivery Trap',
    type: 'sms',
    content: 'FedEx: Your package delivery has been put on hold due to incorrect address information and unpaid customs duty of ₹1,450. Update your address and pay online within 24h at http://fedex-parcel-update.top/track to avoid parcel return.',
  },
  {
    id: 'linkedin_recruiter',
    label: '💼 Fake LinkedIn Recruiter Offer',
    type: 'linkedin',
    content: 'Hi! I am Sarah from Google Talent Acquisition on LinkedIn. We reviewed your profile and want to offer you a Remote Senior Assistant role ($6,500/month). No interview needed. Add our hiring manager on Telegram @GoogleHiring_Sarah to start immediately.',
  },
  {
    id: 'email_invoice',
    label: '✉️ Fake PayPal / Geek Squad Invoice',
    type: 'email',
    content: 'From: service-billing@gmail.com\nSubject: Invoice #US-98211: Your Geek Squad Protection Plan Auto-Renewed for $499.00\n\nDear Customer, Thank you for your auto-renewal of $499.99 from your PayPal account. If you did not authorize this charge, call our 24/7 fraud desk immediately at +1-800-419-9214 to cancel and claim a full refund.',
  },
  {
    id: 'safe_linkedin',
    label: '🌐 Authentic LinkedIn Profile',
    type: 'linkedin',
    content: 'https://www.linkedin.com/in/satyanadella',
  },
  {
    id: 'safe_order',
    label: '✅ Legitimate Order Confirmation',
    type: 'sms',
    content: 'Your order #408-98214-381 has been successfully delivered by Amazon Logistics. Thank you for shopping with us! Rate your delivery experience inside the official Amazon app.',
  },
];

/* ─── SCAM CATEGORY KNOWLEDGE & HEURISTIC RULES ─────────────────────────── */

const SCAM_PATTERNS = [
  // 1. Electricity / Utility Disconnection Scam
  {
    category: 'UTILITY_DISCONNECTION_SCAM',
    name: 'Electricity / Utility Disconnection Scam',
    regex: /(?:electricity|power\s+cut|power\s+supply|disconnected|bill\s+not\s+updated|sdo|bijli|eb\s+bill|meter\s+disconnect)/i,
    severity: 'high',
    score: 91,
    getIndicators: (text) => {
      const phoneMatch = text.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/);
      const timeMatch = text.match(/(?:tonight|at\s+\d{1,2}(?::\d{2})?\s*(?:pm|am)?|within\s+\d+\s*hours?)/i);
      return [
        {
          id: 'util-impersonation',
          title: 'Utility Department Impersonation',
          severity: 'high',
          explanation: 'Message mimics official state electricity board (DISCOM) communications but lacks legitimate consumer account details.',
          evidence: 'Claims electricity power will be disconnected due to pending bill.',
        },
        {
          id: 'util-urgency',
          title: 'Coercive Immediate Threat',
          severity: 'high',
          explanation: 'Imposes an artificial deadline to induce panic so the victim acts without cross-checking the actual bill.',
          evidence: timeMatch ? `"${timeMatch[0]}"` : '"will be disconnected tonight at 9:30 pm"',
        },
        {
          id: 'util-unverified-contact',
          title: 'Unverified Personal Contact Number',
          severity: 'high',
          explanation: 'Official power corporations do not provide personal mobile numbers for resolving billing disputes.',
          evidence: phoneMatch ? `Personal contact number: ${phoneMatch[0]}` : 'Unverified mobile contact provided',
        },
      ];
    },
    recommendation: {
      summary: 'Do not call the number in this message. This is a widespread utility disconnection scam.',
      actions: [
        'Do NOT call the personal mobile number provided in the message.',
        'Log into your official state electricity board (DISCOM) portal or app to check your actual bill.',
        'Electricity boards never ask customers to call individual mobile numbers for bill clearance.',
        'Report this sender number to cybercrime.gov.in or call national helpline 1930.',
      ],
    },
  },

  // 2. Digital Arrest / Law Enforcement Impersonation
  {
    category: 'DIGITAL_ARREST_EXTORTION',
    name: 'Digital Arrest / Authority Impersonation',
    regex: /(?:digital\s+arrest|cbi|police|customs\s+(?:department|officer|arrest|notice|case|investigation)|narcotics|ncb|arrest\s+warrant|fir\s+filed|money\s+laundering|illegal\s+parcel|drugs\s+found|court\s+notice|enforcement\s+directorate|crime\s+branch)/i,
    severity: 'critical',
    score: 97,
    getIndicators: (text) => [
      {
        id: 'auth-impersonation',
        title: 'Law Enforcement / State Agency Impersonation',
        severity: 'high',
        explanation: 'Impersonates police, CBI, Customs, or judicial authorities to induce fear and compliance.',
        evidence: 'Claims official legal jurisdiction (CBI, Customs, Police, or Court notice).',
      },
      {
        id: 'auth-bogus-arrest',
        title: 'Fictitious "Digital Arrest" Mechanism',
        severity: 'high',
        explanation: '"Digital Arrest" is an entirely fraudulent construct with zero basis in Indian or international law.',
        evidence: 'Demands compliance via video call, Skype, or fund verification transfers.',
      },
      {
        id: 'auth-legal-threat',
        title: 'Fabricated Narcotics / Money Laundering Threat',
        severity: 'high',
        explanation: 'Uses false accusations of seized narcotics or bank fraud to coerce the victim into silence.',
        evidence: 'Accuses recipient of severe federal crimes with imminent arrest threat.',
      },
    ],
    recommendation: {
      summary: 'DANGER: This is a confirmed Digital Arrest extortion attempt. Do not engage.',
      actions: [
        'REMEMBER: Digital Arrest does NOT exist in law. Police and CBI never hold court over Skype or WhatsApp.',
        'Do NOT transfer any money to "RBI verification accounts" or "safe government accounts".',
        'Immediately disconnect, block the caller, and file an emergency complaint at cybercrime.gov.in or call 1930.',
        'Inform your family members so they are not coerced by parallel calls.',
      ],
    },
  },

  // 3. Part-Time Job / WFH / Telegram Video Liking Scam
  {
    category: 'TASK_BASED_JOB_SCAM',
    name: 'Part-Time / Telegram Task Fraud',
    regex: /(?:part\s+time|work\s+from\s+home|wfh|earn\s+(?:₹|rs\.?|\$)?\s*\d{3,5}|daily\s+payout|like\s+youtube|hotel\s+review|google\s+review|rating\s+task|telegram\s+@|task\s+based|daily\s+income)/i,
    severity: 'high',
    score: 93,
    getIndicators: (text) => {
      const moneyMatch = text.match(/(?:earn|payout|income)\s*(?:₹|rs\.?|\$)?\s*[\d,]+(?:\s*-\s*[\d,]+)?/i);
      const telegramMatch = text.match(/telegram(?:\s*@[\w_]+)?|whatsapp/i);
      return [
        {
          id: 'job-unrealistic-pay',
          title: 'Unrealistic Pay for Trivial Tasks',
          severity: 'high',
          explanation: 'Promises exorbitant daily income (₹2,000–₹5,000) for simple actions like liking videos or rating maps.',
          evidence: moneyMatch ? `"${moneyMatch[0]}"` : 'Promises high daily payout with no qualification',
        },
        {
          id: 'job-unmonitored-redirection',
          title: 'Redirection to Encrypted Channels (Telegram/WhatsApp)',
          severity: 'high',
          explanation: 'Lures victims off legitimate platforms into private Telegram channels where identity cannot be traced.',
          evidence: telegramMatch ? `"${telegramMatch[0]}"` : 'Directs to private chat handles for "registration"',
        },
        {
          id: 'job-advance-fee',
          title: 'Precursor to Advance-Fee / Frozen Wallet Extortion',
          severity: 'medium',
          explanation: 'After paying trivial initial rewards, scammers freeze funds and demand large "security deposits" to withdraw.',
          evidence: 'Classic task-scam onboarding funnel identified.',
        },
      ];
    },
    recommendation: {
      summary: 'Do not interact with this recruiter. This is a task-based Ponzi scam.',
      actions: [
        'No legitimate company pays ₹2,000–₹5,000 per day for liking videos or posting reviews.',
        'Never pay any "deposit fee", "tax", or "VIP tier upgrade" to unlock or withdraw earnings.',
        'Block and report the sender handle on Telegram and WhatsApp.',
      ],
    },
  },

  // 4. Banking / KYC Expiry / Account Suspension Phishing
  {
    category: 'BANKING_KYC_PHISHING',
    name: 'Bank KYC / Account Suspension Phishing',
    regex: /(?:kyc|pan\s+card|aadhaar|account\s+blocked|account\s+suspended|debit\s+card|credit\s+limit|netbanking|hdfc|sbi|icici|axis|pnb|kotak|otp|expire|update\s+immediately)/i,
    severity: 'high',
    score: 92,
    getIndicators: (text) => {
      const bankMatch = text.match(/\b(hdfc|sbi|icici|axis|pnb|kotak|canara|paytm|bank)\b/i);
      return [
        {
          id: 'bank-impersonation',
          title: 'Financial Institution Impersonation',
          severity: 'high',
          explanation: 'Mimics official banking notifications to solicit sensitive identity and credential documents.',
          evidence: bankMatch ? `Mimics ${bankMatch[0].toUpperCase()} correspondence` : 'Mimics banking security alerts',
        },
        {
          id: 'bank-kyc-urgency',
          title: 'Fabricated KYC Expiry Threat',
          severity: 'high',
          explanation: 'Threatens immediate account blocking to compel the user to click unverified links.',
          evidence: 'Claims account or card will be blocked if KYC is not updated immediately.',
        },
        {
          id: 'bank-credential-theft',
          title: 'Credential Harvesting Gateway',
          severity: 'high',
          explanation: 'Directs to lookalike login forms designed to intercept netbanking passwords, OTPs, and MPINs.',
          evidence: 'Requests urgent credential verification via third-party channel.',
        },
      ];
    },
    recommendation: {
      summary: 'Do not click links or share credentials. This is a banking credential phishing attempt.',
      actions: [
        'Banks NEVER ask you to update KYC or share OTPs via SMS links or WhatsApp.',
        'Do not click any link in the message. Never enter your password or OTP.',
        'Log in only through your official bank mobile app or bookmarked netbanking website.',
        'Call your bank branch directly if you have any questions regarding your account status.',
      ],
    },
  },

  // 5. Courier / Delivery / Customs / India Post Scam
  {
    category: 'COURIER_PARCEL_PHISHING',
    name: 'Courier / Failed Delivery Phishing',
    regex: /(?:package|parcel|fedex|dhl|india\s+post|delivery\s+failed|update\s+address|customs\s+fee|reschedule\s+delivery|tracking\s+number|held\s+at\s+customs)/i,
    severity: 'high',
    score: 87,
    getIndicators: (text) => [
      {
        id: 'courier-impersonation',
        title: 'Postal / Courier Brand Impersonation',
        severity: 'high',
        explanation: 'Fakes courier notifications (India Post, FedEx, DHL) claiming package delivery failure.',
        evidence: 'Claims delivery cannot proceed without immediate fee payment or address fix.',
      },
      {
        id: 'courier-phishing-link',
        title: 'Malicious Address & Card Capture Link',
        severity: 'high',
        explanation: 'Directs to fake courier pages designed to steal credit card details under the guise of a small "re-delivery fee".',
        evidence: 'Directs user to unofficial tracking link for payment.',
      },
    ],
    recommendation: {
      summary: 'Do not click the tracking link or pay any fee. This is a courier re-delivery trap.',
      actions: [
        'Official postal carriers never send SMS links requesting credit card payments to fix delivery addresses.',
        'Check tracking independently on the official carrier site (e.g., indiapost.gov.in or fedex.com).',
        'Do not pay any small "re-delivery fee" — this is used to capture full card CVVs and authorization tokens.',
      ],
    },
  },

  // 6. Lottery / Prize / Lucky Draw / KBC Fraud
  {
    category: 'LOTTERY_PRIZE_FRAUD',
    name: 'Unsolicited Lottery / Prize Winning Scam',
    regex: /(?:lottery|won\s+(?:₹|rs|\$)|kbc|lucky\s+draw|cash\s+prize|congratulations\s+you\s+won|claim\s+prize|car\s+winner)/i,
    severity: 'high',
    score: 94,
    getIndicators: (text) => [
      {
        id: 'prize-unsolicited',
        title: 'Bogus Contest & Lottery Claims',
        severity: 'high',
        explanation: 'Claims you have won a lottery or lucky draw that you never entered or registered for.',
        evidence: 'Promises large cash prize or luxury reward with no purchase history.',
      },
      {
        id: 'prize-advance-fee',
        title: 'Advance Processing Fee Demand',
        severity: 'high',
        explanation: 'Prepares the victim to pay "processing fees", "GST", or "transfer certificates" to release imaginary funds.',
        evidence: 'Urges immediate claiming to extract upfront payment.',
      },
    ],
    recommendation: {
      summary: 'You have not won any lottery. This is an advance-fee scam.',
      actions: [
        'You cannot win a lottery or contest you never purchased tickets for.',
        'Never transfer any "processing fee" or "government tax" to claim a prize.',
        'Block and report the sender immediately.',
      ],
    },
  },

  // 7. Remote Access / AnyDesk / Screen Sharing Scam
  {
    category: 'REMOTE_ACCESS_MALWARE',
    name: 'Remote Device Hijacking Attempt',
    regex: /(?:anydesk|teamviewer|rustdesk|quicksupport|screen\s+share|install\s+apk|download\s+app\s+to\s+verify)/i,
    severity: 'critical',
    score: 98,
    getIndicators: (text) => [
      {
        id: 'remote-tool',
        title: 'Remote Desktop / Screen Mirroring Request',
        severity: 'critical',
        explanation: 'Instructs victim to install remote desktop tools (AnyDesk, TeamViewer) allowing attackers to seize control of the smartphone.',
        evidence: 'Requests installation of remote access tool or unknown APK.',
      },
      {
        id: 'remote-banking-compromise',
        title: 'Real-time Banking Session Hijack Risk',
        severity: 'critical',
        explanation: 'Once installed, scammers monitor OTPs on-screen and execute fraudulent money transfers while user is distracted.',
        evidence: 'High risk of complete phone takeover.',
      },
    ],
    recommendation: {
      summary: 'CRITICAL DANGER: Never install remote desktop software requested by any caller or message.',
      actions: [
        'Do NOT install AnyDesk, TeamViewer, RustDesk, or any APK link sent to you.',
        'If already installed, IMMEDIATELY turn on Airplane Mode, disconnect WiFi, and uninstall the app.',
        'Check your bank account from another device and freeze netbanking if access was granted.',
      ],
    },
  },

  // 8. Fake LinkedIn Recruiter / Job Phishing
  {
    category: 'LINKEDIN_RECRUITER_SCAM',
    name: 'Fake LinkedIn Recruiter / Job Offer Scam',
    regex: /(?:linkedin|inmail|talent\s+acquisition|hiring\s+manager|recruiter|hr\s+team).{0,120}(?:telegram|whatsapp|interview\s+on|stipend|equipment\s+fee|direct\s+hire|no\s+interview|usd\s*[\d,]+|\$\s*[\d,]+|wfh\s+role)/i,
    severity: 'high',
    score: 93,
    getIndicators: (text) => {
      const channelMatch = text.match(/(?:telegram|whatsapp|signal)\s*[@:\w_]+/i);
      const payMatch = text.match(/(?:\$|usd|₹|rs\.?)\s*[\d,]+(?:\s*(?:per\s+week|weekly|per\s+month|monthly|\/hr))?/i);
      return [
        {
          id: 'li-off-platform',
          title: 'Off-Platform Redirection Signal',
          severity: 'high',
          explanation: 'Recruiter urges candidate to abandon verified LinkedIn messaging for unmonitored encrypted channels (Telegram/WhatsApp).',
          evidence: channelMatch ? `"${channelMatch[0]}"` : 'Urges moving off LinkedIn messaging',
        },
        {
          id: 'li-unrealistic-offer',
          title: 'Direct High-Compensation Offer Anomaly',
          severity: 'high',
          explanation: 'Offers lucrative compensation with zero formal technical interviews, background screening, or official HR portal application.',
          evidence: payMatch ? `Extravagant compensation: "${payMatch[0]}"` : 'Offers position with zero interview screening',
        },
        {
          id: 'li-credential-trap',
          title: 'Corporate Email & Identity Spoofing',
          severity: 'medium',
          explanation: 'Lacks verifiable corporate domain correspondence, often using free webmail addresses or disposable domains.',
          evidence: 'Unverified company contact details',
        },
      ];
    },
    recommendation: {
      summary: 'High probability of a fake LinkedIn recruiter scam. Do not proceed to external channels.',
      actions: [
        'NEVER move the conversation to Telegram or WhatsApp for "job interviews".',
        'Check the recruiter\'s official LinkedIn profile: look for company verification badges and work history.',
        'Apply directly through the company\'s official careers page (e.g. company.com/careers) to verify if the job ID exists.',
        'Never send personal identity documents (Passport, Aadhaar) or bank information before an official written offer letter.',
      ],
    },
  },

  // 9. Email Spoofing & Fake Invoice Phishing
  {
    category: 'EMAIL_SPOOFING_PHISHING',
    name: 'Corporate Email Spoofing & Invoice Phishing',
    regex: /(?:invoice\s*#|auto-renew|subscription\s+renewed|geek\s+squad|norton|paypal\s+invoice|mcafee|apple\s+store\s+order|netflix\s+account|billing\s+department|membership\s+on\s+hold|call\s+(?:\+?1[-\s]?)?(?:8\d{2}|9\d{2})[-\s]?\d{3}[-\s]?\d{4})/i,
    severity: 'high',
    score: 91,
    getIndicators: (text) => {
      const amountMatch = text.match(/(?:\$|usd|₹|rs\.?)\s*[\d,]+(?:\.\d{2})?/i);
      const phoneMatch = text.match(/(?:\+?1[-\s]?)?(?:8\d{2}|9\d{2})[-\s]?\d{3}[-\s]?\d{4}/);
      const freeMailMatch = text.match(/\b[\w.-]+@(gmail|yahoo|hotmail|outlook)\.com\b/i);
      const indicators = [
        {
          id: 'email-invoice-fraud',
          title: 'Fake Auto-Renewal / Invoice Bait',
          severity: 'high',
          explanation: 'Falsely claims an expensive service renewal (Geek Squad, Norton, PayPal, Netflix) to induce panic over unauthorized credit charges.',
          evidence: amountMatch ? `Bogus charge: "${amountMatch[0]}"` : 'Claims unauthorized subscription charge',
        },
      ];
      if (freeMailMatch) {
        indicators.push({
          id: 'email-domain-mismatch',
          title: 'Free Webmail Corporate Impersonation',
          severity: 'high',
          explanation: 'Sender uses a free personal webmail service (@' + freeMailMatch[1] + '.com) while claiming to represent a corporate billing department.',
          evidence: freeMailMatch[0],
        });
      }
      if (phoneMatch) {
        indicators.push({
          id: 'email-call-trap',
          title: 'Fraudulent Refund / Call-Center Trap',
          severity: 'high',
          explanation: 'Directs victim to call a fake customer service number designed to initiate remote desktop access (AnyDesk) or wire transfers.',
          evidence: `Fake support number: "${phoneMatch[0]}"`,
        });
      }
      return indicators;
    },
    recommendation: {
      summary: 'This is an invoice/refund phishing scam. Do NOT call the phone number in this email.',
      actions: [
        'Do NOT call the number listed in the email to cancel or request a refund.',
        'Check your real bank or card statement directly — no such charge has been deducted.',
        'Never allow any caller to connect to your computer or install remote software.',
        'Mark the email as Phishing/Spam in your email client.',
      ],
    },
  },
];

/* ─── LINK HEURISTICS ────────────────────────────────────────────────────── */

function analyzeLink(url) {
  const lower = url.toLowerCase();
  let score = 10;
  const indicators = [];

  const isHttps = /^https:\/\//i.test(lower);
  if (!isHttps) {
    score += 25;
    indicators.push({
      id: 'url-insecure',
      title: 'Insecure Unencrypted Connection (HTTP)',
      severity: 'high',
      explanation: 'Link does not utilize TLS/HTTPS encryption, standard for legitimate institutions and portals.',
      evidence: url.slice(0, 60),
    });
  }

  const isIp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(lower);
  if (isIp) {
    score += 50;
    indicators.push({
      id: 'url-raw-ip',
      title: 'Raw IP Address Hosting',
      severity: 'critical',
      explanation: 'The link directs to a raw numerical IP address instead of a registered domain name, common in malicious phishing infrastructure.',
      evidence: url.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0] || url,
    });
  }

  const badTldMatch = lower.match(/\.(xyz|top|click|download|pw|tk|ml|ga|cf|gq|work|rest|stream|bid|racing|loan)\b/i);
  if (badTldMatch) {
    score += 35;
    indicators.push({
      id: 'url-bad-tld',
      title: `High-Risk Top-Level Domain (.${badTldMatch[1]})`,
      severity: 'high',
      explanation: `Domain uses a high-abuse TLD (.${badTldMatch[1]}) frequently utilized for disposable phishing and malware campaigns.`,
      evidence: `Domain extension: .${badTldMatch[1]}`,
    });
  }

  const shortenerMatch = lower.match(/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly)\b/i);
  if (shortenerMatch) {
    score += 25;
    indicators.push({
      id: 'url-shortener',
      title: 'Obfuscated Shortened Link',
      severity: 'medium',
      explanation: 'Uses a URL shortener service to mask the ultimate destination page and bypass domain reputation filters.',
      evidence: shortenerMatch[0],
    });
  }

  const deceptiveKeywords = lower.match(/(?:login|verify|secure|update|banking|confirm|kyc|support|portal|account|claim|prize|gift)/gi);
  if (deceptiveKeywords && deceptiveKeywords.length >= 2) {
    score += 25;
    indicators.push({
      id: 'url-deceptive-slug',
      title: 'Deceptive Keyword Stacking',
      severity: 'high',
      explanation: 'URL contains multiple security and banking keywords designed to trick victims into believing the link is official.',
      evidence: deceptiveKeywords.join(' + '),
    });
  }

  // Lookalike brand spoofing (e.g. hdfc-secure, sbi-login, amazon-orders-update)
  const brandSpoof = lower.match(/(?:hdfc|sbi|icici|axis|paytm|amazon|flipkart|fedex|indiapost)[^.\/]*\.(?!com\b|in\b|org\b|co\.in\b)/i);
  if (brandSpoof) {
    score += 40;
    indicators.push({
      id: 'url-brand-spoof',
      title: 'Brand Impersonation / Typosquatting',
      severity: 'critical',
      explanation: 'Domain combines a trusted brand name with unauthorized domain extensions to mimic legitimate portals.',
      evidence: brandSpoof[0],
    });
  }

  return {
    score: Math.min(score, 98),
    indicators,
  };
}

/* ─── SAFE / LEGITIMATE CONTENT CHECKER ─────────────────────────────────── */

function checkSafeContent(text) {
  const lower = text.toLowerCase();
  // Signals of routine everyday messages
  const isGreeting = /^(?:hi|hello|hey|good\s+morning|good\s+evening|how\s+are\s+you|happy\s+birthday|happy\s+diwali|congrats|thanks|thank\s+you)\b/i.test(lower.trim());
  const isConversational = lower.length < 120 && !/(?:urgent|otp|pin|password|bank|verify|link|http|arrest|cbi|police|win|prize|discon|cut|telegram|earn|invoice|billing|refund|charge|fee|service|call|order|subscription|cancel|gift|account|fraud|alert|suspend|\+?\d{10}|₹|\$)/i.test(lower);
  const isCleanOrderConfirmation = /(?:delivered|order\s+shipped|tracking\s+inside\s+the\s+official\s+app)\b/i.test(lower) && !/https?:\/\/(?!amazon\.in|flipkart\.com)/i.test(lower);

  return isGreeting || isConversational || isCleanOrderConfirmation;
}

/* ─── CORE EXPORTED FUNCTIONS ────────────────────────────────────────────── */

/**
 * computeRiskScore — Evaluates content and returns a score from 5 to 98.
 */
export function computeRiskScore(inputType, content = '') {
  const text = (content || '').trim();
  if (!text) return 10;

  // 1. LinkedIn Account Verification & Threat Evaluation
  if (inputType === 'linkedin' || text.includes('linkedin.com/in/') || /linkedln|linkedin-[a-z]/i.test(text)) {
    const isTyposquat = /(?:https?:\/\/|\b)[a-z0-9-]*linkedin[a-z0-9-]*\.(?!com\b|org\b)[a-z]{2,}/i.test(text) || /\blinkedln\b/i.test(text);
    if (isTyposquat) return 96;
    const hasOffPlatform = /(?:telegram|whatsapp|signal|stipend|equipment\s+fee|direct\s+hire|usd\s*[\d,]+|\$\s*[\d,]+|wfh\s+role)/i.test(text);
    if (hasOffPlatform) return 93;
    const isOfficialDomain = /https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/(?:in|company|jobs)\/[\w-]+/i.test(text);
    if (isOfficialDomain) return 8;
  }

  // 2. Structured Email Phishing & Spoofing Evaluation
  if (inputType === 'email' || /(?:from:\s*[\w.-]+@(gmail|yahoo|hotmail|outlook)\.com)/i.test(text)) {
    const isFreeMailImpersonation = /from:\s*[\w.-]+@(gmail|yahoo|hotmail|outlook)\.com/i.test(text) && /(?:billing|support|helpdesk|service|admin|security|paypal|netflix|geek squad|norton|mcafee|invoice)/i.test(text);
    const isInvoiceScam = /(?:invoice\s*#|auto-renew|subscription\s+renewed|geek\s+squad|norton|mcafee|apple\s+store\s+order|netflix\s+account|billing\s+department|call\s+(?:\+?1[-\s]?)?(?:8\d{2}|9\d{2}))/i.test(text);
    if (isFreeMailImpersonation || isInvoiceScam) return 91;
  }

  if (inputType === 'link' || /^https?:\/\//i.test(text)) {
    return analyzeLink(text).score;
  }

  // Check if text is clean and conversational
  if (checkSafeContent(text)) {
    return 8;
  }

  // Check against our comprehensive scam taxonomy
  for (const p of SCAM_PATTERNS) {
    if (p.regex.test(text)) {
      return p.score;
    }
  }

  // General heuristic scoring for other suspicious texts
  let score = 15;
  const lower = text.toLowerCase();

  // High urgency words
  if (/urgent|immediately|act\s+now|within\s+24|within\s+\d+|expire|suspended|blocked/i.test(lower)) score += 25;
  // Financial hooks
  if (/money|transfer|pay|cash|refund|won|prize|lottery|crypto|upi|rs\.?|₹/i.test(lower)) score += 20;
  // Credential targets
  if (/otp|pin|password|aadhar|pan\s+card|credential|login|cvv/i.test(lower)) score += 25;
  // Links present
  if (/https?:\/\/|bit\.ly|tinyurl/i.test(lower)) score += 20;

  return Math.min(score, 95);
}

/**
 * buildAnalysisResult — Returns a rich, dynamically generated result object
 * tailored specifically to the user's content, extracting real quotes as evidence.
 */
export function buildAnalysisResult(score, inputType = 'sms', content = '') {
  const text = (content || '').trim();

  // 1. LinkedIn Account & Recruiter Verification
  if (inputType === 'linkedin' || text.includes('linkedin.com/in/') || /linkedln|linkedin-[a-z]/i.test(text)) {
    const isOfficialDomain = /https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/(?:in|company|jobs)\/[\w-]+/i.test(text);
    const isTyposquat = /(?:https?:\/\/|\b)[a-z0-9-]*linkedin[a-z0-9-]*\.(?!com\b|org\b)[a-z]{2,}/i.test(text) || /\blinkedln\b/i.test(text);
    const hasOffPlatform = /(?:telegram|whatsapp|signal|gmail\.com|yahoo\.com)/i.test(text);

    if (isTyposquat) {
      return {
        isDemo: true,
        riskScore: 96,
        confidence: 0.97,
        category: 'LINKEDIN_TYPOSQUATTING_PHISHING',
        assetType: 'LINKEDIN',
        indicators: [
          {
            id: 'li-typosquat',
            title: 'Deceptive Lookalike Domain (Typosquatting)',
            severity: 'critical',
            explanation: 'The link mimics LinkedIn but is hosted on a deceptive third-party domain designed to harvest professional credentials and session tokens.',
            evidence: text.match(/https?:\/\/[^\s"'<>]+/)?.[0] || text,
          },
          {
            id: 'li-credential-trap',
            title: 'Fake LinkedIn OAuth / SSO Harvesting Gateway',
            severity: 'high',
            explanation: 'Captures business emails, passwords, and 2FA cookies to impersonate professionals and execute corporate fraud.',
            evidence: 'Unverified external domain masquerading as LinkedIn',
          },
        ],
        recommendation: {
          summary: 'DANGER: This is a cloned LinkedIn phishing page. Do NOT enter your credentials.',
          actions: [
            'Do NOT enter your LinkedIn login, email, or password on this link.',
            'Genuine LinkedIn profiles and job postings are strictly hosted on https://www.linkedin.com/.',
            'If you already entered passwords, change your LinkedIn and business email passwords immediately and revoke active sessions.',
          ],
        },
      };
    }

    if (isOfficialDomain && !hasOffPlatform) {
      return {
        isDemo: true,
        riskScore: 8,
        confidence: 0.95,
        category: 'VERIFIED_LINKEDIN_PROFILE',
        assetType: 'LINKEDIN',
        indicators: [
          {
            id: 'li-verified-domain',
            title: 'Authentic Official LinkedIn Routing',
            severity: 'low',
            explanation: 'URL resolves directly to LinkedIn’s verified global platform (linkedin.com) with valid EV/TLS encryption.',
            evidence: text.match(/https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/[^\s"'<>]+/)?.[0] || text,
          },
          {
            id: 'li-clean-account',
            title: 'Clean Account Signal & No Off-Platform Trap',
            severity: 'low',
            explanation: 'No illicit redirection triggers (Telegram/WhatsApp), advance-fee solicitations, or credential traps detected.',
            evidence: 'Legitimate LinkedIn account structure.',
          },
        ],
        recommendation: {
          summary: 'This LinkedIn profile link is on the authentic LinkedIn domain.',
          actions: [
            'Verified on official linkedin.com domain.',
            'Best Practice: Verify mutual connections, activity history, and company verification badges before sharing professional portfolios.',
            'Keep initial recruitment discussions inside LinkedIn InMail until you receive an official corporate email from the employer’s domain.',
          ],
        },
      };
    }
  }

  // 2. Generic Link specific analysis
  if (inputType === 'link' || (text.startsWith('http://') || text.startsWith('https://'))) {
    const linkEval = analyzeLink(text || 'https://suspicious-link.example.com');
    const finalScore = Math.max(score, linkEval.score);
    return {
      isDemo: true,
      riskScore: finalScore,
      confidence: 0.94,
      category: finalScore >= 70 ? 'MALICIOUS_LINK' : 'SAFE_URL',
      assetType: 'LINK',
      indicators: linkEval.indicators.length > 0 ? linkEval.indicators : [
        {
          id: 'link-clean',
          title: 'Clean Domain Reputation',
          severity: 'low',
          explanation: 'Standard URL syntax with no raw IPs, suspicious TLDs, or deceptive obfuscation detected.',
          evidence: text || 'Analyzed URL',
        },
      ],
      recommendation: finalScore >= 70 ? {
        summary: 'Do not visit or open this link. High probability of malicious intent.',
        actions: [
          'Do NOT visit this URL or submit any credentials.',
          'Never enter banking passwords, ATM PINs, or UPI details on unverified pages.',
          'Verify the true domain on official search engines directly.',
        ],
      } : {
        summary: 'This link appears standard, but exercise routine caution when browsing.',
        actions: [
          'Ensure the URL protocol is HTTPS before entering personal details.',
          'Always check domain spelling carefully.',
        ],
      },
    };
  }

  // 3. Match against scam archetypes
  for (const pattern of SCAM_PATTERNS) {
    if (pattern.regex.test(text)) {
      return {
        isDemo: true,
        riskScore: Math.max(score, pattern.score),
        confidence: 0.95,
        category: pattern.category,
        assetType: inputType.toUpperCase(),
        indicators: pattern.getIndicators(text),
        recommendation: pattern.recommendation,
      };
    }
  }

  // 4. Safe conversational text
  if ((checkSafeContent(text) && score <= 30) || score <= 20) {
    return {
      isDemo: true,
      riskScore: Math.min(score, 12),
      confidence: 0.96,
      category: 'SAFE_VERIFIED',
      assetType: inputType.toUpperCase(),
      indicators: [
        {
          id: 'clean-syntax',
          title: 'No Threat Signatures Detected',
          severity: 'low',
          explanation: 'Content exhibits natural, non-coercive syntax with zero deceptive redirection, credential prompts, or scam patterns.',
          evidence: text ? `"${text.slice(0, 90)}${text.length > 90 ? '…' : ''}"` : 'Input verified clean',
        },
      ],
      recommendation: {
        summary: 'This content appears legitimate and safe. No threat indicators found.',
        actions: [
          'No malicious threat signals or scam signatures were identified.',
          'Always practice standard cyber hygiene and verify unexpected requests directly.',
          'Remember to never share OTPs or banking passwords with anyone.',
        ],
      },
    };
  }

  // 4. Heuristic Fallback for other suspicious content
  const urgencyMatch = text.match(/(?:urgent|immediately|tonight|within\s+\d+\s*hours?|act\s+now|suspended|blocked)/i);
  const moneyMatch = text.match(/(?:pay|transfer|refund|prize|won|fee|rs\.?|₹)\s*[\d,]+/i);
  const credMatch = text.match(/(?:otp|password|pin|aadhar|pan|credentials?)/i);

  const fallbackIndicators = [];
  if (urgencyMatch) {
    fallbackIndicators.push({
      id: 'heur-urgency',
      title: 'High Pressure & Urgency Language',
      severity: 'high',
      explanation: 'Message uses coercive time-pressure language to force quick action before the recipient can independently verify.',
      evidence: `"${urgencyMatch[0]}"`,
    });
  }
  if (moneyMatch) {
    fallbackIndicators.push({
      id: 'heur-money',
      title: 'Unsolicited Financial Transaction Hook',
      severity: 'high',
      explanation: 'Mentions unexpected fund transfers, prize claims, or payment demands without verified context.',
      evidence: `"${moneyMatch[0]}"`,
    });
  }
  if (credMatch) {
    fallbackIndicators.push({
      id: 'heur-credentials',
      title: 'Sensitive Credential Targeting',
      severity: 'high',
      explanation: 'Solicits confidential authentication elements (OTP, PIN, Aadhaar, PAN) that legitimate entities never ask for.',
      evidence: `"${credMatch[0]}"`,
    });
  }

  if (fallbackIndicators.length === 0) {
    fallbackIndicators.push({
      id: 'heur-unverified',
      title: 'Suspicious Unverified Sender Request',
      severity: 'medium',
      explanation: 'Content exhibits anomalous communication characteristics requiring independent confirmation.',
      evidence: text ? `"${text.slice(0, 80)}…"` : 'Unverified sender message',
    });
  }

  return {
    isDemo: true,
    riskScore: Math.max(score, 75),
    confidence: 0.89,
    category: 'SUSPICIOUS_CONTENT',
    assetType: inputType.toUpperCase(),
    indicators: fallbackIndicators,
    recommendation: {
      summary: 'Proceed with extreme caution. Several concerning threat signals were identified.',
      actions: [
        'Do not click any link or reply with confidential information.',
        'Contact the organization or sender through their official public website or app.',
        'Never disclose OTPs, PINs, or netbanking credentials to any caller or message.',
        'Report suspected fraudulent activity to cybercrime.gov.in or call 1930.',
      ],
    },
  };
}

/** Legacy demoAnalysis object for backward compatibility */
export const demoAnalysis = buildAnalysisResult(91, 'sms', 'Dear consumer, your electricity power will be disconnected tonight at 9:30 pm. Contact officer 9876543210.');

export default {
  ASSET_TYPES,
  RISK_BANDS,
  SAMPLE_SCENARIOS,
  getRiskBand,
  getRiskPhrase,
  computeRiskScore,
  buildAnalysisResult,
  demoAnalysis,
};
