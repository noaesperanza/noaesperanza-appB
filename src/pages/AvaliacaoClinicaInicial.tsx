import React from 'react'
import ClinicalAssessmentChat from '../components/ClinicalAssessmentChat'

const AvaliacaoClinicaInicial: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-5xl mx-auto p-4">
      <ClinicalAssessmentChat userRole="patient" />
    </div>
  )
}

export default AvaliacaoClinicaInicial
