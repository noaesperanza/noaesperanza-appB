/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ELEVEN_API_KEY?: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_MERCADO_PAGO_KEY?: string
  readonly VITE_SUPPORT_EMAIL?: string
  readonly VITE_CONTACT_PHONE?: string
  readonly VITE_CLINIC_RICARDO_WHATSAPP?: string
  readonly VITE_CLINIC_EDUARDO_WHATSAPP?: string
  readonly VITE_SITE_BASE_URL?: string
  readonly VITE_APP_ENVIRONMENT?: string
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Speech Recognition API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

interface Window {
  SpeechRecognition: typeof SpeechRecognition
  webkitSpeechRecognition: typeof webkitSpeechRecognition
}
