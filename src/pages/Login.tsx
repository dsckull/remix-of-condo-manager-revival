import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable/index';
import { Shield, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { motion } from 'framer-motion';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('signup') === 'true') setIsSignUp(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else if (isSignUp) {
      toast({ title: 'Conta criada com sucesso!' });
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: 'Erro', description: String(result.error), variant: 'destructive' });
        setGoogleLoading(false);
      }
      if (result.redirected) return;
      setGoogleLoading(false);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="neo-raised rounded-3xl p-10">
          <div className="flex flex-col items-center mb-10">
            <NeoDisc size="xl" className="mb-6">
              <Shield className="h-10 w-10 text-accent" />
            </NeoDisc>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">CONSERJE</h1>
            <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase">Gestão Condominial</p>
          </div>

          {/* Google Login */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full neo-raised rounded-full py-3 font-bold text-primary flex items-center justify-center gap-3 hover:glow-gold transition-all disabled:opacity-50 mb-4"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar com Google
          </motion.button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="neo-inset rounded-2xl px-4 py-3 flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="neo-inset rounded-2xl px-4 py-3">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full neo-raised rounded-full py-3 font-bold text-primary flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </motion.button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-sm text-muted-foreground hover:text-accent mt-6 transition-colors"
          >
            {isSignUp ? 'Já tem conta? Entrar' : 'Criar nova conta'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
