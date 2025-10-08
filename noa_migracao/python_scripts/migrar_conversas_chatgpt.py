#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧠 MIGRAÇÃO DE CONVERSAS CHATGPT → NÔA ESPERANZA
Script para migrar export do ChatGPT para o Supabase
Dr. Ricardo Valença - Outubro 2025
"""

import json
import hashlib
import uuid
import zipfile
import datetime
import os
from typing import Dict, List, Any
import psycopg2
from psycopg2.extras import execute_values

# ========================================
# CONFIGURAÇÕES
# ========================================

# Configurar com suas credenciais Supabase
SUPABASE_CONFIG = {
    "host": "YOUR_SUPABASE_HOST",  # ex: db.xxxx.supabase.co
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "YOUR_PASSWORD"
}

# Usuário da migração
USUARIO_MIGRACAO = "iaianoaesperanza@gmail.com"
ORIGEM = "ChatGPT – Nôa Esperanza 5.0"
EIXO = "sistemico-tecnico"

# Arquivo de export
ARQUIVO_EXPORT = "chatgpt-export.zip"  # ou "conversations.json"

# ========================================
# FUNÇÕES AUXILIARES
# ========================================

def gerar_hash(content: str) -> str:
    """Gera hash SHA-256 de um conteúdo"""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def conectar_banco():
    """Conecta ao banco Supabase"""
    try:
        conn = psycopg2.connect(**SUPABASE_CONFIG)
        print("✅ Conectado ao Supabase com sucesso!")
        return conn
    except Exception as e:
        print(f"❌ Erro ao conectar ao banco: {e}")
        raise

def carregar_export(arquivo: str) -> List[Dict]:
    """Carrega conversas do export do ChatGPT"""
    print(f"📂 Carregando arquivo: {arquivo}")
    
    if arquivo.endswith('.zip'):
        with zipfile.ZipFile(arquivo) as z:
            # Tentar encontrar conversations.json
            possible_files = ['conversations.json', 'data/conversations.json']
            for fname in possible_files:
                try:
                    data = json.loads(z.read(fname).decode('utf-8'))
                    print(f"✅ Arquivo {fname} carregado do ZIP")
                    return data
                except KeyError:
                    continue
            raise FileNotFoundError("conversations.json não encontrado no ZIP")
    else:
        with open(arquivo, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print("✅ Arquivo JSON carregado")
            return data

def parsear_conversa(conv: Dict) -> Dict:
    """Parseia uma conversa do formato ChatGPT"""
    try:
        # Extrair informações principais
        conv_id = conv.get('id', str(uuid.uuid4()))
        title = conv.get('title', 'Sem título')
        create_time = conv.get('create_time')
        update_time = conv.get('update_time')
        
        # Converter timestamp
        if isinstance(create_time, (int, float)):
            data = datetime.datetime.fromtimestamp(create_time)
        elif isinstance(create_time, str):
            # Tentar parsear ISO format
            data = datetime.datetime.fromisoformat(create_time.replace('Z', '+00:00'))
        else:
            data = datetime.datetime.now()
        
        # Extrair mensagens
        mapping = conv.get('mapping', {})
        mensagens = []
        
        for msg_id, msg_data in mapping.items():
            message = msg_data.get('message')
            if message and message.get('content'):
                role = message.get('author', {}).get('role', 'unknown')
                content_parts = message.get('content', {}).get('parts', [])
                content = '\n'.join([str(p) for p in content_parts if p])
                
                if content.strip():
                    mensagens.append({
                        'role': role,
                        'content': content,
                        'timestamp': message.get('create_time')
                    })
        
        # Construir objeto completo
        conteudo = {
            'id': conv_id,
            'title': title,
            'create_time': create_time,
            'update_time': update_time,
            'mensagens': mensagens,
            'original': conv  # Guardar original completo
        }
        
        return {
            'data': data,
            'conteudo': json.dumps(conteudo, ensure_ascii=False),
            'metadata': {
                'title': title,
                'total_mensagens': len(mensagens),
                'conversation_id': conv_id
            }
        }
        
    except Exception as e:
        print(f"⚠️ Erro ao parsear conversa: {e}")
        return None

def migrar_conversa(cur, conv_parseada: Dict) -> tuple:
    """Migra uma conversa para o banco"""
    uid = str(uuid.uuid4())
    content = conv_parseada['conteudo']
    sha = gerar_hash(content)
    
    try:
        cur.execute("""
            INSERT INTO interacoes_noa 
            (id, usuario, data, conteudo, eixo, origem, hash_integridade, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (hash_integridade) DO NOTHING
            RETURNING id;
        """, (
            uid,
            USUARIO_MIGRACAO,
            conv_parseada['data'],
            content,
            EIXO,
            ORIGEM,
            sha,
            json.dumps(conv_parseada['metadata'])
        ))
        
        result = cur.fetchone()
        if result:
            # Inserir mensagens individuais
            interacao_id = result[0]
            mensagens = json.loads(content).get('mensagens', [])
            
            for i, msg in enumerate(mensagens):
                cur.execute("""
                    INSERT INTO mensagens_noa 
                    (interacao_id, role, content, ordem, timestamp)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    interacao_id,
                    msg['role'],
                    msg['content'],
                    i,
                    msg.get('timestamp')
                ))
            
            return ('inserido', interacao_id)
        else:
            return ('duplicado', None)
            
    except Exception as e:
        print(f"❌ Erro ao migrar conversa: {e}")
        return ('erro', None)

