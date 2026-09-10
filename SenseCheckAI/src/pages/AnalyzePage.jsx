import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LogoMark from '../components/LogoMark'
import MatrixRain from '../components/MatrixRain'
import { uploadToCloudinary, validateFile } from '../services/cloudinary'
import { extractTextFromImage } from '../services/ocr'
import { getRiskPhrase, computeRiskScore, buildAnalysisResult, SAMPLE_SCENARIOS } from '../data/demoAnalysis'
import api from '../services/api'

/* ─── Flow states ──────────────────────────────────────────────────────── */
const FLOW = {
  IDLE:       'idle',
  UPLOADING:  'uploading',
  PROCESSING: 'processing',
  SCAN_DONE:  'scan_done',
  RESULT:     'result',
  ERROR:      'error',
}

/* ─── Input type tabs ───────────────────────────────────────────────────── */
const INPUT_TYPES = [
  { id: 'image',    label: 'Image',            icon: '📸', placeholder: null },
  { id: 'sms',      label: 'SMS / Text',       icon: '💬', placeholder: 'Paste the suspicious SMS or text message here…' },
  { id: 'email',    label: 'Email',            icon: '✉️',  placeholder: 'Paste the suspicious email message or body here…' },
  { id: 'linkedin', label: 'LinkedIn Verify',  icon: '💼', placeholder: 'Paste LinkedIn profile URL or recruiter message…' },
  { id: 'link',     label: 'Link / URL',       icon: '🔗', placeholder: null },
]

/* ─── Analysis stages per input type ───────────────────────────────────── */
const STAGES = {
  image: [
    { id: 'receive',    label: 'Receiving visual evidence'          },
    { id: 'optimize',   label: 'Optimising image via Cloudinary'    },
    { id: 'ocr',        label: 'Extracting text content (OCR)'      },
    { id: 'patterns',   label: 'Analysing suspicious patterns'      },
    { id: 'indicators', label: 'Checking threat indicators'         },
    { id: 'explain',    label: 'Generating explanation'             },
  ],
  sms: [
    { id: 'receive',    label: 'Reading message content'            },
    { id: 'parse',      label: 'Parsing sender and structure'       },
    { id: 'urgency',    label: 'Detecting urgency patterns'         },
    { id: 'phrases',    label: 'Checking known scam phrases'        },
    { id: 'indicators', label: 'Evaluating threat indicators'       },
    { id: 'explain',    label: 'Generating explanation'             },
  ],
  email: [
    { id: 'headers',    label: 'Parsing email headers & sender'     },
    { id: 'body',       label: 'Extracting email body & links'      },
    { id: 'sender',     label: 'Checking corporate domain spoofing' },
    { id: 'phishing',   label: 'Detecting invoice & credential bait'},
    { id: 'indicators', label: 'Evaluating threat indicators'       },
    { id: 'explain',    label: 'Generating explanation'             },
  ],
  linkedin: [
    { id: 'profile',    label: 'Resolving LinkedIn account / URL'   },
    { id: 'domain',     label: 'Verifying official domain integrity'},
    { id: 'recruiter',  label: 'Analysing recruiter communication'  },
    { id: 'redirects',  label: 'Detecting off-platform traps'       },
    { id: 'indicators', label: 'Checking trust & safety signals'    },
    { id: 'explain',    label: 'Generating verification report'     },
  ],
  link: [
    { id: 'resolve',    label: 'Resolving URL structure'            },
    { id: 'domain',     label: 'Checking domain reputation'         },
    { id: 'lookalike',  label: 'Detecting lookalike domains'        },
    { id: 'patterns',   label: 'Analysing URL patterns'             },
    { id: 'indicators', label: 'Evaluating threat indicators'       },
    { id: 'explain',    label: 'Generating explanation'             },
  ],
}

const STAGE_MS = 900

