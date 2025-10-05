/**
 * Serviço do Agente Clínico Nôa Esperanza - Dashboard Paciente
 * Agente especialista com restrições de segurança e LGPD
 */

import { supabase } from '../integrations/supabase/client'
import { openAIService } from './openaiService'
import { logger } from '../utils/logger'

export interface PatientProfile {
  id: string
  name: string
  email: string
  nftHash: string
  consentGiven: boolean
  consentDate: Date
  dataRetentionPeriod: number // em dias
  allowedOperations: string[]
  restrictions: string[]
}

export interface ClinicalSession {
  id: string
  patientId: string
  sessionType: 'avaliacao_inicial' | 'consulta_seguimento' | 'emergencia'
  status: 'iniciada' | 'em_andamento' | 'concluida' | 'suspensa'
  startTime: Date
  endTime?: Date
  consentVerified: boolean
  nftGenerated: boolean
  nftHash?: string
}

export interface SecurityContext {
  patientId: string
  sessionId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  permissions: string[]
  restrictions: string[]
}

export class ClinicalAgentService {
  private currentPatient: PatientProfile | null = null
  private currentSession: ClinicalSession | null = null
  private securityContext: SecurityContext | null = null

  /**
   * Inicializar sessão clínica para paciente
   */
  async initializePatientSession(patientId: string, sessionType: ClinicalSession['sessionType']): Promise<{
    success: boolean
    patient?: PatientProfile
    session?: ClinicalSession
    error?: string
  }> {
    try {
      logger.info('🏥 Inicializando sessão clínica para paciente', { patientId, sessionType })

      // 1. Verificar perfil do paciente
      const patient = await this.getPatientProfile(patientId)
      if (!patient) {
        return { success: false, error: 'Paciente não encontrado' }
      }

      // 2. Verificar consentimento LGPD
      if (!patient.consentGiven) {
        return { success: false, error: 'Consentimento LGPD não fornecido' }
      }

      // 3. Verificar se consentimento não expirou
      const consentAge = (Date.now() - new Date(patient.consentDate).getTime()) / (1000 * 60 * 60 * 24)
      if (consentAge > patient.dataRetentionPeriod) {
        return { success: false, error: 'Consentimento LGPD expirado' }
      }

      // 4. Criar sessão clínica
      const session: ClinicalSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        patientId,
        sessionType,
        status: 'iniciada',
        startTime: new Date(),
        consentVerified: true,
        nftGenerated: false
      }

      // 5. Configurar contexto de segurança
      this.securityContext = {
        patientId,
        sessionId: session.id,
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        permissions: patient.allowedOperations,
        restrictions: patient.restrictions
      }

      this.currentPatient = patient
      this.currentSession = session

      // 6. Salvar sessão no banco
      await this.saveClinicalSession(session)

      logger.info('✅ Sessão clínica inicializada com sucesso', { 
        patientId, 
        sessionId: session.id 
      })

      return { success: true, patient, session }

    } catch (error) {
      logger.error('❌ Erro ao inicializar sessão clínica', error)
      return { success: false, error: 'Erro interno do sistema' }
    }
  }

  /**
   * Processar mensagem do paciente com segurança
   */
  async processPatientMessage(message: string): Promise<{
    response: string
    action?: string
    data?: any
    securityViolation?: boolean
  }> {
    try {
      if (!this.currentPatient || !this.currentSession || !this.securityContext) {
        return {
          response: 'Sessão não inicializada. Por favor, recarregue a página.',
          securityViolation: true
        }
      }

      // 1. Verificar segurança da mensagem
      const securityCheck = await this.checkMessageSecurity(message)
      if (!securityCheck.allowed) {
        logger.warn('🚫 Violação de segurança detectada', { 
          patientId: this.currentPatient.id,
          violation: securityCheck.violation 
        })
        
        return {
          response: 'Esta operação não é permitida em sua sessão atual.',
          securityViolation: true
        }
      }

      // 2. Verificar se é avaliação clínica inicial
      if (this.currentSession.sessionType === 'avaliacao_inicial') {
        return await this.processClinicalAssessment(message)
      }

      // 3. Processar mensagem geral com Nôa Esperanza
      const noaResponse = await this.generateNoaResponse(message)

      // 4. Salvar interação
      await this.savePatientInteraction(message, noaResponse)

      return {
        response: noaResponse,
        action: 'general_consultation'
      }

    } catch (error) {
      logger.error('❌ Erro ao processar mensagem do paciente', error)
      return {
        response: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        securityViolation: false
      }
    }
  }

  /**
   * Processar avaliação clínica inicial
   */
  private async processClinicalAssessment(message: string): Promise<{
    response: string
    action?: string
    data?: any
  }> {
    try {
      // Usar o serviço de avaliação clínica existente
      const { clinicalAssessmentService } = await import('./clinicalAssessmentService')
      
      const assessmentResult = await clinicalAssessmentService.processAnswer(message)
      
      let response = assessmentResult.currentQuestion
      
      // Adicionar contexto de segurança
      if (this.securityContext) {
        response += `\n\n🔒 *Sessão segura - ID: ${this.securityContext.sessionId.substring(0, 8)}...*`
      }

      // Se avaliação concluída, gerar NFT
      if (assessmentResult.isComplete && assessmentResult.report) {
        const nftHash = await this.generateClinicalNFT(assessmentResult.report)
        
        if (this.currentSession) {
          this.currentSession.status = 'concluida'
          this.currentSession.endTime = new Date()
          this.currentSession.nftGenerated = true
          this.currentSession.nftHash = nftHash
          
          await this.saveClinicalSession(this.currentSession)
        }

        response += `\n\n🎯 **Avaliação Concluída!**\n`
        response += `📋 Seu relatório foi gerado e um NFT foi criado:\n`
        response += `🔗 NFT Hash: \`${nftHash}\`\n\n`
        response += `✅ Você pode agendar sua consulta com Dr. Ricardo Valença.`
      }

      return {
        response,
        action: 'clinical_assessment',
        data: {
          stage: assessmentResult.stage,
          isComplete: assessmentResult.isComplete,
          nftHash: assessmentResult.nftHash
        }
      }

    } catch (error) {
      logger.error('❌ Erro na avaliação clínica', error)
      return {
        response: 'Erro na avaliação clínica. Por favor, tente novamente.',
        action: 'error'
      }
    }
  }

  /**
   * Gerar resposta da Nôa Esperanza com contexto de segurança
   */
  private async generateNoaResponse(message: string): Promise<string> {
    try {
      const systemPrompt = this.buildSecureSystemPrompt()
      
      const response = await openAIService.generateResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ])

      return response || 'Desculpe, não consegui processar sua mensagem no momento.'

    } catch (error) {
      logger.error('❌ Erro ao gerar resposta da Nôa', error)
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.'
    }
  }

  /**
   * Construir prompt do sistema com segurança
   */
  private buildSecureSystemPrompt(): string {
    const patientName = this.currentPatient?.name || 'Paciente'
    const sessionId = this.currentSession?.id.substring(0, 8) || 'unknown'
    const restrictions = this.currentPatient?.restrictions || []

    return `Você é Nôa Esperanza, assistente médica especializada da plataforma Nôa Esperanza.

CONTEXTO DA SESSÃO:
- Paciente: ${patientName}
- Sessão: ${sessionId}
- Tipo: ${this.currentSession?.sessionType || 'consulta'}

RESTRIÇÕES DE SEGURANÇA:
- Você é um assistente médico, NÃO um médico
- NÃO forneça diagnósticos ou prescrições
- NÃO interprete exames ou resultados
- Apenas colete informações e oriente sobre consultas
- Mantenha tom empático e profissional

FUNCIONALIDADES PERMITIDAS:
- Coleta de informações clínicas
- Orientação sobre consultas
- Esclarecimento de dúvidas gerais
- Direcionamento para especialistas

RESTRIÇÕES APLICADAS:
${restrictions.map(r => `- ${r}`).join('\n')}

RESPONDA APENAS dentro dessas limitações. Se a pergunta estiver fora do escopo, explique educadamente e direcione para uma consulta médica.`
  }

  /**
   * Verificar segurança da mensagem
   */
  private async checkMessageSecurity(message: string): Promise<{
    allowed: boolean
    violation?: string
  }> {
    if (!this.securityContext) {
      return { allowed: false, violation: 'Contexto de segurança não encontrado' }
    }

    // Verificar mensagem muito longa
    if (message.length > 2000) {
      return { allowed: false, violation: 'Mensagem muito longa' }
    }

    // Verificar tentativas de injeção
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i,
      /window\./i
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(message)) {
        return { allowed: false, violation: 'Conteúdo potencialmente malicioso detectado' }
      }
    }

    // Verificar permissões específicas
    const restrictedKeywords = [
      'delete', 'drop', 'truncate', 'alter',
      'admin', 'root', 'password', 'token'
    ]

    const messageLower = message.toLowerCase()
    for (const keyword of restrictedKeywords) {
      if (messageLower.includes(keyword) && !this.securityContext.permissions.includes('system_access')) {
        return { allowed: false, violation: `Palavra-chave restrita: ${keyword}` }
      }
    }

    return { allowed: true }
  }

  /**
   * Gerar NFT da avaliação clínica
   */
  private async generateClinicalNFT(report: any): Promise<string> {
    try {
      const reportString = JSON.stringify(report)
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(reportString))
      const hashArray = Array.from(new Uint8Array(hash))
      const nftHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      logger.info('🎯 NFT clínico gerado', { nftHash: nftHash.substring(0, 16) + '...' })
      
      return nftHash
    } catch (error) {
      logger.error('❌ Erro ao gerar NFT clínico', error)
      return 'error_generating_nft'
    }
  }

  /**
   * Obter perfil do paciente
   */
  private async getPatientProfile(patientId: string): Promise<PatientProfile | null> {
    try {
      // Simular dados do paciente (em produção, viria do Supabase)
      return {
        id: patientId,
        name: 'Paciente Exemplo',
        email: 'paciente@exemplo.com',
        nftHash: 'patient_nft_hash_123',
        consentGiven: true,
        consentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
        dataRetentionPeriod: 365, // 1 ano
        allowedOperations: ['clinical_assessment', 'general_consultation'],
        restrictions: ['no_diagnosis', 'no_prescription', 'no_test_interpretation']
      }
    } catch (error) {
      logger.error('❌ Erro ao obter perfil do paciente', error)
      return null
    }
  }

  /**
   * Salvar sessão clínica
   */
  private async saveClinicalSession(session: ClinicalSession): Promise<void> {
    try {
      // Em produção, salvar no Supabase
      logger.info('💾 Sessão clínica salva', { sessionId: session.id })
    } catch (error) {
      logger.error('❌ Erro ao salvar sessão clínica', error)
    }
  }

  /**
   * Salvar interação do paciente
   */
  private async savePatientInteraction(message: string, response: string): Promise<void> {
    try {
      if (!this.currentSession || !this.currentPatient) return

      // Em produção, salvar no Supabase
      logger.info('💬 Interação do paciente salva', {
        sessionId: this.currentSession.id,
        messageLength: message.length,
        responseLength: response.length
      })
    } catch (error) {
      logger.error('❌ Erro ao salvar interação', error)
    }
  }

  /**
   * Obter IP do cliente (simplificado)
   */
  private getClientIP(): string {
    return 'client_ip_simulation'
  }

  /**
   * Obter contexto atual
   */
  getCurrentContext(): {
    patient: PatientProfile | null
    session: ClinicalSession | null
    security: SecurityContext | null
  } {
    return {
      patient: this.currentPatient,
      session: this.currentSession,
      security: this.securityContext
    }
  }

  /**
   * Finalizar sessão
   */
  async finalizeSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.status = 'concluida'
      this.currentSession.endTime = new Date()
      await this.saveClinicalSession(this.currentSession)
    }

    this.currentPatient = null
    this.currentSession = null
    this.securityContext = null

    logger.info('🏁 Sessão clínica finalizada')
  }
}

// Instância global do serviço
export const clinicalAgentService = new ClinicalAgentService()
