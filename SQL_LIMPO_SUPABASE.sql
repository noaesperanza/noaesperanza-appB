-- ========================================
-- SQL LIMPO PARA SUPABASE - Nôa Esperanza 2.0
-- Execute este arquivo COMPLETO no Supabase SQL Editor
-- ========================================

-- ========================================
-- EXTENSÕES
-- ========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PARTE 1: BASE DE CONHECIMENTO
-- ========================================

-- Tabela: documentos_mestres
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

CREATE INDEX IF NOT EXISTS idx_documentos_type ON documentos_mestres(type);
CREATE INDEX IF NOT EXISTS idx_documentos_category ON documentos_mestres(category);
CREATE INDEX IF NOT EXISTS idx_documentos_active ON documentos_mestres(is_active);

-- Tabela: noa_config
CREATE TABLE IF NOT EXISTS noa_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: user_recognition
CREATE TABLE IF NOT EXISTS user_recognition (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    specialization VARCHAR(255),
    greeting_template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: master_prompts
CREATE TABLE IF NOT EXISTS master_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    category VARCHAR(100),
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PARTE 2: MIGRAÇÃO CHATGPT
-- ========================================

-- Tabela: interacoes_noa
CREATE TABLE IF NOT EXISTS interacoes_noa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario TEXT NOT NULL,
  data TIMESTAMP NOT NULL,
  conteudo JSONB NOT NULL,
  eixo TEXT,
  origem TEXT,
  hash_integridade TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_usuario ON interacoes_noa(usuario);
CREATE INDEX IF NOT EXISTS idx_interacoes_data ON interacoes_noa(data DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_origem ON interacoes_noa(origem);
CREATE INDEX IF NOT EXISTS idx_interacoes_hash ON interacoes_noa(hash_integridade);

-- Tabela: mensagens_noa
CREATE TABLE IF NOT EXISTS mensagens_noa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interacao_id UUID REFERENCES interacoes_noa(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  timestamp TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensagens_interacao ON mensagens_noa(interacao_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_role ON mensagens_noa(role);

-- Tabela: auditoria_simbolica
CREATE TABLE IF NOT EXISTS auditoria_simbolica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT,
  hash_coletivo TEXT NOT NULL,
  nft_token_id INTEGER,
  nft_contract_address TEXT,
  blockchain_network TEXT DEFAULT 'polygon',
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_hash ON auditoria_simbolica(hash_coletivo);

-- Tabela: estatisticas_migracao
CREATE TABLE IF NOT EXISTS estatisticas_migracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_conversas INTEGER DEFAULT 0,
  total_mensagens INTEGER DEFAULT 0,
  total_duplicatas INTEGER DEFAULT 0,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  hash_coletivo TEXT,
  arquivo_origem TEXT,
  status TEXT DEFAULT 'em_progresso',
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- PARTE 3: RLS POLICIES
-- ========================================

-- Habilitar RLS
ALTER TABLE documentos_mestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE noa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_simbolica ENABLE ROW LEVEL SECURITY;
ALTER TABLE estatisticas_migracao ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura (público)
DROP POLICY IF EXISTS "Leitura publica documentos" ON documentos_mestres;
CREATE POLICY "Leitura publica documentos" ON documentos_mestres FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Leitura publica config" ON noa_config;
CREATE POLICY "Leitura publica config" ON noa_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura publica interacoes" ON interacoes_noa;
CREATE POLICY "Leitura publica interacoes" ON interacoes_noa FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura publica mensagens" ON mensagens_noa;
CREATE POLICY "Leitura publica mensagens" ON mensagens_noa FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura publica auditoria" ON auditoria_simbolica;
CREATE POLICY "Leitura publica auditoria" ON auditoria_simbolica FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura publica estatisticas" ON estatisticas_migracao;
CREATE POLICY "Leitura publica estatisticas" ON estatisticas_migracao FOR SELECT USING (true);

-- Políticas de escrita (autenticados)
DROP POLICY IF EXISTS "Escrita autenticada documentos" ON documentos_mestres;
CREATE POLICY "Escrita autenticada documentos" ON documentos_mestres
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Escrita autenticada config" ON noa_config;
CREATE POLICY "Escrita autenticada config" ON noa_config
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Escrita autenticada interacoes" ON interacoes_noa;
CREATE POLICY "Escrita autenticada interacoes" ON interacoes_noa
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Escrita autenticada mensagens" ON mensagens_noa;
CREATE POLICY "Escrita autenticada mensagens" ON mensagens_noa
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Escrita autenticada auditoria" ON auditoria_simbolica;
CREATE POLICY "Escrita autenticada auditoria" ON auditoria_simbolica
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Escrita autenticada estatisticas" ON estatisticas_migracao;
CREATE POLICY "Escrita autenticada estatisticas" ON estatisticas_migracao
FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Mostrar tabelas criadas
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'documentos_mestres',
    'noa_config',
    'user_recognition',
    'master_prompts',
    'interacoes_noa',
    'mensagens_noa',
    'auditoria_simbolica',
    'estatisticas_migracao'
  )
ORDER BY table_name;

-- Mensagem de sucesso
SELECT 'TODAS AS TABELAS CRIADAS COM SUCESSO! Sistema pronto para deploy no Vercel.' as status;