export default function AnalyzePage() {
  const [flow,        setFlow]        = useState(FLOW.IDLE)
  const [inputType,   setInputType]   = useState('image')
  const [dragOver,    setDragOver]    = useState(false)
  const [file,        setFile]        = useState(null)
  const [previewUrl,  setPreviewUrl]  = useState(null)
  const [textContent, setTextContent] = useState('')
  const [urlContent,  setUrlContent]  = useState('')
  const [uploadPct,   setUploadPct]   = useState(0)
  const [stageIdx,    setStageIdx]    = useState(-1)
  const [result,      setResult]      = useState(null)
  const [errorMsg,    setErrorMsg]    = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [emailSender,   setEmailSender]   = useState('')
  const [emailSubject,  setEmailSubject]  = useState('')
  const fileInputRef = useRef(null)

  const stages = STAGES[inputType] || STAGES.image

  /* ─── Core analysis runner ─────────────────────────────────────────────── */
  const runAnalysis = useCallback(async (content = '', uploadData = null, extraContext = null) => {
    setFlow(FLOW.PROCESSING)
    setStageIdx(-1)

    // Trigger backend analysis in parallel with UI stage animation
    const analysisPromise = api.scan.analyze({
      inputType,
      content,
      cloudinaryUrl: uploadData?.url,
      publicId: uploadData?.publicId,
      sender: extraContext?.sender,
      subject: extraContext?.subject,
    })

    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
      setStageIdx(i)
      await new Promise(r => setTimeout(r, STAGE_MS))
    }

    // Cinematic SCAN COMPLETE flash
    setStageIdx(stages.length)
    setFlow(FLOW.SCAN_DONE)
    await new Promise(r => setTimeout(r, 1200))

    try {
      const finalResult = await analysisPromise
      setResult(finalResult)
    } catch {
      const score = computeRiskScore(inputType, content)
      setResult(buildAnalysisResult(score, inputType, content))
    }

    setFlow(FLOW.RESULT)
  }, [stages, inputType])

  /* ─── Image upload & OCR sensing ───────────────────────────────────────── */
  const handleFile = useCallback(async (f) => {
    const v = validateFile(f)
    if (!v.ok) { setErrorMsg(v.error); setFlow(FLOW.ERROR); return }

    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setFlow(FLOW.UPLOADING)
    setUploadPct(15)
    setErrorMsg('')
    setExtractedText('')

    try {
      // 1. Concurrently run client-side OCR sensing & server upload payload
      const ocrPromise = extractTextFromImage(f, pct => {
        setUploadPct(15 + Math.round(pct * 0.7))
      })
      const uploadPromise = api.scan.uploadImage(f)

      const [ocrRes, uploadRes] = await Promise.allSettled([ocrPromise, uploadPromise])

      const sensedText = (ocrRes.status === 'fulfilled' && ocrRes.value?.text)
        ? ocrRes.value.text.trim()
        : ''
      const uploadData = uploadRes.status === 'fulfilled' ? uploadRes.value : null

      setExtractedText(sensedText)

      // Feed the REAL sensed text into the scam analysis engine!
      const contentToAnalyze = sensedText || f.name || 'image.jpg'
      await runAnalysis(contentToAnalyze, uploadData)
    } catch (err) {
      console.warn('Image analysis warning:', err.message)
      await runAnalysis(f.name || 'image.jpg')
    }
  }, [runAnalysis])

  /* ─── Text / URL / Email / LinkedIn submission ─────────────────────────── */
  const handleTextSubmit = useCallback(async () => {
    let content = ''
    let sender = undefined
    let subject = undefined

    if (inputType === 'link') {
      content = urlContent.trim()
    } else if (inputType === 'email') {
      sender = emailSender.trim() || undefined
      subject = emailSubject.trim() || undefined
      const parts = []
      if (emailSender.trim()) parts.push(`From: ${emailSender.trim()}`)
      if (emailSubject.trim()) parts.push(`Subject: ${emailSubject.trim()}`)
      if (textContent.trim()) parts.push(textContent.trim())
      content = parts.join('\n')
    } else if (inputType === 'linkedin') {
      const parts = []
      if (urlContent.trim()) parts.push(urlContent.trim())
      if (textContent.trim()) parts.push(textContent.trim())
      content = parts.join('\n\n')
    } else {
      content = textContent.trim()
    }

    if (!content) {
      setErrorMsg('Please enter some content or link to analyze.')
      setFlow(FLOW.ERROR)
      return
    }
    setErrorMsg('')
    await runAnalysis(content, null, { sender, subject })
  }, [inputType, textContent, urlContent, emailSender, emailSubject, runAnalysis])

  /* ─── Drag & drop ──────────────────────────────────────────────────────── */
  const onDrop      = useCallback((e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }, [handleFile])
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true)  }
  const onDragLeave = ()  => setDragOver(false)
  const onInput     = (e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }

  /* ─── Sample loader ─────────────────────────────────────────────────────── */
  const loadSample = (sample) => {
    setInputType(sample.type)
    setEmailSender('')
    setEmailSubject('')
    if (sample.type === 'link') {
      setUrlContent(sample.content)
      setTextContent('')
    } else if (sample.type === 'email' && sample.content.includes('From:')) {
      const lines = sample.content.split('\n')
      const fromLine = lines.find(l => l.startsWith('From: '))
      const subjLine = lines.find(l => l.startsWith('Subject: '))
      const bodyLines = lines.filter(l => !l.startsWith('From: ') && !l.startsWith('Subject: '))
      if (fromLine) setEmailSender(fromLine.replace('From: ', ''))
      if (subjLine) setEmailSubject(subjLine.replace('Subject: ', ''))
      setTextContent(bodyLines.join('\n').trim())
      setUrlContent('')
    } else {
      setTextContent(sample.content)
      setUrlContent('')
    }
  }

  /* ─── Reset ─────────────────────────────────────────────────────────────── */
  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFlow(FLOW.IDLE); setFile(null); setPreviewUrl(null)
    setTextContent(''); setUrlContent(''); setEmailSender(''); setEmailSubject(''); setExtractedText('')
    setUploadPct(0); setStageIdx(-1); setResult(null); setErrorMsg('')
  }

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [])

  const phrase        = result ? getRiskPhrase(result.riskScore) : null
  const isProcessing  = flow === FLOW.PROCESSING || flow === FLOW.SCAN_DONE

  return (
    <div className="analyze-page">

      {/* ── HEADER ── */}
      <header className="analyze-header">
        <Link to="/" className="logo" aria-label="Sense Check.ai — Home">
          <LogoMark size={20} />
          <span>Sense Check<span className="logo-suffix">.ai</span></span>
        </Link>
        <span style={{ justifySelf: 'center', fontSize: 16, fontWeight: 500, color: '#9a9a9a', letterSpacing: '-0.01em' }}>
          Threat Analysis
        </span>
        <div style={{ justifySelf: 'end' }}>
          {flow !== FLOW.IDLE && (
            <button onClick={reset} className="btn btn-ghost" style={{ fontSize: 13, height: 36 }} type="button">
              New Analysis
            </button>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="analyze-body">

        {/* ════════════════════ IDLE ════════════════════════ */}
        {flow === FLOW.IDLE && (
          <>
            <div style={{ textAlign: 'center', maxWidth: 580 }}>
              <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 500, letterSpacing: '-0.04em', marginBottom: 8, color: '#fff' }}>
                Analyze suspicious content
              </h1>
              <p style={{ fontSize: 14, color: '#9a9a9a', letterSpacing: '-0.01em', lineHeight: 1.55 }}>
                Choose what you want to analyze — image, SMS, email, or a link.
              </p>
            </div>

            {/* Input type tabs */}
            <div className="input-tabs">
              {INPUT_TYPES.map(t => (
                <button
                  key={t.id}
                  className={`input-tab${inputType === t.id ? ' active' : ''}`}
                  onClick={() => setInputType(t.id)}
                  type="button"
                >
                  <span aria-hidden="true">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Image dropzone ── */}
            {inputType === 'image' && (
              <>
                <div
                  className={`dropzone${dragOver ? ' drag-over' : ''}`}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload suspicious screenshot"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={onInput}
                    className="sr-only"
                    aria-label="Choose image file"
                  />
                  <svg className="dropzone-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="40" height="40" rx="10" stroke="white" strokeOpacity="0.18" strokeWidth="1.5"/>
                    <path d="M24 32V20M18 26l6-6 6 6" stroke="white" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 36h16" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="dropzone-title">Drop a suspicious screenshot here</p>
                  <p className="dropzone-sub">
                    WhatsApp chat, SMS, email, payment page, QR code, KYC notice — any suspicious image.
                  </p>
                  <div className="dropzone-types">
                    {['PNG', 'JPG', 'WEBP'].map(t => <span key={t} className="type-tag">{t}</span>)}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', letterSpacing: '-0.01em' }}>
                  Max 10 MB · Not stored permanently in demo mode
                </p>
              </>
            )}

            {/* ── SMS textarea ── */}
            {inputType === 'sms' && (
              <div className="text-input-wrap">
                <textarea
                  className="text-input-area"
                  placeholder={INPUT_TYPES.find(t => t.id === 'sms')?.placeholder}
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  aria-label="Paste suspicious SMS content"
                />
                <button
                  className="btn btn-solid"
                  style={{ height: 44, fontSize: 14, width: '100%' }}
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim()}
                  type="button"
                >
                  Analyze SMS with Sense Check.ai →
                </button>
              </div>
            )}

            {/* ── Structured Email Threat Analysis ── */}
            {inputType === 'email' && (
              <div className="text-input-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>📧</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>
                      Email Spoofing & Phishing Detection Active
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                      Flags corporate identity spoofing (e.g. @gmail senders claiming to be PayPal/Netflix), fake subscription invoices, and phone callback refund traps.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                      Sender / From Address (Optional)
                    </label>
                    <input
                      className="url-input"
                      type="text"
                      placeholder="e.g. billing-dept@netflix-verify.cc or support@gmail.com"
                      value={emailSender}
                      onChange={e => setEmailSender(e.target.value)}
                      style={{ fontSize: 13, height: 40 }}
                      aria-label="Email sender address"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                      Subject Line (Optional)
                    </label>
                    <input
                      className="url-input"
                      type="text"
                      placeholder="e.g. URGENT: Invoice #INV-84920 Overdue / Account Blocked"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      style={{ fontSize: 13, height: 40 }}
                      aria-label="Email subject line"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                    Email Body Content <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    className="text-input-area"
                    placeholder="Paste the email body, payment requests, unexpected invoice details, or refund contact instructions..."
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    rows={5}
                    aria-label="Paste email body content"
                  />
                </div>

                <button
                  className="btn btn-solid"
                  style={{ height: 44, fontSize: 14, width: '100%', marginTop: 4 }}
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim() && !emailSender.trim()}
                  type="button"
                >
                  Analyze Email Threat →
                </button>
              </div>
            )}

            {/* ── LinkedIn Account & Recruiter Verification ── */}
            {inputType === 'linkedin' && (
              <div className="text-input-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.22)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>💼</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#93c5fd' }}>
                      LinkedIn Account & Recruiter Verification
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#bfdbfe', opacity: 0.85 }}>
                      Verifies genuine <code style={{ color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>linkedin.com/in/...</code> profiles, flags lookalike typosquatting domains, and detects Telegram/WhatsApp off-platform recruiter traps.
                    </p>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                    LinkedIn Profile or Job URL (Optional)
                  </label>
                  <input
                    className="url-input"
                    type="url"
                    placeholder="https://www.linkedin.com/in/recruiter-profile-name or lookalike link"
                    value={urlContent}
                    onChange={e => setUrlContent(e.target.value)}
                    style={{ fontSize: 13, height: 40 }}
                    aria-label="Paste LinkedIn profile URL"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                    InMail Message, Recruiter Chat, or Offer Details (Optional if URL provided)
                  </label>
                  <textarea
                    className="text-input-area"
                    placeholder="Paste the recruiter message or offer: e.g. 'We reviewed your profile and shortlisted you for Remote Data Analyst ($45/hr). Add our hiring manager on Telegram @...'"
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    rows={4}
                    aria-label="Paste LinkedIn recruiter message"
                  />
                </div>

                <button
                  className="btn btn-solid"
                  style={{ height: 44, fontSize: 14, width: '100%', marginTop: 4 }}
                  onClick={handleTextSubmit}
                  disabled={!urlContent.trim() && !textContent.trim()}
                  type="button"
                >
                  Verify LinkedIn Account & Offer →
                </button>
              </div>
            )}

            {/* ── URL / Link ── */}
            {inputType === 'link' && (
              <div className="text-input-wrap">
                <p className="input-label">Paste any suspicious URL, payment link, or shortened link.</p>
                <input
                  className="url-input"
                  type="url"
                  placeholder="https://suspicious-link.example.com"
                  value={urlContent}
                  onChange={e => setUrlContent(e.target.value)}
                  aria-label="Paste suspicious URL"
                />
                <button
                  className="btn btn-solid"
                  style={{ height: 44, fontSize: 14, width: '100%' }}
                  onClick={handleTextSubmit}
                  disabled={!urlContent.trim()}
                  type="button"
                >
                  Analyze Link →
                </button>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', letterSpacing: '-0.01em' }}>
                  We do not visit or load the link — only the URL string is analyzed.
                </p>
              </div>
            )}

            {/* ── Sample Scenarios ── */}
            <div className="sample-scenarios" style={{ marginTop: 28, textAlign: 'center', maxWidth: 640 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e8e8e', marginBottom: 12 }}>
                ⚡ Or test instant real-world scam patterns:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {SAMPLE_SCENARIOS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => loadSample(s)}
                    className="sample-chip"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      color: '#d1d5db',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════ UPLOADING ════════════════════ */}
        {flow === FLOW.UPLOADING && (
          <>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#9a9a9a', marginBottom: 12, letterSpacing: '-0.01em' }}>
                {uploadPct < 70 ? '👁️ Sensing & Extracting Raw Text from Image (OCR)…' : '⚡ Optimizing visual evidence & running threat model…'}
              </p>
              <div className="progress-track" style={{ maxWidth: 580 }}>
                <div className="progress-fill" style={{ width: `${uploadPct}%` }} />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{uploadPct}%</p>
            </div>

            {previewUrl && (
              <div className="preview-card" style={{ maxWidth: 580 }}>
                <img src={previewUrl} alt="Uploading screenshot" className="preview-image" />
                <div className="preview-meta">
                  <div className="meta-row">
                    <span className="meta-label">File</span>
                    <span className="meta-value" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file?.name}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Size</span>
                    <span className="meta-value">{(file?.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Status</span>
                    <span className="meta-badge processing">Uploading</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════════════════ PROCESSING + SCAN_DONE ═══════ */}
        {isProcessing && (
          <>
            <div style={{ textAlign: 'center', maxWidth: 580 }}>
              <p style={{ fontSize: 13, letterSpacing: '-0.01em', color: '#9a9a9a' }}>
                {flow === FLOW.SCAN_DONE ? 'Scan complete.' : 'Analysing with Sense Check.ai…'}
              </p>
            </div>

            {previewUrl && (
              <div className="preview-card" style={{ maxWidth: 580 }}>
                <img src={previewUrl} alt="Screenshot being analyzed" className="preview-image" />
              </div>
            )}

            {/* Matrix container: 0s & 1s rain (neon green) + clean scan-complete text */}
            <div className="matrix-container" style={{ maxWidth: 580 }}>
              <MatrixRain active={isProcessing} opacity={0.2} />

              {/* Scan complete — clean white text, matrix rain glows behind */}
              {flow === FLOW.SCAN_DONE && (
                <div className="scan-complete-overlay">
                  <p className="scan-complete-text">Scan Complete</p>
                  <p className="scan-complete-sub">Threat Assessment Ready</p>
                </div>
              )}

              <div className="stages-panel">
                {stages.map((stage, i) => (
                  <div
                    key={stage.id}
                    className={`stage-row${i < stageIdx ? ' done' : i === stageIdx ? ' active' : ''}`}
                  >
                    <div className="stage-dot" />
                    {stage.label}
                    {i < stageIdx && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <path d="M2.5 7l3 3 6-6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════ RESULT ═══════════════════════ */}
        {flow === FLOW.RESULT && result && phrase && (
          <div className="result-panel">

            {/* ── Verdict card (phrase, not number) ── */}
            <div className="risk-gauge" style={{ '--gauge-glow': phrase.glow }}>
              <p className="risk-label">Threat Assessment</p>
              <div className="risk-header">
                <div className="risk-phrase-display">
                  <div className={`risk-phrase-text ${phrase.cls}`}>
                    {phrase.phrase}
                  </div>
                  <p className="risk-phrase-sub">{phrase.subtext}</p>
                </div>
                <div style={{ fontSize: 28, flexShrink: 0, marginTop: 4 }}>{phrase.icon}</div>
              </div>
              <div className="risk-bar-track" style={{ marginTop: 4 }}>
                <div className={`risk-bar-fill ${phrase.cls}`} style={{ width: `${result.riskScore}%` }} />
              </div>
              <div className="confidence-row">
                <span>AI Confidence</span>
                <span style={{ color: '#e0e0e0', fontWeight: 500 }}>{Math.round((result?.confidence || 0.92) * 100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#9ca3af' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
                  {result?.category ? result.category.replace(/_/g, ' ') : 'THREAT PATTERN'}
                </span>
                <span style={{ color: '#6b7280' }}>
                  {result?.isBackend ? '⚡ Cloud Neural Pipeline' : '🛡️ Local Real-Time Engine'}
                </span>
              </div>
            </div>

            {/* ── Sensed Raw OCR Text from Image ── */}
            {(extractedText || result?.extractedText) && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '16px 18px',
                marginTop: 16,
                marginBottom: 20,
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>👁️</span> Sensed Raw Text from Image (OCR)
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>
                    {(extractedText || result?.extractedText || '').length} characters sensed
                  </span>
                </div>
                <div style={{
                  fontSize: 12.5,
                  color: '#e5e7eb',
                  lineHeight: 1.55,
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '12px 14px',
                  borderRadius: 8,
                  fontFamily: 'ui-monospace, monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 140,
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  {extractedText || result?.extractedText}
                </div>
              </div>
            )}

            {/* ── Red flags — renamed ── */}
            {(result?.indicators || []).length > 0 && (
              <>
                <p style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9a9a', textAlign: 'center', marginBottom: 20 }}>
                  Red Flags that you must be aware of
                </p>
                <div className="signals-panel">
                  {(result?.indicators || []).map((ind, i) => (
                    <div key={ind.id || i} className="signal-card" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="signal-top">
                        <span className="signal-title">{ind.title}</span>
                        <span className={`signal-severity ${ind.severity}`}>{ind.severity}</span>
                      </div>
                      <p className="signal-desc">{ind.explanation}</p>
                      {ind.evidence && <p className="signal-evidence">"{ind.evidence}"</p>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Recommendations ── */}
            <div className="recommendation-card">
              <p className="rec-title">What should you do?</p>
              <div className="rec-items">
                {(result?.recommendation?.actions || result?.recommendations || []).map((action, i) => (
                  <div key={i} className="rec-item">
                    <div className="rec-bullet" />
                    {action}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Emergency link to cybercrime.gov.in ── */}
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 8,
                border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.04)',
                textDecoration: 'none', transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.04)'}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 2 }}>
                  🚨 Report to National Cyber Crime Portal
                </p>
                <p style={{ fontSize: 12, color: '#9a9a9a' }}>cybercrime.gov.in · Helpline: 1930</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#9a9a9a', flexShrink: 0 }}>
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* ── Analyze another ── */}
            <button onClick={reset} className="btn btn-solid" style={{ width: '100%', height: 44 }} type="button">
              Analyse Another Item
            </button>
          </div>
        )}

        {/* ════════════════════ ERROR ════════════════════════ */}
        {flow === FLOW.ERROR && (
          <div style={{ textAlign: 'center', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 7v5M11 14.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="1.2"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.02em', color: '#fff' }}>
              Something went wrong
            </p>
            <p style={{ fontSize: 13.5, color: '#9a9a9a', lineHeight: 1.55, letterSpacing: '-0.01em' }}>
              {errorMsg || 'An unexpected error occurred.'}
            </p>
            <button onClick={reset} className="btn btn-ghost" style={{ marginTop: 4 }} type="button">
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
