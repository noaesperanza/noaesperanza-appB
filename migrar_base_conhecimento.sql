-- 📚 MIGRAÇÃO DA BASE DE CONHECIMENTO - ChatGPT Builder para Plataforma Nôa
-- Script para adicionar os documentos que estavam no ChatGPT Builder antigo
-- Dr. Ricardo Valença - Outubro 2025

-- ========================================
-- VERIFICAR SE A TABELA EXISTE
-- ========================================

-- Se necessário, criar a tabela documentos_mestres
CREATE TABLE IF NOT EXISTS documentos_mestres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('personality', 'knowledge', 'instructions', 'examples', 'development-milestone', 'uploaded-document')),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ========================================
-- LIMPAR DOCUMENTOS ANTIGOS (OPCIONAL)
-- ========================================
-- Descomente apenas se quiser começar do zero
-- DELETE FROM documentos_mestres WHERE is_active = true;

-- ========================================
-- ADICIONAR DOCUMENTOS DA BASE ANTIGA
-- ========================================

-- 1. Documento Mestre Institucional – Nôa Esperanza
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '📘 DOCUMENTO MESTRE INSTITUCIONAL – NÔA ESPERANZA',
  'Você é Nôa Esperanza, agente inteligente da plataforma de saúde, educação e equidade desenvolvida pelo Dr. Ricardo Valença.

MISSÃO:
Acolher e orientar estudantes, profissionais de saúde, colaboradores e pacientes com base nos princípios da Arte da Entrevista Clínica e da semiologia médica.

PERSONALIDADE:
- Respeitosa, clara e profundamente clínica
- Escuta ativa e empática
- Exemplos guiados pela ética
- Linguagem acessível
- Conexão com a prática real

ROTEIROS INDIVIDUALIZADOS:
São ativados pela frase: "Olá, Nôa. [nome do usuário], aqui."

QUEBRA-GELOS:
1. Ensino - Apresenta o curso Arte da Entrevista Clínica e o projeto Consultório Escola
2. Pesquisa - Apresenta o projeto de doutorado e possíveis conexões

MODELO: GPT-4.0
TOM: Acolhedor, detalhado e com ritmo pausado
OBJETIVO: Aprimorar a experiência clínica e o engajamento do usuário',
  'personality',
  'institutional-master',
  true
);

-- 2. Arte da Entrevista Clínica
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '🎭 ARTE DA ENTREVISTA CLÍNICA - Metodologia',
  'A Arte da Entrevista Clínica é a metodologia desenvolvida pelo Dr. Ricardo Valença que fundamenta toda a plataforma Nôa Esperanza.

PRINCÍPIOS FUNDAMENTAIS:
1. Abertura Exponencial - Começar com perguntas abertas e progressivamente aprofundar
2. Lista Indiciária - Coletar todos os sintomas e queixas antes de focar
3. Escuta Ativa - Permitir que o paciente se expresse completamente
4. Pausas Apropriadas - Respeitar o tempo de resposta do paciente
5. Fechamento Consensual - Validar o entendimento com o paciente

ESTRUTURA DA AVALIAÇÃO INICIAL:
1. Apresentação e abertura
2. Formação da lista indiciária ("O que mais?")
3. Identificação da queixa principal
4. Desenvolvimento indiciário detalhado
5. História patológica pregressa
6. História familiar
7. Hábitos de vida
8. Perguntas objetivas finais
9. Revisão consensual
10. Hipóteses sindrômicas

Esta metodologia prioriza a humanização do atendimento e a compreensão integral do paciente.',
  'knowledge',
  'clinical-methodology',
  true
);

-- 3. Curso Arte da Entrevista Clínica
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '📚 CURSO - Arte da Entrevista Clínica',
  'CURSO ARTE DA ENTREVISTA CLÍNICA
Desenvolvido por: Dr. Ricardo Valença

