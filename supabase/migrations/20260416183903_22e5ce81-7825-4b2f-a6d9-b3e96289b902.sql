-- Remove over-permissive SELECT policy on votacoes_sindicancia
DROP POLICY IF EXISTS "Authenticated can view votacoes" ON public.votacoes_sindicancia;
-- Admin-only access remains via existing "Admins full access votacoes_sindicancia" policy