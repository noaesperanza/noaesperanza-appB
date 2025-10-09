import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ClinicalAssessment } from '../components/ClinicalAssessment'
import { supabase } from '../integrations/supabase/client'
import { personalizedProfilesService } from '../services/personalizedProfilesService'
import { loadNoaPrompt } from '../services/noaPromptLoader'

interface AvaliacaoLocationState {
  sessionId?: string
  userId?: string
  origin?: string
}

const AvaliacaoClinicaInicial: React.FC = () => {
  const location = useLocation()
  const navigationState = (location.state as AvaliacaoLocationState) || {}

  const [sessionId] = useState<string>(() => {
    return (
      navigationState.sessionId ||
      sessionStorage.getItem('noa_active_assessment_session') ||
      `assessment_${Date.now()}`
    )
  })
  const [userId, setUserId] = useState<string | null>(
    navigationState.userId || sessionStorage.getItem('noa_active_assessment_user')
  )
  const [isLoadingIdentity, setIsLoadingIdentity] = useState<boolean>(!userId)
  const [completed, setCompleted] = useState<{ nftHash: string } | null>(null)

  useEffect(() => {
    const profile = personalizedProfilesService.getProfile('dr_ricardo_valenca')
    if (profile) {
      personalizedProfilesService.saveActiveProfile(profile)
      const prompt = loadNoaPrompt({
        userContext: {
          name: profile.name,
          role: profile.role,
          recognizedAs: profile.name,
          profileId: profile.id,
        },
        modulo: 'clinico',
      })
      sessionStorage.setItem('noa_active_prompt', prompt)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('noa_active_assessment_session', sessionId)
  }, [sessionId])

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('noa_active_assessment_user', userId)
      setIsLoadingIdentity(false)
      return
    }

    const resolveUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        let resolvedUserId =
          navigationState.userId || user?.id || localStorage.getItem('noa_guest_id')

        if (!resolvedUserId) {
          resolvedUserId = `guest_${crypto.randomUUID()}`
          localStorage.setItem('noa_guest_id', resolvedUserId)
        }

        setUserId(resolvedUserId)
        sessionStorage.setItem('noa_active_assessment_user', resolvedUserId)
      } catch (error) {
        console.warn('Não foi possível identificar usuário da avaliação:', error)
        const fallback = localStorage.getItem('noa_guest_id') || `guest_${crypto.randomUUID()}`
        localStorage.setItem('noa_guest_id', fallback)
        setUserId(fallback)
        sessionStorage.setItem('noa_active_assessment_user', fallback)
      } finally {
        setIsLoadingIdentity(false)
      }
    }

    resolveUser()
  }, [navigationState.userId, userId])

  const handleComplete = (report: any, nftHash: string) => {
    try {
      const total = Number(localStorage.getItem('kpi_total_assessments') || '0') + 1
      localStorage.setItem('kpi_total_assessments', String(total))
      localStorage.setItem('kpi_last_assessment_report', JSON.stringify(report))
      localStorage.setItem('kpi_last_assessment_nft', nftHash)
    } catch {}
    setCompleted({ nftHash })
  }

  const resolvedUserId = useMemo(() => userId ?? undefined, [userId])

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-5xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-white text-xl font-semibold">Avaliação Clínica Inicial</h1>
        <p className="text-sm text-slate-300 mt-1">
          Protocolo Arte da Entrevista Clínica — método IMRE do Dr. Ricardo Valença.
        </p>
      </div>

      {completed ? (
        <div className="p-4 bg-green-900/30 border border-green-600/40 rounded-lg text-green-300 text-sm">
          Avaliação concluída. NFT: <span className="font-mono">{completed.nftHash}</span>
        </div>
      ) : isLoadingIdentity ? (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm">
          Preparando o módulo clínico seguro...
        </div>
      ) : (
        <ClinicalAssessment
          onComplete={handleComplete}
          onUpdateKPIs={() => {}}
          userId={resolvedUserId}
          sessionId={sessionId}
        />
      )}
    </div>
  )
}

export default AvaliacaoClinicaInicial
