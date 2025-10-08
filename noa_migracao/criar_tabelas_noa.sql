-- 🧠 CRIAÇÃO DE TABELAS PARA MIGRAÇÃO CHATGPT → NÔA ESPERANZA
-- Script adaptado para Supabase
-- Dr. Ricardo Valença - Outubro 2025

-- ========================================
-- EXTENSÕES NECESSÁRIAS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA DE INTERAÇÕES NÔA (CONVERSAS MIGRADAS)
-- ========================================
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_interacoes_usuario ON interacoes_noa(usuario);
CREATE INDEX IF NOT EXISTS idx_interacoes_data ON interacoes_noa(data DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_origem ON interacoes_noa(origem);
CREATE INDEX IF NOT EXISTS idx_interacoes_hash ON interacoes_noa(hash_integridade);

-- ========================================
-- TABELA DE AUDITORIA SIMBÓLICA (NFT/BLOCKCHAIN)
-- ========================================
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

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_auditoria_hash ON auditoria_simbolica(hash_coletivo);
CREATE INDEX IF NOT EXISTS idx_auditoria_token ON auditoria_simbolica(nft_token_id);

-- ========================================
-- TABELA DE MENSAGENS INDIVIDUAIS (PARSING DETALHADO)
-- ========================================
CREATE TABLE IF NOT EXISTS mensagens_noa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interacao_id UUID REFERENCES interacoes_noa(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' ou 'assistant'
  content TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  timestamp TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para mensagens
CREATE INDEX IF NOT EXISTS idx_mensagens_interacao ON mensagens_noa(interacao_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_role ON mensagens_noa(role);
CREATE INDEX IF NOT EXISTS idx_mensagens_ordem ON mensagens_noa(interacao_id, ordem);

-- ========================================
-- TABELA DE ESTATÍSTICAS DE MIGRAÇÃO
-- ========================================
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
-- FUNÇÕES AUXILIARES
-- ========================================

-- Função para gerar hash de integridade
CREATE OR REPLACE FUNCTION gerar_hash_integridade(content TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(content, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER trigger_atualizar_timestamp
BEFORE UPDATE ON interacoes_noa
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

-- ========================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ========================================

-- Habilitar RLS
ALTER TABLE interacoes_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_simbolica ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_noa ENABLE ROW LEVEL SECURITY;
ALTER TABLE estatisticas_migracao ENABLE ROW LEVEL SECURITY;

-- Política: Leitura pública para conversas
CREATE POLICY "Permitir leitura de interações" ON interacoes_noa
FOR SELECT USING (true);

-- Política: Inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção de interações" ON interacoes_noa
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política: Leitura pública para auditoria
CREATE POLICY "Permitir leitura de auditoria" ON auditoria_simbolica
FOR SELECT USING (true);

-- Política: Inserção de auditoria apenas para service role
CREATE POLICY "Permitir inserção de auditoria" ON auditoria_simbolica
FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Política: Leitura de mensagens
CREATE POLICY "Permitir leitura de mensagens" ON mensagens_noa
FOR SELECT USING (true);

-- Política: Inserção de mensagens
CREATE POLICY "Permitir inserção de mensagens" ON mensagens_noa
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política: Leitura de estatísticas
CREATE POLICY "Permitir leitura de estatísticas" ON estatisticas_migracao
FOR SELECT USING (true);

-- ========================================
-- VIEWS ÚTEIS
-- ========================================

-- View: Estatísticas gerais
CREATE OR REPLACE VIEW v_estatisticas_gerais AS
SELECT 
  COUNT(DISTINCT id) as total_interacoes,
  COUNT(DISTINCT usuario) as total_usuarios,
  MIN(data) as primeira_interacao,
  MAX(data) as ultima_interacao,
  COUNT(DISTINCT DATE(data)) as dias_ativos,
  COUNT(DISTINCT origem) as total_origens
FROM interacoes_noa;

-- View: Interações por origem
CREATE OR REPLACE VIEW v_interacoes_por_origem AS
SELECT 
  origem,
  COUNT(*) as total,
  MIN(data) as primeira,
  MAX(data) as ultima
FROM interacoes_noa
GROUP BY origem
ORDER BY total DESC;

-- View: Timeline de interações
CREATE OR REPLACE VIEW v_timeline_interacoes AS
SELECT 
  DATE(data) as dia,
  COUNT(*) as total_interacoes,
  COUNT(DISTINCT usuario) as usuarios_ativos
FROM interacoes_noa
GROUP BY DATE(data)
ORDER BY dia DESC;

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Mostrar tabelas criadas
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('interacoes_noa', 'auditoria_simbolica', 'mensagens_noa', 'estatisticas_migracao')
ORDER BY table_name;

-- ========================================
-- COMENTÁRIOS NAS TABELAS
-- ========================================

COMMENT ON TABLE interacoes_noa IS 'Conversas migradas do ChatGPT e outras fontes';
COMMENT ON TABLE auditoria_simbolica IS 'Registro de hashes coletivos e NFTs para auditoria';
COMMENT ON TABLE mensagens_noa IS 'Mensagens individuais parseadas de cada conversa';
COMMENT ON TABLE estatisticas_migracao IS 'Estatísticas de cada processo de migração executado';

COMMENT ON COLUMN interacoes_noa.hash_integridade IS 'Hash SHA-256 do conteúdo para verificação de integridade';
COMMENT ON COLUMN auditoria_simbolica.hash_coletivo IS 'Hash coletivo de múltiplas interações para registro blockchain';
COMMENT ON COLUMN mensagens_noa.role IS 'user (usuário) ou assistant (Nôa)';

-- ========================================
-- FIM DO SCRIPT
-- ========================================

SELECT '✅ Tabelas criadas com sucesso! Pronto para migração.' as status;

