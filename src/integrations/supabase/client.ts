import { createClient } from '@supabase/supabase-js'

const DEFAULT_URL = 'https://your-project.supabase.co'
const DEFAULT_KEY = 'your-anon-key'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_KEY

const hasCustomUrl = supabaseUrl !== DEFAULT_URL
const hasCustomKey = supabaseKey !== DEFAULT_KEY

export const isSupabaseConfigured = hasCustomUrl && hasCustomKey

console.log('🔧 Configuração Supabase:')
console.log('URL:', hasCustomUrl ? supabaseUrl : 'Não configurada')
console.log('Key:', hasCustomKey ? 'Configurada' : 'Não configurada')

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não configurado - usando modo local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabaseConfig = {
  url: supabaseUrl,
  keyProvided: hasCustomKey,
  isConfigured: isSupabaseConfigured,
}
