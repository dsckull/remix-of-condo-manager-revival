
-- Public read-only policies for demo mode (login removed for assembly presentation)
CREATE POLICY "Public read demo" ON public.moradores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.encomendas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.visitantes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.ocorrencias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.financeiro FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.areas_comuns FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.reservas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.assembleias FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.votacoes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.documentos_juridicos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.notificacoes_juridicas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read demo" ON public.alertas_defcom FOR SELECT TO anon, authenticated USING (true);
