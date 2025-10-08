# 📦 MIGRAÇÃO GPT NÔA ESPERANZA – Pacote Completo

## 🎯 Objetivo

Migrar todas as conversas do ChatGPT (conta `iaianoaesperanza@gmail.com`) para a plataforma Nôa Esperanza, com registro de integridade via hash coletivo e opcional NFT blockchain.

---

## 📂 Estrutura do Pacote

```
noa_migracao/
├── README_NOA_MIGRACAO.md            ← Este arquivo
├── criar_tabelas_noa.sql             ← SQL para criar tabelas no Supabase
├── python_scripts/
│   ├── migrar_conversas_chatgpt.py   ← Script Python para migração
│   └── gerar_hash_coletivo_nft.py    ← Gera hash coletivo para NFT
├── blockchain/
│   └── EscuteseNFT.sol               ← Smart contract Solidity para NFT
└── server/ (futuro)
    ├── db.js
    └── routes/
        └── interacoes.js
```

---

## 🚀 OPÇÃO 1: Interface Web (RECOMENDADO)

### **Método Mais Simples e Visual**

1. **Fazer Export do ChatGPT:**

   ```
   ChatGPT → Settings → Data Controls → Export Data
   Aguarde email com link de download
   Baixe o arquivo .zip
   ```

2. **Acessar Interface de Migração:**

   ```bash
   npm run dev
   # Acessar: http://localhost:5173/app/migrar-chatgpt
   ```

3. **Upload do Arquivo:**
   - Clique em "Selecionar Arquivo"
   - Escolha o .zip baixado do ChatGPT
   - Aguarde processamento (automático)

4. **Resultado:**
   - ✅ Conversas migradas
   - ✅ Hash coletivo gerado
   - ✅ Estatísticas exibidas
   - ✅ Pronto para usar!

**Vantagens:**

- ✅ Não precisa configurar nada
- ✅ Visual e intuitivo
- ✅ Integrado com Supabase
- ✅ Estatísticas em tempo real

---

## 🐍 OPÇÃO 2: Script Python

### **Pré-requisitos**

```bash
# Instalar dependências
pip install psycopg2-binary
```

### **Passo 1: Criar Tabelas no Supabase**

1. Acessar Supabase Dashboard
2. SQL Editor
3. Copiar conteúdo de `criar_tabelas_noa.sql`
4. Executar

### **Passo 2: Configurar Credenciais**

Editar `python_scripts/migrar_conversas_chatgpt.py`:

```python
SUPABASE_CONFIG = {
    "host": "db.xxx.supabase.co",      # Seu host Supabase
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "SUA_SENHA_AQUI"       # Sua senha
}

ARQUIVO_EXPORT = "chatgpt-export.zip"  # Nome do arquivo
```

### **Passo 3: Executar Migração**

```bash
cd noa_migracao/python_scripts
python migrar_conversas_chatgpt.py
```

### **Passo 4: Gerar Hash Coletivo para NFT (Opcional)**

```bash
python gerar_hash_coletivo_nft.py
```

---

## 💾 Tabelas Criadas

### **1. interacoes_noa**

Armazena todas as conversas migradas

```sql
- id (UUID)
- usuario (TEXT) - Email do usuário
- data (TIMESTAMP) - Data da conversa
- conteudo (JSONB) - Conversa completa
- eixo (TEXT) - Eixo temático
- origem (TEXT) - Origem dos dados
- hash_integridade (TEXT) - Hash SHA-256
- metadata (JSONB) - Metadados adicionais
```

### **2. mensagens_noa**

Mensagens individuais parseadas

```sql
- id (UUID)
- interacao_id (UUID) - Referência à conversa
- role (TEXT) - 'user' ou 'assistant'
- content (TEXT) - Conteúdo da mensagem
- ordem (INTEGER) - Ordem na conversa
- timestamp (TIMESTAMP)
```

### **3. auditoria_simbolica**

Hashes coletivos para auditoria/NFT

```sql
- id (UUID)
- descricao (TEXT)
- hash_coletivo (TEXT) - Hash SHA-256 coletivo
- nft_token_id (INTEGER) - ID do NFT (se criado)
- nft_contract_address (TEXT) - Endereço do contrato
- blockchain_network (TEXT) - Rede blockchain
```

### **4. estatisticas_migracao**

Estatísticas de cada migração

```sql
- id (UUID)
- total_conversas (INTEGER)
- total_mensagens (INTEGER)
- total_duplicatas (INTEGER)
- data_inicio (TIMESTAMP)
- data_fim (TIMESTAMP)
- hash_coletivo (TEXT)
- status (TEXT)
```

---

## 🔗 Blockchain e NFT (Opcional)

### **Objetivo**

Criar NFT com hash coletivo das conversas para registro imutável e auditável.

### **Passo 1: Deploy do Smart Contract**

1. **Acessar Remix IDE:**

   ```
   https://remix.ethereum.org
   ```

2. **Importar Contrato:**
   - Criar arquivo `EscuteseNFT.sol`
   - Copiar conteúdo de `blockchain/EscuteseNFT.sol`

3. **Compilar:**
   - Compiler version: 0.8.20+
   - Compilar

4. **Deploy:**
   - Ambiente: Injected Provider (MetaMask)
   - Rede: Polygon Mumbai (testnet) ou Polygon Mainnet
   - Deploy

