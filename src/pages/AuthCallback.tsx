import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle hash-based tokens (implicit flow / magic link)
        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);

        // Handle PKCE code exchange
        const code = params.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // Check if we have an error in the URL
        const errorDesc = params.get('error_description') || params.get('error');
        if (errorDesc) throw new Error(decodeURIComponent(errorDesc));

        // Wait briefly for onAuthStateChange to fire, then redirect
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/', { replace: true });
        } else {
          // Fallback: wait a bit and check again
          setTimeout(async () => {
            const { data: { session: s2 } } = await supabase.auth.getSession();
            navigate(s2 ? '/' : '/login', { replace: true });
          }, 1500);
        }
      } catch (err: any) {
        setError(err.message || 'Erro na autenticação');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="neo-raised rounded-3xl p-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 neo-inset rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">Erro no acesso</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button onClick={() => navigate('/login', { replace: true })}
            className="neo-raised rounded-full px-6 py-2.5 text-sm font-bold text-accent hover:glow-gold transition-all">
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="neo-raised rounded-3xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 neo-inset rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Autenticando...</h2>
        <p className="text-sm text-muted-foreground">Aguarde, estamos verificando seu acesso.</p>
      </div>
    </div>
  );
}
