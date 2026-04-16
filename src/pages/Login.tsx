import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable';
import { Shield, Loader2, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const callbackUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    if (searchParams.get('signup') === 'true') setIsSignUp(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        toast({ title: 'Erro ao cadastrar', description: error.message, variant: 'destructive' });
      } else {
        setEmailSent(true);
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) msg = 'Email ou senha incorretos.';
        if (msg.includes('Email not confirmed')) msg = 'Confirme seu email antes de entrar.';
        toast({ title: 'Erro ao entrar', description: msg, variant: 'destructive' });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ title: 'Erro Google', description: 'Não foi possível conectar com o Google.', variant: 'destructive' });
      setGoogleLoading(false);
      return;
    }
    if (result.redirected) return; // browser is redirecting
    // tokens received & session set — go to dashboard
    window.location.href = '/';
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm">
          <div className="neo-raised rounded-3xl p-10 text-center">
            <NeoDisc size="xl" className="mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </NeoDisc>
            <h1 className="text-2xl font-bold text-primary mb-3">Verifique seu email</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Enviamos um link de confirmação para <strong className="text-primary">{email}</strong>. Clique no link para ativar sua conta.
            </p>
            <button onClick={() => { setEmailSent(false); setIsSignUp(false); }}
              className="neo-raised rounded-full px-6 py-2.5 text-sm font-bold text-accent hover:glow-gold transition-all">
              Já confirmei → Entrar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm">
        <div className="neo-raised rounded-3xl p-10">
          <div className="flex flex-col items-center mb-10">
            <NeoDisc size="xl" className="mb-6">
              <Shield className="h-10 w-10 text-accent" />
            </NeoDisc>
            <h1 className="text-3xl font-bold tracking-tighter text-primary">CONSERJE</h1>
            <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase">Gestão Condominial</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.2 }}>

              {/* Google */}
              <motion.button onClick={handleGoogleLogin} disabled={googleLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full neo-raised rounded-full py-3 font-bold text-primary flex items-center justify-center gap-3 hover:glow-gold transition-all disabled:opacity-50 mb-4">
                {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="neo-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground flex-shrink-0" />
                  <input type="email" placeholder="Email" value={email}
                    onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
                </div>
                <div className="neo-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Lock size={16} className="text-muted-foreground flex-shrink-0" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Senha" value={password}
                    onChange={e => setPassword(e.target.value)} required minLength={6}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {isSignUp && (
                  <p className="text-xs text-muted-foreground px-1">
                    Após o cadastro, você receberá um email de confirmação.
                  </p>
                )}

                <motion.button type="submit" disabled={loading || !email || !password}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full neo-raised rounded-full py-3 font-bold text-primary flex items-center justify-center gap-2 hover:glow-gold transition-all disabled:opacity-50">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-sm text-muted-foreground hover:text-accent mt-6 transition-colors">
            {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
