
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  phone text,
  condominio_ativo_id integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Condominios table
CREATE TABLE public.condominios (
  id serial PRIMARY KEY,
  nome text NOT NULL,
  endereco text,
  cnpj text,
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.condominios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own condominios" ON public.condominios
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can view all condominios" ON public.condominios
  FOR SELECT USING (public.is_admin());

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  plano text NOT NULL DEFAULT 'free' CHECK (plano IN ('free', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Auto-create free subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plano, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Votacoes sindicancia (placeholder)
CREATE TABLE public.votacoes_sindicancia (
  id serial PRIMARY KEY,
  titulo text NOT NULL,
  descricao text,
  tipo text NOT NULL DEFAULT 'sindicancia' CHECK (tipo IN ('sindicancia', 'projeto', 'orcamento', 'regulamento', 'outro')),
  status text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'aberta', 'encerrada', 'cancelada')),
  data_inicio timestamptz,
  data_fim timestamptz,
  condominio_id integer,
  created_by uuid,
  resultado jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.votacoes_sindicancia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access votacoes_sindicancia" ON public.votacoes_sindicancia
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated can view votacoes" ON public.votacoes_sindicancia
  FOR SELECT TO authenticated USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_condominios_updated_at BEFORE UPDATE ON public.condominios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_votacoes_sindicancia_updated_at BEFORE UPDATE ON public.votacoes_sindicancia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK from profiles to condominios
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_condominio_ativo_fkey
  FOREIGN KEY (condominio_ativo_id) REFERENCES public.condominios(id);

-- Add FK from votacoes_sindicancia to condominios
ALTER TABLE public.votacoes_sindicancia
  ADD CONSTRAINT votacoes_sindicancia_condominio_fkey
  FOREIGN KEY (condominio_id) REFERENCES public.condominios(id);
