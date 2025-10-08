-- SQL FINAL PARA SUPABASE - Nôa Esperanza 2.0
-- Execute este SQL no Supabase SQL Editor

-- Extensões
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela documentos_mestres
CREATE TABLE IF NOT EXISTS documentos_mestres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Tabela noa_config
CREATE TABLE IF NOT EXISTS noa_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela user_recognition
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

-- Tabela master_prompts
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

-- Tabela interacoes_noa
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

-- Tabela mensagens_noa
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

-- Tabela auditoria_simbolica
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

-- Tabela estatisticas_migracao
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

-- Habilitar RLS
ALTER TABLE documentos_mestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE noa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_simbolica ENABLE ROW LEVEL SECURITY;
ALTER TABLE estatisticas_migracao ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "public_read_docs" ON documentos_mestres FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_config" ON noa_config FOR SELECT USING (true);
CREATE POLICY "public_read_interacoes" ON interacoes_noa FOR SELECT USING (true);
CREATE POLICY "public_read_mensagens" ON mensagens_noa FOR SELECT USING (true);
CREATE POLICY "public_read_auditoria" ON auditoria_simbolica FOR SELECT USING (true);
CREATE POLICY "public_read_stats" ON estatisticas_migracao FOR SELECT USING (true);

CREATE POLICY "auth_write_docs" ON documentos_mestres FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_config" ON noa_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_interacoes" ON interacoes_noa FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_mensagens" ON mensagens_noa FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_auditoria" ON auditoria_simbolica FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_stats" ON estatisticas_migracao FOR ALL USING (auth.role() = 'authenticated');

-- Verificação
SELECT 'TABELAS CRIADAS COM SUCESSO!' as status;