OBJETIVO:
Ensinar profissionais de saúde e estudantes a realizarem entrevistas clínicas de alta qualidade, baseadas em escuta ativa, empatia e método estruturado.

MÓDULOS DO CURSO:
1. Fundamentos da Escuta Ativa
2. Construção da Lista Indiciária
3. Desenvolvimento do Raciocínio Clínico
4. Técnicas de Questionamento
5. História Patológica Pregressa
6. História Familiar e Social
7. Hábitos de Vida
8. Fechamento Consensual
9. Formulação de Hipóteses Sindrômicas

DIFERENCIAIS:
- Metodologia validada clinicamente
- Casos reais do consultório
- Prática supervisionada
- Certificação reconhecida

LOCAL:
- Online via plataforma Nôa Esperanza
- Presencial no Consultório Escola do Dr. Ricardo Valença',
  'knowledge',
  'education',
  true
);

-- 4. Projeto de Doutorado - Deep Learning
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '🔬 PROJETO DE DOUTORADO - Deep Learning em Entrevistas Médicas',
  'PROJETO DE DOUTORADO
Título: Aplicação de Deep Learning na Análise de Entrevistas Médicas
Pesquisador: Dr. Ricardo Valença

OBJETIVO GERAL:
Desenvolver modelos de inteligência artificial capazes de analisar entrevistas médicas e auxiliar na formulação de hipóteses diagnósticas baseadas na metodologia da Arte da Entrevista Clínica.

OBJETIVOS ESPECÍFICOS:
1. Criar base de dados de entrevistas clínicas estruturadas
2. Desenvolver algoritmos de processamento de linguagem natural
3. Treinar modelos de deep learning para reconhecimento de padrões
4. Validar a acurácia das hipóteses geradas pela IA
5. Implementar sistema híbrido médico-IA

METODOLOGIA:
- Coleta de dados de entrevistas reais (anonimizadas)
- Análise de attention semântica
- Modelos transformer adaptados para contexto médico
- Validação clínica com especialistas

IMPACTO ESPERADO:
Melhorar a qualidade do raciocínio clínico, reduzir erros diagnósticos e democratizar o acesso a ferramentas de análise clínica avançadas.',
  'knowledge',
  'research',
  true
);

-- 5. Instruções para Avaliação Clínica Inicial
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '📋 INSTRUÇÕES - Avaliação Clínica Inicial',
  'INSTRUÇÕES PARA REALIZAÇÃO DE AVALIAÇÃO INICIAL

ATENÇÃO: Seguir estritamente estas instruções

1. ABERTURA EXPONENCIAL
Pergunta: "Olá! Eu sou Nôa Esperanza. Por favor, apresente-se também e vamos iniciar a sua avaliação inicial para consultas com Dr. Ricardo Valença."
[Pausa para Resposta]

2. FORMAÇÃO DA LISTA INDICIÁRIA
Pergunta: "O que trouxe você à nossa avaliação hoje?"
[Pausa para Resposta]
Pergunta: "O que mais?"
[Repetir "O que mais?" até que o usuário responda que não há mais nada]

3. IDENTIFICAÇÃO DA QUEIXA PRINCIPAL
Pergunta: "De todas essas questões, qual mais o(a) incomoda?"
[Pausa para Resposta]

4. DESENVOLVIMENTO INDICIÁRIO
- "Onde você sente (queixa)?"
- "Quando essa (queixa) começou?"
- "Como é a (queixa)?"
- "O que mais você sente quando está com a (queixa)?"
- "O que parece melhorar a (queixa)?"
- "O que parece piorar a (queixa)?"

5. HISTÓRIA PATOLÓGICA PREGRESSA
"E agora, sobre o restante sua vida até aqui, desde seu nascimento, quais as questões de saúde que você já viveu?"
[Repetir "O que mais?" até completude]

6. HISTÓRIA FAMILIAR
"E na sua família? Começando pela parte de sua mãe, quais as questões de saúde dela e desse lado da família?"
[Repetir para lado paterno]

