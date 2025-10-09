import {
  loadNoaPrompt,
  logPromptInitialization,
  ROUTE_TO_MODULE,
  validateConsent,
  type NoaModule,
} from './noaPromptLoader'
import { personalizedProfilesService } from './personalizedProfilesService'
import { getNoaSystemPrompt } from '../config/noaSystemPrompt'
import type { AssessmentResponse, ClinicalReport } from './clinicalAssessmentService'

export type CodexRoute = 'chat' | 'triagem' | 'avaliacao-inicial'

export interface CodexMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type ChatMessage = CodexMessage

export interface CodexRequestOptions {
  route?: CodexRoute
  userContext?: {
    name?: string
    role?: string
    specialty?: string
    recognizedAs?: string
    sessionId?: string
    userId?: string
  }
  profileId?: string
  consentimentoObtido?: boolean
  knowledgeBase?: string
  extraInstructions?: string
  metadata?: Record<string, unknown>
  moduleOverride?: NoaModule
  triageContext?: {
    stageId: string
    stageLabel: string
    followUps?: string[]
    exitMessage?: string
    step?: number
  }
}

interface CodexApiResponse {
  content?: string
  message?: string
  output?: string
  inferenceId?: string
  json?: unknown
}

export interface CodexClinicalReportResult {
  narrative: string
  report: ClinicalReport
  inferenceId: string
}

class CodexService {
  private readonly baseUrl: string
  private inferenceCounter = 0

  constructor() {
    this.baseUrl = (import.meta.env.VITE_CODEX_API_URL || '').replace(/\/$/, '')
  }

  private resolveRoute(options: CodexRequestOptions): CodexRoute {
    return options.route ?? 'chat'
  }

  private resolveModule(route: CodexRoute, options: CodexRequestOptions): NoaModule {
    if (options.moduleOverride) {
      return options.moduleOverride
    }

    return ROUTE_TO_MODULE[route] ?? 'narrativo'
  }

  private nextInferenceId(route: CodexRoute): string {
    this.inferenceCounter += 1
    const inferenceId = `codex-${route}-${Date.now()}-${this.inferenceCounter}`
    console.log(`[Codex] 🔍 Inference ID gerado: ${inferenceId}`)
    return inferenceId
  }

  private buildPrompt(route: CodexRoute, options: CodexRequestOptions, profileId?: string) {
    const metadata = {
      ...options.metadata,
      knowledgeBase: options.knowledgeBase ? 'Disponível' : 'Não fornecida',
      triageContext: options.triageContext ?? null,
      route,
    }

    return loadNoaPrompt({
      userContext: options.userContext
        ? {
            ...options.userContext,
            route,
          }
        : { route },
      profileId,
      modulo: this.resolveModule(route, options),
      consentimentoObtido: options.consentimentoObtido,
      extraInstructions: options.extraInstructions,
      metadata,
    })
  }

  private buildPayload(
    route: CodexRoute,
    inferenceId: string,
    prompt: string,
    messages: CodexMessage[],
    options: CodexRequestOptions,
    profileId?: string
  ) {
    return {
      inferenceId,
      route,
      profileId: profileId ?? null,
      session: {
        route,
        profileId: profileId ?? null,
        profileName: profileId
          ? (personalizedProfilesService.getProfile(profileId)?.name ?? null)
          : null,
        consentimento: options.consentimentoObtido ?? null,
        timestamp: new Date().toISOString(),
        userContext: options.userContext ?? null,
      },
      prompt,
      knowledgeBase: options.knowledgeBase ?? null,
      metadata: options.metadata ?? null,
      messages,
      cache: options.triageContext ?? null,
    }
  }

