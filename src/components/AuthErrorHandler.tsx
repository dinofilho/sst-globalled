import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

/**
 * Componente que monitora e trata erros de autenticação globalmente
 */
export function AuthErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let hasShownError = false;

    // Monitora mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          hasShownError = false; // Reset error flag on successful refresh
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          hasShownError = false;
        }
        
        // Trata erros de token apenas uma vez
        if (!session && event === 'USER_UPDATED' && !hasShownError) {
          hasShownError = true;
          console.log('Invalid token detected, clearing session');
          
          // Limpa a sessão
          await supabase.auth.signOut();
          
          // Mostra mensagem ao usuário
          toast({
            variant: "destructive",
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
          });
          
          // Redireciona para login
          navigate('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null; // Componente invisível
}
