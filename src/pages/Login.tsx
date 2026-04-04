import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="w-full max-w-sm glass-card neo-shadow p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-xl bg-primary/10 glow-blue mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-widest text-foreground">CONSERJE</h1>
          <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão Condominial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary border-border"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-secondary border-border"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
        >
          {isSignUp ? 'Já tem conta? Entrar' : 'Criar nova conta'}
        </button>
      </div>
    </div>
  );
}
