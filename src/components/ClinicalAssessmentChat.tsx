import React, { useState } from 'react'
import { ClinicalAssessment } from './ClinicalAssessment'
import { reasoningLayerService } from '../services/reasoningLayerService'
import { semanticAttentionService } from '../services/semanticAttentionService'

interface ClinicalAssessmentChatProps {
  onShare?: (report: any) => void
  userRole: 'patient' | 'professional'
}

const ClinicalAssessmentChat: React.FC<ClinicalAssessmentChatProps> = ({ onShare, userRole }) => {
  const [completedReport, setCompletedReport] = useState<any>(null)
  const [showShare, setShowShare] = useState(false)
  const [sharedWith, setSharedWith] = useState<string[]>([])

  // IA: Reasoning and semantic attention integration
  const [iaResponse, setIaResponse] = useState<string>('')
  const [userContext, setUserContext] = useState<any>(null)

  const handleComplete = async (report: any) => {
    setCompletedReport(report)
    setShowShare(true)
    // Activate semantic attention for user
    const context = await semanticAttentionService.activateSemanticAttention('user_001', userRole)
    setUserContext(context)
    // Generate IA reasoning response for summary
    const reasoning = await reasoningLayerService.startReasoning(
      report.summary,
      {
        level: 'clinical',
        description: 'Avaliação clínica inicial',
        maxIterations: 3,
        contextDepth: 2,
      },
      { patientContext: report.patientName, symptoms: report.complaintsList }
    )
    setIaResponse(reasoning.conclusion)
  }

  const handleShare = (recipient: string) => {
    setSharedWith([...sharedWith, recipient])
    if (onShare) onShare(completedReport)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-white text-xl font-bold mb-4">Avaliação Clínica Inicial</h2>
      {!completedReport ? (
        <ClinicalAssessment onComplete={handleComplete} />
      ) : (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-green-400 text-lg font-semibold mb-2">
            Relatório da Avaliação Clínica Inicial
          </h3>
          <pre className="text-white text-sm whitespace-pre-wrap font-mono mb-4">
            {completedReport.summary}
          </pre>
          {iaResponse && (
            <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg text-blue-300 text-sm p-3 mb-4">
              <strong>Resposta Inteligente da IA:</strong>
              <div>{iaResponse}</div>
            </div>
          )}
          {showShare && (
            <div className="mt-4">
              <label className="block text-gray-300 mb-2">Compartilhar com:</label>
              <input
                type="text"
                placeholder="Digite o nome ou email do profissional/paciente"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white mb-2"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleShare(e.currentTarget.value.trim())
                    e.currentTarget.value = ''
                  }
                }}
              />
              <div className="mt-2 text-xs text-gray-400">
                Compartilhado com: {sharedWith.length > 0 ? sharedWith.join(', ') : 'Ninguém ainda'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ClinicalAssessmentChat
