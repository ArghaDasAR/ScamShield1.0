// Demo scam content for hackathon demonstration
// Includes HIGH, MEDIUM, and LOW risk examples

export const demoScams = [
  {
    id: 'electricity-scam',
    label: 'Electricity Scam',
    type: 'message',
    category: 'SMS / WhatsApp',
    icon: 'zap',
    content: `URGENT! Your electricity connection will be disconnected tonight at 9:30 PM due to non-payment of outstanding bill ₹1,499. To avoid disconnection, call our helpline immediately or pay via this link: http://bescom-payment-urgent.xyz/pay

This is your final notice. Failure to pay will result in immediate disconnection and restoration charges of ₹2,500.

— BESCOM Customer Care`,
    expectedResult: {
      riskScore: 94,
      severity: 'CRITICAL',
      verdict: 'CRITICAL DANGER / SCAM',
      tactics: [
        { name: 'Authority Impersonation', description: 'Impersonates BESCOM, a trusted electricity provider.', icon: 'shield-alert', color: 'red' },
        { name: 'Urgency', description: 'Creates immediate time pressure with "tonight at 9:30 PM".', icon: 'clock', color: 'red' },
        { name: 'Threat', description: 'Threatens service disconnection and penalty charges.', icon: 'alert-triangle', color: 'red' },
        { name: 'Financial Coercion', description: 'Pressures victim to make an immediate payment.', icon: 'credit-card', color: 'red' },
        { name: 'Suspicious Link', description: 'Domain "bescom-payment-urgent.xyz" is not the official provider domain.', icon: 'link', color: 'red' },
      ],
      recommendations: [
        'Do not click the link or make any payment.',
        'Open the official BESCOM app or website manually.',
        'Verify through the official helpline number.',
        'Never share OTP or banking details.',
        'Report this scam to cybercrime.gov.in',
      ],
      extractedText: 'URGENT electricity disconnection payment ₹1,499 tonight final notice',
      urlRisk: 'Malicious',
    },
  },
  {
    id: 'kyc-scam',
    label: 'Fake KYC',
    type: 'message',
    category: 'SMS / WhatsApp',
    icon: 'user-x',
    content: `Dear Customer, Your KYC verification is expired. Your bank account will be blocked within 24 hours. Complete KYC now: http://sbi-kyc-update.in/verify

Enter your account number, Aadhaar number and OTP to avoid account suspension.

— SBI Customer Support`,
    expectedResult: {
      riskScore: 78,
      severity: 'HIGH',
      verdict: 'HIGH RISK SCAM',
      tactics: [
        { name: 'Authority Impersonation', description: 'Impersonates SBI, a major trusted bank.', icon: 'shield-alert', color: 'red' },
        { name: 'Urgency', description: 'Sets 24-hour deadline to pressure immediate action.', icon: 'clock', color: 'red' },
        { name: 'Threat', description: 'Threatens account blocking to coerce compliance.', icon: 'alert-triangle', color: 'red' },
        { name: 'Suspicious Link', description: '"sbi-kyc-update.in" is not the official SBI domain.', icon: 'link', color: 'red' },
        { name: 'Data Harvesting', description: 'Requests sensitive Aadhaar and banking credentials.', icon: 'database', color: 'red' },
      ],
      recommendations: [
        'Do not click the link or enter any details.',
        'Open the official SBI app (YONO) directly.',
        'Visit your nearest SBI branch for KYC.',
        'Banks never ask for OTP over SMS or links.',
        'Report to SBI fraud helpline: 1800-11-2211',
      ],
      extractedText: 'KYC expired account blocked Aadhaar OTP bank credentials',
      urlRisk: 'Suspicious Domain',
    },
  },
  {
    id: 'suspicious-website',
    label: 'Maybe Suspicious Site',
    type: 'url',
    category: 'Website Check',
    icon: 'link',
    content: 'https://mega-discount-portal-sale2026.shop/checkout?ref=telegram',
    expectedResult: {
      riskScore: 60,
      severity: 'SUSPICIOUS',
      verdict: 'MAYBE SUSPICIOUS',
      tactics: [
        { name: 'Uncommon TLD', description: 'Uses generic high-risk commercial TLD (.shop) registered recently.', icon: 'globe', color: 'orange' },
        { name: 'Social Referral Lead', description: 'Inbound referral tag originating from unmoderated messaging channel.', icon: 'link', color: 'orange' },
        { name: 'Excessive Discount Cue', description: 'Appeals to impulsive buying behavior without verified brand identity.', icon: 'alert-triangle', color: 'orange' },
      ],
      recommendations: [
        'Exercise caution before entering any payment details or card numbers.',
        'Verify customer reviews on independent consumer protection boards.',
        'Look for legitimate merchant business address and contact support.',
        'Prefer secure payment gateways with virtual cards or COD if testing.',
      ],
      extractedText: 'mega-discount-portal-sale2026.shop checkout telegram referral',
      urlRisk: 'Suspicious Domain',
    },
  },
  {
    id: 'bank-alert',
    label: 'Bank Alert',
    type: 'email',
    category: 'Email',
    icon: 'mail',
    sender: 'security-alert@hdfc-bank-verification.com',
    subject: 'URGENT: Suspicious Activity Detected on Your Account',
    content: `Dear Account Holder,

We have detected suspicious activity on your HDFC Bank account. As a precautionary measure, your account has been temporarily limited.

To restore full access, please verify your identity within 2 hours:
→ Click here: http://hdfc-secure-verify.net/login

Required information:
• Account Number
• Internet Banking Password  
• OTP sent to registered mobile

Failure to verify within 2 hours will result in permanent account suspension.

HDFC Bank Security Team`,
    expectedResult: {
      riskScore: 89,
      severity: 'CRITICAL',
      verdict: 'CRITICAL DANGER / SCAM',
      tactics: [
        { name: 'Authority Impersonation', description: 'Uses HDFC Bank branding from a fake domain.', icon: 'shield-alert', color: 'red' },
        { name: 'Urgency', description: '2-hour deadline creates panic and rushed decisions.', icon: 'clock', color: 'red' },
        { name: 'Threat', description: 'Threatens permanent account suspension.', icon: 'alert-triangle', color: 'red' },
        { name: 'Suspicious Link', description: '"hdfc-secure-verify.net" is not HDFC Bank\'s official domain.', icon: 'link', color: 'red' },
        { name: 'Credential Harvesting', description: 'Requests password and OTP — banks never do this via email.', icon: 'key', color: 'red' },
      ],
      recommendations: [
        'Do not click any links in this email.',
        'Login directly via hdfcbank.com (type manually).',
        'Banks never ask for passwords via email.',
        'Contact HDFC Bank at 1800-202-6161.',
        'Forward the email to phishing@hdfcbank.com',
      ],
      extractedText: 'Suspicious activity HDFC account limited verify password OTP suspension',
      urlRisk: 'Malicious',
    },
  },
  {
    id: 'upi-cashback',
    label: 'UPI Cashback',
    type: 'message',
    category: 'SMS / WhatsApp',
    icon: 'gift',
    content: `Congratulations! 🎉 You have won ₹5,000 UPI cashback reward! 

To claim your reward, click: http://gpay-cashback-reward.co.in/claim

Enter your UPI PIN to receive the amount in 2 minutes. Offer expires in 30 minutes!

— Google Pay Rewards Team`,
    expectedResult: {
      riskScore: 74,
      severity: 'HIGH',
      verdict: 'HIGH RISK SCAM',
      tactics: [
        { name: 'False Authority', description: 'Impersonates Google Pay reward system.', icon: 'shield-alert', color: 'red' },
        { name: 'Urgency', description: '30-minute expiry creates artificial time pressure.', icon: 'clock', color: 'orange' },
        { name: 'Financial Coercion', description: 'Requests UPI PIN — sharing this grants full account access.', icon: 'credit-card', color: 'red' },
        { name: 'Suspicious Link', description: '"gpay-cashback-reward.co.in" is not a Google domain.', icon: 'link', color: 'red' },
      ],
      recommendations: [
        'Never share your UPI PIN with anyone.',
        'You receive cashback — you never need to enter a PIN.',
        'Open Google Pay app directly to check rewards.',
        'Report via the Google Pay in-app fraud reporting.',
      ],
      extractedText: 'UPI cashback reward won claim PIN 30 minutes Google Pay',
      urlRisk: 'Suspicious Domain',
    },
  },
  {
    id: 'legitimate-bill',
    label: 'Legit Reminder',
    type: 'message',
    category: 'SMS / WhatsApp',
    icon: 'check-circle',
    content: `Your electricity bill of ₹843 for account 7845231 is due on 15th April 2025. 

Pay online at bescom.org or visit your nearest payment center.

— BESCOM`,
    expectedResult: {
      riskScore: 9,
      severity: 'LOW',
      verdict: 'LIKELY SAFE / VERIFIED',
      tactics: [],
      recommendations: [
        'This message appears to be a standard utility reminder.',
        'Always verify by logging into bescom.org directly.',
        'When in doubt, call the official helpline.',
      ],
      extractedText: 'Electricity bill ₹843 due April BESCOM',
      urlRisk: 'Safe',
    },
  },
  {
    id: 'suspicious-url',
    label: 'Fake Bank URL',
    type: 'url',
    category: 'Suspicious URL',
    icon: 'link',
    content: 'https://secure-sbi-netbanking-login.xyz/auth/verify',
    expectedResult: {
      riskScore: 88,
      severity: 'CRITICAL',
      verdict: 'CRITICAL DANGER / SCAM',
      tactics: [
        { name: 'Domain Spoofing', description: 'URL mimics SBI\'s branding but uses .xyz TLD.', icon: 'globe', color: 'red' },
        { name: 'Authority Impersonation', description: 'Uses "sbi-netbanking" keywords to appear legitimate.', icon: 'shield-alert', color: 'red' },
        { name: 'Suspicious Link', description: 'Non-official domain with misleading subdomain structure.', icon: 'link', color: 'red' },
      ],
      recommendations: [
        'Do not visit this URL.',
        'Access SBI NetBanking only at onlinesbi.sbi.',
        'Bookmark the official URL to avoid phishing.',
        'Report at cybercrime.gov.in',
      ],
      extractedText: 'secure-sbi-netbanking-login.xyz auth verify',
      urlRisk: 'Malicious',
    },
  },
];

export const getScamById = (id) => demoScams.find(s => s.id === id);
export const getRandomScam = () => demoScams[Math.floor(Math.random() * demoScams.length)];

