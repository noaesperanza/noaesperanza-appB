export interface ClinicServiceGroup {
  title: string
  items: string[]
}

export interface ClinicTeamMember {
  name: string
  role: string
  focus: string
}

export interface ClinicContact {
  email: string
  phone: string
  whatsapp: string
  address: string
  schedule: string[]
}

export interface ClinicHighlight {
  label: string
  description: string
}

export interface ClinicIntegration {
  name: string
  details: string
}

export interface Clinic {
  slug: string
  name: string
  doctor: string
  specialties: string[]
  summary: string
  introduction: string
  services: ClinicServiceGroup[]
  highlights: ClinicHighlight[]
  team: ClinicTeamMember[]
  contact: ClinicContact
  integrations: ClinicIntegration[]
}

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? 'contato@noaesperanza.com'
const contactPhone = import.meta.env.VITE_CONTACT_PHONE ?? '+55 (81) 4002-8922'
const ricardoWhatsapp = import.meta.env.VITE_CLINIC_RICARDO_WHATSAPP ?? '+55 (81) 99999-0000'
const eduardoWhatsapp = import.meta.env.VITE_CLINIC_EDUARDO_WHATSAPP ?? '+55 (81) 98888-1111'

export const clinics: Clinic[] = [
  {
    slug: 'ricardo-valenca',
    name: 'Clínica do Dr. Ricardo Valença',
    doctor: 'Dr. Ricardo Valença',
    specialties: ['Neurologia', 'Cannabis medicinal'],
    summary:
      'Linha neurológica com foco em doenças crônicas complexas, terapias de cannabis medicinal e neuroreabilitação com IA residente.',
    introduction:
      'O Dr. Ricardo conduz o atendimento integrando protocolos neurológicos avançados, personalização com IA e acompanhamento contínuo pelo Supabase.',
    services: [
      {
        title: 'Protocolos assistidos pela IA',
        items: [
          'Avaliação neurológica inteligente com coleta estruturada pelo chat clínico',
          'Plano terapêutico com cannabis medicinal baseado na base de conhecimento da clínica',
          'Monitoramento longitudinal e geração de relatórios narrativos automáticos',
        ],
      },
      {
        title: 'Serviços clínicos',
        items: [
          'Consulta neurológica presencial e telemedicina',
          'Preparação para cirurgias e neuromodulação',
          'Integração com equipe multiprofissional e educação do paciente',
        ],
      },
    ],
    highlights: [
      {
        label: 'IA residente',
        description:
          'Chat clínico e relatórios que aprendem continuamente com as decisões médicas e dados do Supabase.',
      },
      {
        label: 'Cannabis medicinal',
        description:
          'Protocolos validados com o laboratório MedCannLab e material educativo para pacientes e familiares.',
      },
      {
        label: 'Operação integrada',
        description:
          'Agendamento, pagamentos e prontuário conectados ao Mercado Pago e à base clínica compartilhada.',
      },
    ],
    team: [
      {
        name: 'Dra. Ana Ribeiro',
        role: 'Neurologista assistente',
        focus: 'Doenças neurodegenerativas e reabilitação cognitiva',
      },
      {
        name: 'Felipe Monteiro',
        role: 'Farmacêutico clínico',
        focus: 'Protocolos com cannabis medicinal e interações medicamentosas',
      },
      {
        name: 'Juliana Teixeira',
        role: 'Enfermeira coordenadora',
        focus: 'Linha de cuidado contínua e acompanhamento remoto',
      },
    ],
    contact: {
      email: supportEmail,
      phone: contactPhone,
      whatsapp: ricardoWhatsapp,
      address: 'Av. Boa Viagem, 1000 - Recife/PE',
      schedule: ['Seg a Sex – 08h às 18h', 'Sábado – 09h às 13h (telemedicina)'],
    },
    integrations: [
      {
        name: 'Supabase',
        details:
          'Persistência de histórico clínico, aprendizado da IA e dashboards operacionais em tempo real.',
      },
      {
        name: 'OpenAI',
        details: 'Modelos GPT para triagem, relatórios narrativos e suporte ao prontuário.',
      },
      {
        name: 'Mercado Pago',
        details:
          'Gestão de assinaturas de acompanhamento, consultas avulsas e pacotes terapêuticos.',
      },
    ],
  },
  {
    slug: 'eduardo-favaret',
    name: 'Clínica do Dr. Eduardo Favaret',
    doctor: 'Dr. Eduardo Favaret',
    specialties: ['Nefrologia', 'Medicina integrada'],
    summary:
      'Centro nefrológico com foco em cuidados contínuos, detecção precoce de complicações e educação ativa do paciente.',
    introduction:
      'O Dr. Eduardo utiliza os dashboards integrados para acompanhamento de pacientes renais crônicos, protocolos de diálise e suporte multiprofissional.',
    services: [
      {
        title: 'Gestão clínica assistida',
        items: [
          'Triagem de sintomas renais com IA e alertas de risco',
          'Planos nutricionais personalizados e integração com equipe multiprofissional',
          'Checklists para transplante, diálise e acompanhamento pós-operatório',
        ],
      },
      {
        title: 'Linhas de cuidado',
        items: [
          'Consultas presenciais e telemonitoramento',
          'Coordenação de exames laboratoriais e imagem com parceiros',
          'Educação do paciente e família via base clínica compartilhada',
        ],
      },
    ],
    highlights: [
      {
        label: 'Monitoramento ativo',
        description:
          'Indicadores clínicos e alertas automáticos configurados para pacientes renais crônicos.',
      },
      {
        label: 'Fluxo interdisciplinar',
        description:
          'Equipe multiprofissional alinhada com protocolos do Supabase e aprendizado da IA.',
      },
      {
        label: 'Pagamentos simplificados',
        description:
          'Cobranças recorrentes de programas de diálise e pacotes de acompanhamento via Mercado Pago.',
      },
    ],
    team: [
      {
        name: 'Dra. Marina Albuquerque',
        role: 'Nefrologista assistente',
        focus: 'Transplante renal e acompanhamento pós-operatório',
      },
      {
        name: 'Renato Lima',
        role: 'Coordenador de enfermagem',
        focus: 'Protocolos de diálise domiciliar e educação do cuidador',
      },
      {
        name: 'Camila Figueiredo',
        role: 'Nutricionista clínica',
        focus: 'Planos nutricionais individualizados para pacientes renais',
      },
    ],
    contact: {
      email: supportEmail,
      phone: contactPhone,
      whatsapp: eduardoWhatsapp,
      address: 'Rua das Palmeiras, 250 - São Paulo/SP',
      schedule: ['Seg a Sex – 08h às 19h', 'Plantão remoto para emergências 24h'],
    },
    integrations: [
      {
        name: 'Supabase',
        details:
          'Dashboards de risco renal, histórico longitudinal e registros multiprofissionais.',
      },
      {
        name: 'OpenAI',
        details:
          'Assistente clínico para síntese de casos e explicações personalizadas ao paciente.',
      },
      {
        name: 'Mercado Pago',
        details: 'Planos de acompanhamento contínuo, teleconsultas e serviços extras.',
      },
    ],
  },
]
