import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NeoDisc } from '@/components/neo/NeoDisc';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else if (isSignUp) {
      toast({ title: 'Conta criada!', description: 'Verifique seu email para confirmar.' });
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="neo-inset rounded-2xl px-4 py-3">
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
