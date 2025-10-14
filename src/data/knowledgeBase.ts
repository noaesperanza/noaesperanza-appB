export type KnowledgeAudience = 'shared' | 'ricardo' | 'eduardo'

export interface KnowledgeArticle {
  id: string
  title: string
  summary: string
  audience: KnowledgeAudience
  tags: string[]
  lastUpdate: string
  link?: string
}

export interface KnowledgeCategory {
  id: string
  title: string
  description: string
  articles: KnowledgeArticle[]
}

export const knowledgeBase: KnowledgeCategory[] = [
  {
    id: 'neurologia',
    title: 'Neurologia e Cannabis Medicinal',
    description:
      'Protocolos estruturados pelo Dr. Ricardo Valença para avaliação neurológica e uso seguro de cannabis medicinal.',
    articles: [
      {
        id: 'triagem-neuro',
        title: 'Fluxo de triagem neurológica assistida por IA',
        summary:
          'Checklist de sintomas e sinais críticos com gatilhos automáticos para o chat clínico e registros no Supabase.',
        audience: 'ricardo',
        tags: ['triagem', 'neurologia', 'ia residente'],
        lastUpdate: '2024-11-12',
      },
      {
        id: 'cannabis-titulação',
        title: 'Guia de titulação de cannabis medicinal',
        summary:
          'Protocolo de ajuste de dose com monitoramento longitudinal e alertas personalizados.',
        audience: 'ricardo',
        tags: ['cannabis', 'protocolos terapêuticos'],
        lastUpdate: '2024-10-28',
      },
      {
        id: 'educacao-paciente',
        title: 'Educação para pacientes e familiares',
        summary: 'Material de apoio com linguagem acessível, vídeos e perguntas frequentes.',
        audience: 'shared',
        tags: ['educação', 'familiares', 'material de apoio'],
        lastUpdate: '2024-09-03',
      },
    ],
  },
  {
    id: 'nefrologia',
    title: 'Nefrologia Integrada',
    description:
      'Playbooks clínicos do Dr. Eduardo Favaret para acompanhamento renal e programas multiprofissionais.',
    articles: [
      {
        id: 'linha-cuidado-renal',
        title: 'Linha de cuidado renal crônica',
        summary:
          'Sequência de consultas, exames e alertas automáticos para pacientes em acompanhamento prolongado.',
        audience: 'eduardo',
        tags: ['nefrologia', 'linha de cuidado'],
        lastUpdate: '2024-11-05',
      },
      {
        id: 'dialise-domiciliar',
        title: 'Checklist para diálise domiciliar',
        summary:
          'Checklist diário para equipe de enfermagem e paciente, com registro em Supabase e alertas via IA.',
        audience: 'eduardo',
        tags: ['nefrologia', 'protocolos', 'enfermagem'],
        lastUpdate: '2024-08-21',
      },
      {
        id: 'nutricao-renal',
        title: 'Plano nutricional para pacientes renais',
        summary:
          'Tabela de substituições e alertas de risco nutricional integrados ao chat clínico.',
        audience: 'shared',
        tags: ['nutrição', 'protocolos'],
        lastUpdate: '2024-09-18',
      },
    ],
  },
  {
    id: 'operacao',
    title: 'Operação integrada e qualidade',
    description: 'Materiais aplicados aos dois consultórios para manter padronização e governança.',
    articles: [
      {
        id: 'operacao-hub',
        title: 'Checklist do hub operacional',
        summary:
          'Revisão diária de integrações com Supabase, Mercado Pago e status do aprendizado da IA.',
        audience: 'shared',
        tags: ['operacao', 'supabase', 'pagamentos'],
        lastUpdate: '2024-11-01',
      },
      {
        id: 'seguranca-dados',
        title: 'Boas práticas de segurança e LGPD',
        summary: 'Procedimentos para acesso, auditoria e resposta a incidentes na plataforma.',
        audience: 'shared',
        tags: ['seguranca', 'lgpd'],
        lastUpdate: '2024-09-30',
      },
      {
        id: 'treinamento-equipe',
        title: 'Roteiro de treinamento da equipe clínica',
        summary:
          'Onboarding com foco na experiência digital, uso do chat clínico e atualização da base de conhecimento.',
        audience: 'shared',
        tags: ['treinamento', 'onboarding'],
        lastUpdate: '2024-08-12',
      },
    ],
  },
]