def gerar_estatisticas(cur, total_conversas: int, inseridos: int, duplicados: int, 
                       erros: int, arquivo: str, hash_coletivo: str = None):
    """Salva estatísticas da migração"""
    cur.execute("""
        INSERT INTO estatisticas_migracao 
        (total_conversas, total_mensagens, total_duplicatas, data_fim, 
         hash_coletivo, arquivo_origem, status)
        SELECT 
            %s,
            (SELECT COUNT(*) FROM mensagens_noa),
            %s,
            NOW(),
            %s,
            %s,
            'concluido'
    """, (total_conversas, duplicados, hash_coletivo, arquivo))

# ========================================
# FUNÇÃO PRINCIPAL
# ========================================

def main():
    """Executa a migração completa"""
    print("\n" + "="*60)
    print("🧠 MIGRAÇÃO CHATGPT → NÔA ESPERANZA")
    print("="*60 + "\n")
    
    # Verificar se arquivo existe
    if not os.path.exists(ARQUIVO_EXPORT):
        print(f"❌ Arquivo não encontrado: {ARQUIVO_EXPORT}")
        print("\n📝 Instruções:")
        print("1. Faça o export no ChatGPT: Settings → Data Controls → Export Data")
        print("2. Baixe o arquivo ZIP")
        print(f"3. Coloque o arquivo na mesma pasta deste script com nome: {ARQUIVO_EXPORT}")
        print("4. Execute novamente\n")
        return
    
    # Conectar ao banco
    try:
        conn = conectar_banco()
        cur = conn.cursor()
    except:
        print("\n📝 Configure suas credenciais Supabase no script:")
        print("SUPABASE_CONFIG = { 'host': '...', 'password': '...' }")
        return
    
    # Registrar início
    cur.execute("""
        INSERT INTO estatisticas_migracao (status, data_inicio, arquivo_origem)
        VALUES ('em_progresso', NOW(), %s)
        RETURNING id
    """, (ARQUIVO_EXPORT,))
    migracao_id = cur.fetchone()[0]
    conn.commit()
    
    # Carregar conversas
    try:
        conversas = carregar_export(ARQUIVO_EXPORT)
        print(f"\n📊 Total de conversas encontradas: {len(conversas)}")
    except Exception as e:
        print(f"❌ Erro ao carregar export: {e}")
        return
    
    # Migrar conversas
    print("\n🚀 Iniciando migração...\n")
    inseridos = 0
    duplicados = 0
    erros = 0
    hashes_para_coletivo = []
    
    for i, conv in enumerate(conversas, 1):
        print(f"[{i}/{len(conversas)}] Processando conversa...", end='')
        
        conv_parseada = parsear_conversa(conv)
        if not conv_parseada:
            print(" ❌ Erro no parsing")
            erros += 1
            continue
        
        resultado, interacao_id = migrar_conversa(cur, conv_parseada)
        
        if resultado == 'inserido':
            print(f" ✅ Inserida (ID: {interacao_id[:8]}...)")
            inseridos += 1
            hashes_para_coletivo.append(gerar_hash(conv_parseada['conteudo']))
        elif resultado == 'duplicado':
            print(" ⏭️  Já existe (ignorada)")
            duplicados += 1
        else:
            print(" ❌ Erro")
            erros += 1
        
        # Commit a cada 10 conversas
        if i % 10 == 0:
            conn.commit()
    
    # Commit final
    conn.commit()
    
    # Gerar hash coletivo
    print("\n🔗 Gerando hash coletivo para NFT...")
    hash_coletivo = gerar_hash(''.join(sorted(hashes_para_coletivo)))
    
    cur.execute("""
        INSERT INTO auditoria_simbolica (descricao, hash_coletivo, metadata)
        VALUES (%s, %s, %s)
    """, (
        f"Hash coletivo da migração ChatGPT – {datetime.datetime.now().isoformat()}",
        hash_coletivo,
        json.dumps({
            'total_conversas': len(conversas),
            'inseridas': inseridos,
            'duplicadas': duplicados,
            'arquivo': ARQUIVO_EXPORT
        })
    ))
    
    # Salvar estatísticas
    gerar_estatisticas(cur, len(conversas), inseridos, duplicados, erros, 
                       ARQUIVO_EXPORT, hash_coletivo)
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Relatório final
    print("\n" + "="*60)
    print("✅ MIGRAÇÃO CONCLUÍDA!")
    print("="*60)
    print(f"\n📊 Estatísticas:")
    print(f"   Total de conversas: {len(conversas)}")
    print(f"   ✅ Inseridas: {inseridos}")
    print(f"   ⏭️  Duplicadas: {duplicados}")
    print(f"   ❌ Erros: {erros}")
    print(f"\n🔗 Hash Coletivo (para NFT):")
    print(f"   {hash_coletivo}")
    print(f"\n💾 Dados salvos no Supabase!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()

