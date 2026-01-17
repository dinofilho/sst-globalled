import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Stethoscope, 
  HardHat, 
  ShoppingCart, 
  Pill, 
  UtensilsCrossed, 
  Hotel as HotelIcon, 
  Droplets, 
  Microscope, 
  Calculator,
  ArrowRight,
  Check,
  MessageCircle,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Factory
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

interface Video {
  id: string;
  title: string;
  url: string;
  platform: string;
  display_order: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

export default function Home() {
const navigate = useNavigate();
const [videos, setVideos] = useState<Video[]>([]);
const [loadingVideos, setLoadingVideos] = useState(true);
const [plans, setPlans] = useState<Plan[]>([]);
const [loadingPlans, setLoadingPlans] = useState(true);
const { toast } = useToast();

useEffect(() => {
  loadVideos();
  loadPlans();
}, []);

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) {
        console.error("Erro ao carregar vídeos:", error);
      } else {
        console.log("Vídeos carregados:", data);
        setVideos(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      setPlans((data as Plan[]) || []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const getPlatformStyles = (platform: string) => {
    const styles: Record<string, { gradient: string; icon: JSX.Element; name: string; color: string }> = {
      tiktok: {
        gradient: "from-pink-600 via-purple-500 to-blue-500",
        icon: (
          <svg viewBox="0 0 24 24" className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
        ),
        name: "TikTok",
        color: "from-pink-600 via-purple-500 to-blue-500"
      },
      facebook: {
        gradient: "from-blue-700 via-blue-600 to-blue-500",
        icon: (
          <svg viewBox="0 0 24 24" className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        name: "Facebook",
        color: "from-blue-700 via-blue-600 to-blue-500"
      },
      instagram: {
        gradient: "from-purple-600 via-pink-500 to-orange-400",
        icon: (
          <svg viewBox="0 0 24 24" className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        name: "Instagram",
        color: "from-purple-600 via-pink-500 to-orange-400"
      },
      youtube: {
        gradient: "from-red-600 via-red-500 to-red-400",
        icon: (
          <svg viewBox="0 0 48 48" className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform" fill="currentColor">
            <path d="M16 10v28l22-14z"/>
          </svg>
        ),
        name: "YouTube",
        color: "from-red-600 via-red-500 to-red-400"
      }
    };
    return styles[platform] || styles.tiktok;
  };

  const openExternal = async (url: string, platform: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url });
      } else {
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win) {
          try {
            await navigator.clipboard.writeText(url);
            toast({
              title: `Não foi possível abrir ${platform}`,
              description: 'Link copiado! Cole no navegador.',
            });
          } catch {
            toast({
              title: `Não foi possível abrir ${platform}`,
              description: 'Tente copiar o link manualmente.',
            });
          }
        }
      }
    } catch (err) {
      toast({
        title: `Erro ao abrir ${platform}`,
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  const businessTypes = [
    {
      type: 'medical',
      icon: Stethoscope,
      title: 'Consultório Médico Ocupacional',
      description: 'Sistema completo para gestão de consultório médico ocupacional',
      features: ['Gestão de Exames', 'Cadastro de Pacientes', 'Controle de Médicos', 'Agenda', 'Laudos e APT']
    },
    {
      type: 'dental',
      icon: Microscope,
      title: 'Consultório Odontológico',
      description: 'Sistema completo para gestão de consultório odontológico',
      features: ['Agendamento', 'Cadastro de Pacientes', 'Tratamentos', 'Financeiro', 'Prontuários']
    },
    {
      type: 'pharmacy',
      icon: Pill,
      title: 'Farmácia',
      description: 'Sistema de gestão para farmácias e drogarias',
      features: ['Controle de Estoque', 'Vendas', 'Receitas', 'Fornecedores', 'Relatórios']
    },
    {
      type: 'restaurant',
      icon: UtensilsCrossed,
      title: 'Restaurante',
      description: 'Sistema de gestão para restaurantes e bares',
      features: ['Cardápio', 'Pedidos', 'Estoque', 'Finanças', 'Relatórios']
    },
    {
      type: 'hotel',
      icon: HotelIcon,
      title: 'Hotel',
      description: 'Sistema de gestão hoteleira completo',
      features: ['Reservas', 'Check-in/out', 'Quartos', 'Hóspedes', 'Financeiro']
    },
    {
      type: 'carwash',
      icon: Droplets,
      title: 'Estética Automotiva',
      description: 'Sistema de gestão para estética automotiva',
      features: ['Agendamento', 'Serviços', 'Clientes', 'Caixa', 'Relatórios']
    },
    {
      type: 'accounting',
      icon: Calculator,
      title: 'Escritório Contábil',
      description: 'Sistema de gestão para escritórios de contabilidade',
      features: ['Clientes', 'Documentos', 'Prazos', 'Obrigações', 'Relatórios']
    },
    {
      type: 'sst',
      icon: HardHat,
      title: 'SST - Saúde e Segurança no Trabalho',
      description: 'Sistema completo para gestão de segurança do trabalho',
      features: ['Programas SST', 'Riscos', 'EPIs', 'PPP', 'NRs']
    },
    {
      type: 'nr',
      icon: HardHat,
      title: 'NR - Normas Regulamentadoras',
      description: 'Sistema especializado em Normas Regulamentadoras',
      features: ['Gestão de NRs', 'Compliance', 'Auditorias', 'Treinamentos', 'Relatórios']
    },
    {
      type: 'retail',
      icon: ShoppingCart,
      title: 'Varejo / Comércio',
      description: 'Sistema de gestão para lojas e comércio',
      features: ['Vendas', 'Estoque', 'Clientes', 'Financeiro', 'Relatórios']
    },
    {
      type: 'industria',
      icon: Factory,
      title: 'Indústria',
      description: 'Sistema completo para gestão industrial',
      features: ['Produção', 'Estoque', 'Qualidade', 'Manutenção', 'Relatórios']
    },
    {
      type: 'fabrica',
      icon: Building2,
      title: 'Fábrica',
      description: 'Sistema de gestão para fábricas e manufatura',
      features: ['Linhas de Produção', 'Controle de Qualidade', 'Estoque', 'Funcionários', 'Relatórios']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Botão Flutuante WhatsApp */}
      <a
        href="https://wa.me/551433224141?text=Olá! Tenho dúvidas sobre o Hub Negócio Fácil"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.3)] hover:shadow-[0_12px_40px_rgb(37,211,102,0.4)] transition-all duration-300 hover:scale-105 group animate-in slide-in-from-bottom-5"
        title="Fale conosco pelo WhatsApp"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="font-semibold hidden sm:inline group-hover:inline">Tire suas dúvidas</span>
      </a>
      
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl shadow-lg">
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Hub Negócio Fácil
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">Gestão Profissional</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-semibold">
              Entrar
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="shadow-lg hover:shadow-xl transition-shadow font-semibold">
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-shadow">
            <Zap className="w-4 h-4" />
            <span>Simplifique a gestão do seu negócio agora</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Gestão Empresarial que{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-pulse">
              Impulsiona Resultados
            </span>
          </h2>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Sistema completo e intuitivo para gerenciar todas as áreas do seu negócio. 
            Economize tempo, reduza custos e tome decisões mais inteligentes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="gap-2 text-lg px-8 py-6 shadow-[0_8px_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 font-bold"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-lg px-8 py-6 border-2 hover:bg-accent/5 transition-all duration-300 hover:scale-105 font-bold"
              onClick={() => window.open('https://wa.me/551433224141?text=Olá! Quero conhecer mais sobre o Hub Negócio Fácil', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Especialista
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12 border-t-2 border-border/50">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm font-medium text-muted-foreground">Empresas Ativas</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-sm font-medium text-muted-foreground">Satisfação</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">40%</div>
              <div className="text-sm font-medium text-muted-foreground">Economia de Tempo</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-sm font-medium text-muted-foreground">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-br from-muted/30 via-background to-secondary/20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            <span>Vantagens Exclusivas</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold mb-4">Por Que Escolher o Hub Negócio Fácil?</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para gerenciar seu negócio em um único lugar, com tecnologia de ponta e suporte humanizado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="text-center border-2 border-border/50 hover:border-primary/50 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Rápido e Fácil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interface intuitiva que você aprende em minutos. Comece a usar imediatamente sem complicações.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-border/50 hover:border-primary/50 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Seguro e Confiável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seus dados protegidos com criptografia de ponta e backup automático em nuvem.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-border/50 hover:border-primary/50 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Cresça Mais Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Relatórios e insights inteligentes para tomar decisões que impulsionam seu crescimento.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-border/50 hover:border-primary/50 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">Economize Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatize tarefas repetitivas e foque no que realmente importa para seu negócio.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Field Work Video Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HardHat className="w-4 h-4" />
              <span>Nossa Equipe em Ação</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold mb-3">
              Veja Nossa Transparência
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profissionais qualificados garantindo segurança e conformidade nas Normas Regulamentadoras
            </p>
          </div>

          <div className="space-y-8">
            {/* Videos Grid */}
            {loadingVideos ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Carregando vídeos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum vídeo disponível no momento.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${videos.length <= 2 ? 'md:grid-cols-2' : videos.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                {videos.map((video) => {
                const platformStyle = getPlatformStyles(video.platform);
                
                const rawUrl = (video.url || '').trim();
                const normalizedUrl = rawUrl ? (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`) : '';
                const href = normalizedUrl || undefined;
                
                return (
                  <a
                    key={video.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!href) return;
                      const win = window.open(href, '_blank', 'noopener,noreferrer');
                      if (win) {
                        e.preventDefault();
                        win.focus?.();
                      } else {
                        try { navigator.clipboard?.writeText(href); } catch {}
                        toast({
                          title: `Não foi possível abrir ${platformStyle.name}`,
                          description: 'Copiamos o link para você abrir manualmente.',
                        });
                      }
                    }}
                    className="relative rounded-xl overflow-hidden shadow-2xl group cursor-pointer block transition-transform hover:scale-105"
                  >
                    <div className={`relative w-full aspect-video bg-gradient-to-br ${platformStyle.gradient} flex items-center justify-center`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                        {platformStyle.icon}
                        <div className="text-center px-4">
                          <p className="text-xl font-bold mb-1">{video.title}</p>
                          <p className="text-sm opacity-90">Clique para assistir</p>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2`}>
                        <span className={`text-sm font-semibold bg-gradient-to-r ${platformStyle.color} bg-clip-text text-transparent`}>
                          {platformStyle.name}
                        </span>
                      </div>
                    </div>
                  </a>
                  );
                })}
              </div>
            )}

            {/* Information and Badges */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h4 className="text-xl font-bold">Especialistas em Segurança do Trabalho</h4>
                <p className="text-muted-foreground">
                  Nossa equipe atua diretamente em campo, realizando inspeções, treinamentos e 
                  implementando programas de SST conforme as Normas Regulamentadoras.
                </p>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">NR-35</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <HardHat className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">NR-10</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">CREA/CFT</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Laudos ASO</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="gap-2 min-w-[300px]"
                onClick={() => window.open('https://wa.me/551433224141?text=Olá! Vi os vídeos em campo e gostaria de mais informações', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                Fale com Nossos Especialistas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-muted/30">
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Planos e Preços</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>

        {loadingPlans ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando planos...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
              <Card key={plan.id} className={`border-2 hover:shadow-lg transition-all duration-300 ${idx === 1 ? 'border-primary relative' : ''}`}>
                {idx === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description || 'Plano do sistema'}</CardDescription>
                  <div className="pt-4">
                    <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/mês</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full gap-2"
                    variant={idx === 1 ? 'default' : 'outline'}
                    onClick={() => window.open(`https://wa.me/551433224141?text=Olá! Tenho interesse no plano ${encodeURIComponent(plan.name)}`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contatar via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Business Types Grid */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Escolha Seu Tipo de Negócio</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Sistemas especializados para cada segmento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
          {businessTypes.map((business) => {
            const Icon = business.icon;
            return (
              <Card 
                key={business.type}
                className="hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer active:scale-95"
                onClick={() => navigate("/auth")}
              >
                <CardHeader className="pb-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-14 md:h-14 rounded-full bg-primary/10 mb-3">
                    <Icon className="w-8 h-8 md:w-7 md:h-7 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{business.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {business.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1.5">
                    {business.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">O Que Nossos Clientes Dizem</h3>
          <p className="text-muted-foreground">
            Empresas reais, resultados reais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <CardDescription className="text-foreground">
                "Transformou completamente a gestão do meu consultório. Economizo 3 horas por dia com a automação!"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-sm">Dr. Carlos Silva</p>
              <p className="text-xs text-muted-foreground">Consultório Médico Ocupacional</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <CardDescription className="text-foreground">
                "Finalmente um sistema que entende as necessidades de SST. Compliance garantido!"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-sm">Eng. Ana Paula Santos</p>
              <p className="text-xs text-muted-foreground">Empresa de Segurança do Trabalho</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <CardDescription className="text-foreground">
                "Interface simples e poderosa. Minha equipe aprendeu em 1 dia e já está usando 100%."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-sm">Roberto Almeida</p>
              <p className="text-xs text-muted-foreground">Escritório Contábil</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Perguntas Frequentes</h3>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre o sistema
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preciso de conhecimentos técnicos para usar?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Não! O Hub Negócio Fácil foi desenvolvido para ser extremamente intuitivo. 
                Qualquer pessoa consegue usar sem treinamento técnico.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meus dados estão seguros?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sim! Utilizamos criptografia de nível bancário e fazemos backup automático diário. 
                Seus dados estão protegidos e sempre disponíveis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sim! Não há fidelidade ou multa por cancelamento. Você pode cancelar quando quiser 
                e seus dados ficam disponíveis por 30 dias.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como funciona o suporte?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Oferecemos suporte via WhatsApp, email e chat. Nos planos Pro e Enterprise, 
                o suporte é 24/7 com tempo de resposta garantido.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso testar antes de pagar?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sim! Temos um plano gratuito completo para você testar. Não precisa de cartão de crédito.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 md:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar Seu Negócio?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de empresas que já simplificaram sua gestão
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Começar Agora - É Grátis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('https://wa.me/551433224141?text=Olá! Quero saber mais sobre os planos', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Vendas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="font-bold">Hub Negócio Fácil</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Gestão empresarial inteligente para o seu negócio crescer.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary">Preços</a></li>
                <li><a href="#" className="hover:text-primary">Segurança</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Sobre</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Central de Ajuda</a></li>
                <li><a href="mailto:impactomsn@gmail.com" className="hover:text-primary">impactomsn@gmail.com</a></li>
                <li><a href="https://wa.me/551433224141" target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© 2025 Hub Negócio Fácil - Gestão Empresarial Inteligente. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
