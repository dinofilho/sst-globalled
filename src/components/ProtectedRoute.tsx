import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkApprovalStatus();
      
      // Listen for real-time updates to the profile
      const channel = supabase
        .channel('profile-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            console.log('Profile updated:', payload);
            if (payload.new && 'approved' in payload.new) {
              const newApproved = payload.new.approved;
              setApproved(newApproved);
              
              // Se foi revogado, fazer logout imediatamente
              // Não deslogar automaticamente se revogado; apenas atualizar estado
              // if (newApproved === false) {
              //   // Acesso permanece, apenas marcamos approved
              // }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkApprovalStatus = async () => {
    if (!user) return;

    try {
      // Primeiro verifica se é admin
      const { data: adminRole, error: adminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      // Ignorar erros de token - deixar AuthErrorHandler tratar
      if (adminError) {
        console.error('Error checking admin role:', adminError);
        // Continuar para verificar profile normal
      }
      
      // Se é admin, sempre aprovado (mas ainda verifica o status para outros admins poderem revogar)
      if (adminRole && !adminError) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('approved')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          setApproved(false);
          setLoading(false);
          return;
        }
        
        // Admin revogado não pode acessar
        if (profileData?.approved === false) {
          setApproved(false);
          setLoading(false);
          return;
        }
        
        setApproved(true);
        setLoading(false);
        return;
      }

      // Caso contrário, verifica o status de aprovação normal
      const { data, error } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking approval:', error);
        setApproved(false);
        setLoading(false);
        return;
      }
      
      setApproved(data?.approved ?? false);
    } catch (error) {
      console.error('Error checking approval status:', error);
      setApproved(false);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (approved === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Aguarde aprovação
            </CardTitle>
            <CardDescription>
              Seu acesso será liberado em breve. Por favor, aguarde alguns instantes e tente fazer login novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Assim que seu cadastro for aprovado, você poderá acessar o sistema normalmente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