  private async requestCodex(route: CodexRoute, payload: any): Promise<CodexApiResponse | null> {
    if (!this.baseUrl) {
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.warn(`[Codex] ⚠️ Falha na API (${response.status}) - usando fallback local.`)
        return null
      }

      const data: CodexApiResponse = await response.json()
      return data
    } catch (error) {
      console.error('[Codex] Erro na comunicação com a API:', error)
      return null
    }
  }

  private offlineChatFallback(messages: CodexMessage[]): string {
    const lastUser = [...messages].reverse().find(msg => msg.role === 'user')
    const intro =
      'Sou a Nôa Esperanza operando em modo Codex offline. Posso orientar com base nos protocolos locais e na Arte da Entrevista Clínica.'

    if (!lastUser) {
      return `${intro}\n\nConte-me o que trouxe você até aqui e avançaremos juntas.`
    }

    const content = lastUser.content.toLowerCase()

    if (content.includes('quem é você') || content.includes('quem e voce')) {
      return `${intro}\n\nFui criada pelo Dr. Ricardo Valença para unir medicina de precisão, simbolismo clínico e colaboração ativa. Como posso apoiar agora?`
    }

    if (content.includes('plano') || content.includes('próximo') || content.includes('proximo')) {
      return `${intro}\n\nVamos organizar um plano de ação. Liste os objetivos principais e eu priorizo com você.`
    }

    return `${intro}\n\nPara começarmos, descreva sua queixa principal, quando surgiu e o que já tentou para lidar com ela.`
  }

  private offlineTriagemFallback(options: CodexRequestOptions): string {
    const context = options.triageContext
    if (!context) {
      return 'Triagem offline: descreva suas queixas e vou registrar cada uma seguindo o roteiro clínico.'
    }

    const followUps = context.followUps ?? []
    const step = context.step ?? 0
    if (step < followUps.length) {
      return followUps[step]
    }

    if (context.exitMessage) {
      return context.exitMessage
    }

    return `Triagem ${context.stageLabel}: registre quaisquer detalhes adicionais antes de avançarmos.`
  }

  private buildOfflineClinicalReport(responses: AssessmentResponse[]): CodexClinicalReportResult {
    const patientName = responses[0]?.answer || 'Não informado'
    const complaints = responses.filter(r => r.category === 'complaints')
    const history = responses.filter(r => r.category === 'history')
    const family = responses.filter(r => r.category === 'family')
    const habits = responses.filter(r => r.category === 'habits')
    const medications = responses.filter(r => r.category === 'medications')

    const maternal = family.filter(f => f.question.includes('mãe')).map(f => f.answer)
    const paternal = family.filter(f => f.question.includes('pai')).map(f => f.answer)
    const regularMeds = medications
      .filter(m => m.question.includes('regularmente'))
      .map(m => m.answer)
    const sporadicMeds = medications
      .filter(m => m.question.includes('esporadicamente'))
      .map(m => m.answer)
    const allergies = medications.filter(m => m.question.includes('alergia')).map(m => m.answer)

    const narrativeParts: string[] = []
    narrativeParts.push(`Este é o relatório da Avaliação Clínica Inicial de ${patientName}.`)

    if (complaints.length > 0) {
      narrativeParts.push(`Queixa principal: ${complaints[complaints.length - 1].answer}.`)
      narrativeParts.push(
        `Lista de queixas registradas: ${complaints.map(c => c.answer).join('; ')}.`
      )
    }

    if (history.length > 0) {
      narrativeParts.push(
        `História patológica pregressa: ${history.map(h => h.answer).join('; ')}.`
      )
    }

    if (family.length > 0) {
      narrativeParts.push(
        `História familiar — materna: ${maternal.join('; ') || 'não relatado'}; paterna: ${paternal.join('; ') || 'não relatado'}.`
      )
    }

    if (habits.length > 0) {
      narrativeParts.push(`Hábitos de vida relatados: ${habits.map(h => h.answer).join('; ')}.`)
    }

    if (medications.length > 0) {
      narrativeParts.push(
        `Medicações em uso: regulares (${regularMeds.join('; ') || 'não referidas'}), esporádicas (${
          sporadicMeds.join('; ') || 'não referidas'
        }). Alergias mencionadas: ${allergies.join('; ') || 'não referidas'}.`
      )
    }

    narrativeParts.push(
      'Esta síntese segue o método Arte da Entrevista Clínica do Dr. Ricardo Valença. Recomenda-se continuidade assistencial e validação conjunta com o paciente.'
    )

    const narrative = narrativeParts.join('\n\n')

    const report: ClinicalReport = {
      patientName,
      mainComplaint: complaints[complaints.length - 1]?.answer || '',
      complaintsList: complaints.map(c => c.answer),
      developmentDetails: complaints
        .filter(c => /como|quando|onde|melhora|piora|mais/i.test(c.question))
        .map(c => `${c.question}: ${c.answer}`)
        .join('; '),
      medicalHistory: history.map(h => h.answer),
      familyHistory: {
        maternal,
        paternal,
      },
      lifestyleHabits: habits.map(h => h.answer),
      medications: {
        regular: regularMeds,
        sporadic: sporadicMeds,
      },
      allergies,
      summary: narrative,
      recommendations: [
        'Agendar consulta com Dr. Ricardo Valença',
        'Organizar exames complementares conforme queixas',
        'Manter registro atualizado no prontuário digital',
      ],
    }

    return {
      narrative,
      report,
      inferenceId: this.nextInferenceId('avaliacao-inicial'),
    }
  }

  private offlineResponse(
    route: CodexRoute,
    messages: CodexMessage[],
    options: CodexRequestOptions
  ): string {
    switch (route) {
      case 'triagem':
        return this.offlineTriagemFallback(options)
      case 'avaliacao-inicial':
        return this.buildOfflineClinicalReport([]).narrative
      default:
        return this.offlineChatFallback(messages)
    }
  }

  async getNoaResponse(
    userMessage: string,
    conversationHistory: CodexMessage[] = [],
    options: CodexRequestOptions = {}
  ): Promise<string> {
    const route = this.resolveRoute(options)
    const inferenceId = this.nextInferenceId(route)
    const profile = options.profileId
      ? personalizedProfilesService.getProfile(options.profileId)
      : personalizedProfilesService.getActiveProfile()

    if (profile) {
      console.log(`[Codex] 👤 Perfil ativo reconhecido: ${profile.name}`)
    }

    const prompt = this.buildPrompt(route, options, profile?.id)
    console.log(
      `[Codex] 📄 Prompt carregado (tamanho ${prompt.length} caracteres) para rota ${route}.`
    )

    logPromptInitialization(route, profile?.id)

    const messages: CodexMessage[] = [
      { role: 'system', content: prompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    const payload = this.buildPayload(route, inferenceId, prompt, messages, options, profile?.id)

    const response = await this.requestCodex(route, payload)
    if (response?.content || response?.output || response?.message) {
      const text = response.content ?? response.output ?? response.message ?? ''
      const finalText = `${text}\n\n[Inference ID: ${response.inferenceId ?? inferenceId}]`
      return finalText
    }

    const fallback = this.offlineResponse(route, messages, options)
    return `${fallback}\n\n[Inference ID: ${inferenceId} | modo offline]`
  }

  async generateClinicalReport(
    responses: AssessmentResponse[],
    options: CodexRequestOptions = {}
  ): Promise<CodexClinicalReportResult> {
    const consentOk = validateConsent({
      modulo: 'clinico',
      consentimentoObtido: options.consentimentoObtido ?? true,
    })
    if (!consentOk) {
      throw new Error('Consentimento obrigatório para gerar relatório clínico')
    }

    const route: CodexRoute = 'avaliacao-inicial'
    const inferenceId = this.nextInferenceId(route)
    const profile = options.profileId
      ? personalizedProfilesService.getProfile(options.profileId)
      : personalizedProfilesService.getActiveProfile()

    const structuredPayload = {
      responses: responses.map(response => ({
        question: response.question,
        answer: response.answer,
        category: response.category,
      })),
    }

    const extraInstructions = `Você deve gerar dois blocos:
- Um JSON válido com campos: identificacao, queixas, historia, habitos, familia, medicacoes, sintese, recomendacoes.
- Uma narrativa clínica em texto seguindo o estilo do Dr. Ricardo Valença.
Certifique-se de apontar se o paciente concordou com a síntese.`

    const prompt = loadNoaPrompt({
      userContext: options.userContext,
      profileId: profile?.id,
      modulo: 'clinico',
      consentimentoObtido: true,
      extraInstructions,
      metadata: {
        route,
        responses: structuredPayload.responses,
      },
    })

    const messages: CodexMessage[] = [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: `Gerar relatório estruturado para os dados a seguir:\n${JSON.stringify(structuredPayload, null, 2)}`,
      },
    ]

    const payload = this.buildPayload(route, inferenceId, prompt, messages, options, profile?.id)

    const apiResponse = await this.requestCodex(route, payload)
    if (!apiResponse) {
      return this.buildOfflineClinicalReport(responses)
    }

    const rawText = apiResponse.content ?? apiResponse.output ?? ''
    const inference = apiResponse.inferenceId ?? inferenceId

    let report: ClinicalReport | null = null
    if (apiResponse.json && typeof apiResponse.json === 'object') {
      report = this.parseClinicalReport(apiResponse.json, rawText)
    }

    if (!report) {
      report = this.parseClinicalReportFromText(rawText)
    }

    if (!report) {
      const fallback = this.buildOfflineClinicalReport(responses)
      return { ...fallback, inferenceId: inference }
    }

    const narrative = report.summary || rawText
    report.summary = narrative

    return {
      narrative,
      report,
      inferenceId: inference,
    }
  }

  private parseClinicalReport(json: any, narrative: string): ClinicalReport | null {
    try {
      if (!json) return null

      return {
        patientName: json.identificacao?.nome ?? 'Não informado',
        mainComplaint: json.queixas?.principal ?? '',
        complaintsList: Array.isArray(json.queixas?.lista) ? json.queixas.lista : [],
        developmentDetails: json.historia?.desenvolvimento ?? '',
        medicalHistory: Array.isArray(json.historia?.antecedentes)
          ? json.historia.antecedentes
          : [],
        familyHistory: {
          maternal: Array.isArray(json.familia?.materna) ? json.familia.materna : [],
          paternal: Array.isArray(json.familia?.paterna) ? json.familia.paterna : [],
        },
        lifestyleHabits: Array.isArray(json.habitos) ? json.habitos : [],
        medications: {
          regular: Array.isArray(json.medicacoes?.regulares) ? json.medicacoes.regulares : [],
          sporadic: Array.isArray(json.medicacoes?.esporadicas) ? json.medicacoes.esporadicas : [],
        },
        allergies: Array.isArray(json.medicacoes?.alergias) ? json.medicacoes.alergias : [],
        summary:
          typeof json.sintese === 'string' && json.sintese.trim().length > 0
            ? json.sintese
            : narrative,
        recommendations: Array.isArray(json.recomendacoes) ? json.recomendacoes : [],
      }
    } catch (error) {
      console.warn('[Codex] Não foi possível interpretar JSON do relatório clínico:', error)
      return null
    }
  }

  private parseClinicalReportFromText(text: string): ClinicalReport | null {
    if (!text) return null

    const sections = text.split(/\n\n+/)
    const summary = text.trim()

    return {
      patientName: 'Não informado',
      mainComplaint: '',
      complaintsList: [],
      developmentDetails: '',
      medicalHistory: [],
      familyHistory: {
        maternal: [],
        paternal: [],
      },
      lifestyleHabits: [],
      medications: {
        regular: [],
        sporadic: [],
      },
      allergies: [],
      summary,
      recommendations: sections.filter(section => /recomenda/gi.test(section)),
    }
  }
}

export const codexService = new CodexService()

export const getSystemPromptPreview = () => getNoaSystemPrompt()