5. **Copiar Endereço do Contrato**

### **Passo 2: Criar NFT com Hash Coletivo**

Usar o hash gerado pela migração:

```javascript
// No Remix, após deploy
mint(
  'hash_coletivo_aqui', // Hash SHA-256 de 64 caracteres
  'ipfs://...', // URI dos metadados (pode ser qualquer URL)
  'Migração ChatGPT - Nôa Esperanza 2025', // Descrição
  123 // Número de conversas
)
```

### **Passo 3: Registrar NFT no Banco**

```sql
UPDATE auditoria_simbolica
SET
  nft_token_id = 1,
  nft_contract_address = '0xSEU_CONTRATO_AQUI',
  blockchain_network = 'polygon'
WHERE hash_coletivo = 'SEU_HASH_AQUI';
```

---

## 📊 Verificações e Queries Úteis

### **Ver Total de Conversas Migradas**

```sql
SELECT COUNT(*) as total FROM interacoes_noa;
```

### **Ver Conversas por Origem**

```sql
SELECT origem, COUNT(*) as total
FROM interacoes_noa
GROUP BY origem
ORDER BY total DESC;
```

### **Ver Timeline de Conversas**

```sql
SELECT DATE(data) as dia, COUNT(*) as total
FROM interacoes_noa
GROUP BY DATE(data)
ORDER BY dia DESC;
```

### **Ver Hash Coletivo Mais Recente**

```sql
SELECT * FROM auditoria_simbolica
ORDER BY criado_em DESC
LIMIT 1;
```

### **Ver Estatísticas da Última Migração**

```sql
SELECT * FROM estatisticas_migracao
ORDER BY criado_em DESC
LIMIT 1;
```

---

## 🔒 Segurança e Integridade

### **Hash de Integridade**

Cada conversa tem um hash SHA-256 único que garante:

- ✅ Detecção de modificações
- ✅ Prevenção de duplicatas
- ✅ Auditabilidade

### **Hash Coletivo**

Hash de todos os hashes individuais que garante:

- ✅ Integridade do conjunto completo
- ✅ Registro imutável via NFT
- ✅ Prova criptográfica da migração

### **Blockchain NFT**

Registro opcional em blockchain que garante:

- ✅ Imutabilidade absoluta
- ✅ Timestamp verificável
- ✅ Propriedade comprovada

---

## ⚠️ Troubleshooting

### **Erro: "Tabela não existe"**

```sql
-- Execute o script criar_tabelas_noa.sql no Supabase
```

### **Erro: "Permissão negada"**

```sql
-- Verificar RLS policies no Supabase
-- Pode ser necessário desabilitar RLS temporariamente
ALTER TABLE interacoes_noa DISABLE ROW LEVEL SECURITY;
```

### **Erro: "Hash já registrado"**

```
-- É normal, significa que a conversa já foi migrada
-- Sistema ignora duplicatas automaticamente
```

### **Erro: "conversations.json não encontrado"**

```
-- Verificar estrutura do ZIP
-- Pode estar em data/conversations.json
-- Editar script se necessário
```

### **Erro de conexão Python**

```python
# Verificar credenciais em SUPABASE_CONFIG
# Verificar se IP está na allowlist do Supabase
# Settings → Database → Connection Pooling
```

---

## 📈 Próximos Passos Após Migração

1. ✅ **Verificar Dados:**
   - Acessar Supabase → Table Editor
   - Verificar tabela `interacoes_noa`

2. ✅ **Analisar Conversas:**
   - Usar queries SQL para insights
   - Exportar para análise

3. ✅ **Criar Visualizações:**
   - Dashboard de estatísticas
   - Timeline de interações

4. ✅ **Integrar com Nôa:**
   - Usar histórico nas respostas
   - Aprendizado contínuo

5. ✅ **Registrar NFT (Opcional):**
   - Deploy smart contract
   - Mint NFT com hash coletivo

---

## 🎯 Checklist de Migração

- [ ] Export do ChatGPT baixado
- [ ] Tabelas criadas no Supabase (SQL executado)
- [ ] Credenciais configuradas (se usar Python)
- [ ] Migração executada (Web ou Python)
- [ ] Verificar dados no Supabase
- [ ] Hash coletivo gerado
- [ ] (Opcional) NFT criado no blockchain
- [ ] (Opcional) Token ID registrado no banco

---

## 📝 Notas Importantes

- ✅ O sistema ignora conversas duplicadas automaticamente
- ✅ Hash de integridade garante que nada foi modificado
- ✅ Dados originais completos são preservados no campo `conteudo`
- ✅ Mensagens individuais são parseadas para facilitar consultas
- ✅ Estatísticas são salvas automaticamente
- ✅ Processo é idempotente (pode ser executado múltiplas vezes)

---

## 🆘 Suporte

Se tiver problemas:

1. Verificar logs do console (F12 no navegador)
2. Verificar logs do Python
3. Verificar tabelas no Supabase
4. Consultar este README

---

## 📚 Referências

- **Supabase Docs:** https://supabase.com/docs
- **Remix IDE:** https://remix.ethereum.org
- **Polygon Network:** https://polygon.technology
- **ChatGPT Export:** https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data

---

**Última atualização:** 07 de Outubro de 2025  
**Autor:** Dr. Ricardo Valença  
**Projeto:** Nôa Esperanza 2.0
