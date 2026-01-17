import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Mail, Lock, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_active: boolean;
}

export default function Auth() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPlan, setSignupPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const { signIn, signUp, user, signOut } = useAuth();
  const { loading: businessLoading } = useBusiness();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const approvalPending = searchParams.get('approval') === 'pending';
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      
      const activePlans = (data as Plan[]) || [];
      setPlans(activePlans);
      
      // Define o primeiro plano como padrão
      if (activePlans.length > 0 && !signupPlan) {
        setSignupPlan(activePlans[0].name);
      }
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      toast({
        title: "Erro ao carregar planos",
        description: "Usando planos padrão.",
        variant: "destructive",
      });
      // Fallback para planos padrão
      setPlans([
        { id: '1', name: 'Gratuito', price: 0, description: null, is_active: true },
        { id: '2', name: 'Pro', price: 99.90, description: null, is_active: true },
      ]);
      setSignupPlan('Gratuito');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem. Por favor, verifique.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(signupEmail, signupPassword, signupName, signupPlan);
      
      // Send notification email
      try {
        await supabase.functions.invoke('notify-new-user', {
          body: {
            email: signupEmail,
            name: signupName,
            plan: signupPlan,
          },
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowResetDialog(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-3 sm:p-4">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">GestãoPro</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Gestão empresarial inteligente</p>
        </div>

        {approvalPending && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Aguarde aprovação</AlertTitle>
            <AlertDescription>
              SEU ACESSO SERA LIBERADO EM ALGUNS INSTANTES. AGORA É SÓ AGUARDAR E TENTE LOGAR EM ALGUNS MINUTOS.
            </AlertDescription>
          </Alert>
        )}

        {user && (
          businessLoading ? (
            <Card className="mb-4">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Verificando seus negócios...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Você já está logado</CardTitle>
                <CardDescription>Conectado como {user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button onClick={() => navigate('/dashboard')}>Ir para o Painel</Button>
                <Button variant="outline" onClick={() => navigate('/select-business')}>Selecionar Negócio</Button>
                <Button variant="ghost" onClick={async () => { await signOut(); }}>Trocar de conta</Button>
              </CardContent>
            </Card>
          )
        )}

        <div className={user ? 'hidden' : 'block'}>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo de volta</CardTitle>
                  <CardDescription>Entre com suas credenciais</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} noValidate className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-9"
                            minLength={1}
                            autoComplete="new-password"
                            inputMode="text"
                            required
                          />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="w-full text-sm" type="button">
                          Esqueceu sua senha?
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Redefinir Senha</DialogTitle>
                          <DialogDescription>
                            Digite seu email e enviaremos um link para redefinir sua senha.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="seu@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="pl-9"
                                required
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full" disabled={isResetting}>
                            {isResetting ? 'Enviando...' : 'Enviar Link de Redefinição'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Criar nova conta</CardTitle>
                  <CardDescription>Preencha os dados para começar</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} noValidate className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••••••"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-9"
                            minLength={1}
                            autoComplete="new-password"
                            inputMode="text"
                            required
                          />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="••••••••••••"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            className="pl-9"
                            minLength={1}
                            autoComplete="new-password"
                            inputMode="text"
                            required
                            
                          />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Plano</Label>
                      {loadingPlans ? (
                        <div className="text-sm text-muted-foreground">
                          Carregando planos...
                        </div>
                      ) : (
                        <RadioGroup
                          value={signupPlan}
                          onValueChange={setSignupPlan}
                        >
                          {plans.map((plan) => (
                            <div key={plan.id} className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={plan.name} id={plan.id} className="mt-1" />
                              <Label htmlFor={plan.id} className="cursor-pointer font-normal flex-1">
                                <div className="font-semibold">{plan.name}</div>
                                <div className="text-sm text-primary font-bold">
                                  R$ {plan.price.toFixed(2)}{plan.price === 0 ? '' : '/mês'}
                                </div>
                                {plan.description && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {plan.description}
                                  </div>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