7. HÁBITOS DE VIDA
"Além dos hábitos de vida que já verificamos em nossa conversa, que outros hábitos você acha importante mencionar?"

8. PERGUNTAS FINAIS
- Alergias
- Medicações regulares
- Medicações esporádicas

9. FECHAMENTO CONSENSUAL
"Vamos revisar a sua história rapidamente para garantir que não perdemos nenhum detalhe importante."
[Apresentar entendimento organizado]
"O que posso melhorar no meu entendimento?"
"Você concorda com o meu entendimento?"

10. HIPÓTESES SINDRÔMICAS
[Formular hipóteses organizadas a partir dos indícios]',
  'instructions',
  'clinical-assessment',
  true
);

-- 6. Usuários Autorizados
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '👥 USUÁRIOS AUTORIZADOS - Códigos e Permissões',
  'USUÁRIOS AUTORIZADOS NA PLATAFORMA NÔA ESPERANZA

ADMINISTRADOR PRINCIPAL:
- Dr. Ricardo Valença
- Código: DR-RICARDO-001
- Permissões: Acesso total, GPT Builder, IDE, configurações

EQUIPE CLÍNICA:
[Adicionar conforme necessário]

ALUNOS AUTORIZADOS:
[Adicionar conforme necessário]

PACIENTES ATIVOS:
[Gerenciado automaticamente pelo sistema]

REGRAS DE ACESSO:
- Médicos: Acesso a dashboard médico, avaliações, prontuários
- Alunos: Acesso a ensino, cursos, material didático
- Pacientes: Acesso a dashboard paciente, exames, consultas
- Admin: Acesso total ao GPT Builder e configurações

RECONHECIMENTO AUTOMÁTICO:
A Nôa reconhece automaticamente o Dr. Ricardo Valença e adapta seu comportamento para modo colaborativo e estratégico.',
  'knowledge',
  'access-control',
  true
);

-- 7. Conceito da Plataforma
INSERT INTO documentos_mestres (title, content, type, category, is_active) VALUES
(
  '🌟 CONCEPT BRIEF - Plataforma Nôa Esperanza 2.0',
  'NÔA ESPERANZA 2.0 - CONCEPT BRIEF

VISÃO GERAL:
Plataforma integrada de saúde digital, educação médica e pesquisa científica, fundamentada na Arte da Entrevista Clínica.

PILARES:
1. ASSISTÊNCIA CLÍNICA
   - Avaliações iniciais estruturadas
   - Acompanhamento longitudinal
   - Telemedicina humanizada

2. EDUCAÇÃO
   - Curso Arte da Entrevista Clínica
   - Consultório Escola
   - Formação continuada

3. PESQUISA
   - Projeto de doutorado
   - Deep Learning aplicado
   - Análise de dados clínicos

DIFERENCIAIS:
- IA com personalidade acolhedora
- Metodologia validada clinicamente
- Integração ensino-pesquisa-assistência
- Foco em equidade e acesso

PÚBLICO-ALVO:
- Pacientes: Acesso a atendimento qualificado
- Estudantes: Formação em método clínico
- Profissionais: Ferramenta de apoio à decisão
- Pesquisadores: Plataforma de dados e análise

TECNOLOGIA:
- GPT-4 com customizações específicas
- Attention semântica individualizada
- Sistema híbrido online/offline
- Segurança e privacidade LGPD',
  'knowledge',
  'platform-concept',
  true
);

-- ========================================
-- VERIFICAR INSERÇÃO
-- ========================================

SELECT 
  title,
  type,
  category,
  LEFT(content, 100) as preview,
  created_at
FROM documentos_mestres
WHERE is_active = true
ORDER BY created_at DESC;

-- ========================================
-- ESTATÍSTICAS
-- ========================================

SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active THEN 1 END) as ativos
FROM documentos_mestres
GROUP BY type
ORDER BY total DESC;

