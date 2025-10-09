/**
 * Serviço de Carregamento do Prompt Mestre da Nôa Esperanza
 * Centraliza perfis, modos e variáveis de sessão para o Codex
 */

import { getNoaSystemPrompt } from '../config/noaSystemPrompt'
import { personalizedProfilesService } from './personalizedProfilesService'

export type NoaModule = 'clinico' | 'pedagogico' | 'narrativo' | 'comunitario' | 'juridico'

export interface NoaPromptConfig {
  userContext?: {
    name?: string
    role?: string
    specialty?: string
    recognizedAs?: string
    sessionId?: string
    userId?: string
    route?: string
  }
  profileId?: string
  consentimentoObtido?: boolean
  modulo?: NoaModule
  extraInstructions?: string
  metadata?: Record<string, unknown>
}

const MODULE_INSTRUCTIONS: Record<NoaModule, string> = {
  clinico: `## MODO ATIVO: CLÍNICO
- Priorize coleta de indícios, progressão etapa a etapa e consentimento LGPD.
- Registre sintomas, evolução, antecedentes, hábitos, medicações e fechamento consensual.
- Se necessário, gere bloco JSON com campos clínicos padronizados.`,
  pedagogico: `## MODO ATIVO: PEDAGÓGICO
- Atue como mentora educacional.
- Reforce práticas reflexivas, plano de estudo e feedback construtivo.`,
  narrativo: `## MODO ATIVO: NARRATIVO
- Organize respostas com Harmony Format, proponha próximos passos e co-crie soluções.
- Mantenha tom colaborativo e transparente.`,
  comunitario: `## MODO ATIVO: COMUNITÁRIO
- Valorize determinantes sociais, recursos coletivos e linguagem acessível.
- Incentive articulação comunitária e segurança cultural.`,
  juridico: `## MODO ATIVO: JURÍDICO
- Consulte protocolos legais e éticos.
- Mantenha linguagem clara, registrar fundamentos legais e garantir sigilo.`,
}

export const ROUTE_TO_MODULE: Record<string, NoaModule> = {
  chat: 'narrativo',
  triagem: 'clinico',
  'avaliacao-inicial': 'clinico',
}

function buildProfileSection(profileId?: string): string {
  if (!profileId) return ''

  const profile = personalizedProfilesService.getProfile(profileId)
  if (!profile) return ''

  const focus = profile.personality?.focus?.length
    ? `Áreas de foco: ${profile.personality.focus.join(', ')}.`
    : ''

  return `## PERFIL ATIVO
- Nome: ${profile.name}
- Função: ${profile.function}
- Tom recomendado: ${profile.personality?.tone ?? 'acolhedor'}
- Linguagem: ${profile.personality?.language ?? 'português brasileiro'}
${focus ? `- ${focus}` : ''}

Regras específicas do perfil:
${profile.systemPrompt}`
}

function buildMetadataSection(metadata?: Record<string, unknown>): string {
  if (!metadata || Object.keys(metadata).length === 0) return ''

  const formatted = JSON.stringify(metadata, null, 2)
  return `## METADADOS DA SESSÃO
${formatted}`
}

export function loadNoaPrompt(config: Partial<NoaPromptConfig> = {}): string {
  const sections: string[] = []

  sections.push(getNoaSystemPrompt(config.userContext))

  if (config.profileId) {
    sections.push(buildProfileSection(config.profileId))
  }

  if (config.modulo) {
    sections.push(MODULE_INSTRUCTIONS[config.modulo])
  }

  if (config.consentimentoObtido !== undefined) {
    sections.push(`## CONSENTIMENTO LGPD
Status: ${config.consentimentoObtido ? 'OBTIDO' : 'PENDENTE'}
${config.consentimentoObtido ? 'Você pode prosseguir com procedimentos clínicos.' : 'NÃO avance em etapas clínicas até registrar consentimento explícito.'}`)
  }

  if (config.extraInstructions) {
    sections.push(`## INSTRUÇÕES COMPLEMENTARES
${config.extraInstructions}`)
  }

  if (config.metadata) {
    sections.push(buildMetadataSection(config.metadata))
  }

  return sections.join('\n\n')
}

export function validateConsent(config: Partial<NoaPromptConfig>): boolean {
  if (config.modulo === 'clinico' && config.consentimentoObtido === false) {
    console.warn('⚠️ Tentativa de avaliação clínica sem consentimento registrado')
    return false
  }
  return true
}

export function getProfileRecognitionPrompt(message: string): string {
  return loadNoaPrompt({
    modulo: 'narrativo',
    extraInstructions: `Analise a mensagem do usuário a seguir e identifique se ela contém um código de ativação de perfil.
Mensagem: "${message}"

Responda com:
- Perfil reconhecido (se houver) e saudação apropriada.
- Indicadores das ferramentas que devem ser ativadas.
- Orientação para registros de log.`,
  })
}

export function getClinicalAssessmentPrompt(
  etapa: string,
  metadata?: Record<string, unknown>
): string {
  return loadNoaPrompt({
    modulo: 'clinico',
    consentimentoObtido: true,
    extraInstructions: `Estamos conduzindo a Avaliação Clínica Inicial. Continue seguindo o método triaxial.
Etapa atual: ${etapa}.`,
    metadata,
  })
}

export function checkPromptIntegrity(): {
  loaded: boolean
  size: number
  modules: string[]
} {
  const sample = loadNoaPrompt({ modulo: 'narrativo' })
  return {
    loaded: true,
    size: sample.length,
    modules: Object.keys(MODULE_INSTRUCTIONS),
  }
}

export function logPromptInitialization(route: string, profileId?: string) {
  const profile = profileId ? personalizedProfilesService.getProfile(profileId) : null
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🧠 NÔA ESPERANZA - PROMPT CARREGADO VIA CODEX')
  console.log(`📍 Rota: ${route}`)
  if (profile) {
    console.log(`👤 Perfil ativo: ${profile.name}`)
  }
  console.log('═══════════════════════════════════════════════════════════════')
}

export default {
  loadNoaPrompt,
  validateConsent,
  getProfileRecognitionPrompt,
  getClinicalAssessmentPrompt,
  checkPromptIntegrity,
  logPromptInitialization,
}
