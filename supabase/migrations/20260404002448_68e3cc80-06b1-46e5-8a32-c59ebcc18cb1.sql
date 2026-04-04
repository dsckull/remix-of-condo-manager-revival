
-- =============================================
-- CONSERJE: All 13 tables + user_roles + RLS
-- =============================================

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. MORADORES
CREATE TABLE public.moradores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  apartamento TEXT NOT NULL,
  bloco TEXT NOT NULL DEFAULT 'A',
  telefone TEXT,
  email TEXT,
  cpf TEXT,
  veiculo_placa TEXT,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.moradores ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_moradores_updated_at BEFORE UPDATE ON public.moradores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. ENCOMENDAS
CREATE TABLE public.encomendas (
  id SERIAL PRIMARY KEY,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE CASCADE NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'pacote',
  status TEXT NOT NULL DEFAULT 'pendente',
  data_recebimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_retirada TIMESTAMP WITH TIME ZONE,
  recebido_por TEXT,
  retirado_por TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.encomendas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_encomendas_updated_at BEFORE UPDATE ON public.encomendas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. VISITANTES
CREATE TABLE public.visitantes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  documento TEXT,
  tipo TEXT NOT NULL DEFAULT 'visitante',
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE SET NULL,
  apartamento_destino TEXT,
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_saida TIMESTAMP WITH TIME ZONE,
  veiculo_placa TEXT,
  autorizado_por TEXT,
  observacoes TEXT,
  dentro BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.visitantes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_visitantes_updated_at BEFORE UPDATE ON public.visitantes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. OCORRENCIAS
CREATE TABLE public.ocorrencias (
  id SERIAL PRIMARY KEY,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'reclamacao',
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberta',
  prioridade TEXT NOT NULL DEFAULT 'media',
  data_abertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  responsavel TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.ocorrencias ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_ocorrencias_updated_at BEFORE UPDATE ON public.ocorrencias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. FINANCEIRO
CREATE TABLE public.financeiro (
  id SERIAL PRIMARY KEY,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'receita',
  categoria TEXT NOT NULL DEFAULT 'condominio',
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  data_vencimento TIMESTAMP WITH TIME ZONE,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_financeiro_updated_at BEFORE UPDATE ON public.financeiro FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. ASSEMBLEIAS
CREATE TABLE public.assembleias (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_realizacao TIMESTAMP WITH TIME ZONE NOT NULL,
  local TEXT DEFAULT 'Salão de Festas',
  status TEXT NOT NULL DEFAULT 'agendada',
  ata_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.assembleias ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_assembleias_updated_at BEFORE UPDATE ON public.assembleias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. VOTACOES
CREATE TABLE public.votacoes (
  id SERIAL PRIMARY KEY,
  assembleia_id INTEGER REFERENCES public.assembleias(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  opcoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  resultado JSONB,
  status TEXT NOT NULL DEFAULT 'aberta',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.votacoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_votacoes_updated_at BEFORE UPDATE ON public.votacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. AREAS_COMUNS
CREATE TABLE public.areas_comuns (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  capacidade INTEGER DEFAULT 20,
  regras TEXT,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.areas_comuns ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_areas_comuns_updated_at BEFORE UPDATE ON public.areas_comuns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. RESERVAS
CREATE TABLE public.reservas (
  id SERIAL PRIMARY KEY,
  area_id INTEGER REFERENCES public.areas_comuns(id) ON DELETE CASCADE NOT NULL,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE CASCADE NOT NULL,
  data_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmada',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON public.reservas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. DOCUMENTOS_JURIDICOS
CREATE TABLE public.documentos_juridicos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'contrato',
  descricao TEXT,
  arquivo_url TEXT,
  data_documento DATE,
  validade DATE,
  status TEXT NOT NULL DEFAULT 'vigente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.documentos_juridicos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_documentos_juridicos_updated_at BEFORE UPDATE ON public.documentos_juridicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. NOTIFICACOES_JURIDICAS
CREATE TABLE public.notificacoes_juridicas (
  id SERIAL PRIMARY KEY,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'notificacao',
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_prazo TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'enviada',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notificacoes_juridicas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_notificacoes_juridicas_updated_at BEFORE UPDATE ON public.notificacoes_juridicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12. ALERTAS_DEFCOM
CREATE TABLE public.alertas_defcom (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'seguranca',
  titulo TEXT NOT NULL,
  descricao TEXT,
  nivel TEXT NOT NULL DEFAULT 'medio',
  status TEXT NOT NULL DEFAULT 'ativo',
  local TEXT,
  reportado_por TEXT,
  data_ocorrencia TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_resolucao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.alertas_defcom ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_alertas_defcom_updated_at BEFORE UPDATE ON public.alertas_defcom FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. LOGS_INTERACAO
CREATE TABLE public.logs_interacao (
  id SERIAL PRIMARY KEY,
  morador_id INTEGER REFERENCES public.moradores(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'chatbot',
  mensagem TEXT NOT NULL,
  resposta TEXT,
  canal TEXT DEFAULT 'web',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.logs_interacao ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES (admin access control)
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- =============================================
-- RLS POLICIES: Admin-only on all tables
-- =============================================

-- user_roles: admins can read, users can read their own
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_admin());
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- All 13 tables: authenticated users with admin role get full access
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'moradores','encomendas','visitantes','ocorrencias','financeiro',
    'assembleias','votacoes','areas_comuns','reservas',
    'documentos_juridicos','notificacoes_juridicas','alertas_defcom','logs_interacao'
  ])
  LOOP
    EXECUTE format('CREATE POLICY "Admin full access" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', tbl);
  END LOOP;
END;
$$;
