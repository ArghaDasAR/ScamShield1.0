export default function RiskBadge({ severity, className = '' }) {
  const config = {
    CRITICAL: { text: 'Critical Risk', cls: 'risk-critical' },
    HIGH: { text: 'High Risk', cls: 'risk-high' },
    SUSPICIOUS: { text: 'Maybe Suspicious', cls: 'risk-suspicious' },
    MEDIUM: { text: 'Suspicious', cls: 'risk-medium' },
    MODERATE: { text: 'Caution Advised', cls: 'risk-medium' },
    LOW: { text: 'Likely Safe', cls: 'risk-low' },
  };
  const { text, cls } = config[severity] || config.LOW;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${cls} ${className}`}>
      {text}
    </span>
  );
}
