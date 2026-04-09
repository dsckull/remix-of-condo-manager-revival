import { useState } from 'react';
import { Bot, X, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AiAssistantFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[60] w-80 neo-raised rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Assistente IA</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="neo-inset rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={18} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Via Telegram</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                O assistente IA está disponível pelo Telegram. Ele pode ajudar com dúvidas sobre o condomínio, gerar relatórios rápidos e automatizar tarefas.
              </p>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Tire dúvidas sobre regulamento
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Consulte informações de moradores
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Gere relatórios financeiros
              </p>
            </div>
            <button className="w-full neo-raised rounded-full py-2.5 mt-5 text-sm font-bold text-accent flex items-center justify-center gap-2 hover:glow-gold transition-all">
              <ExternalLink size={14} />
              Conectar Telegram
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 neo-raised rounded-full flex items-center justify-center text-accent hover:glow-gold transition-all"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </motion.button>
    </>
  );
}
