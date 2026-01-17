import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  ArrowRight, 
  Stethoscope, 
  HardHat, 
  ShoppingCart, 
  Pill, 
  UtensilsCrossed, 
  Hotel as HotelIcon, 
  Droplets, 
  Microscope, 
  Calculator,
  Trash2,
  MessageCircle,
  Factory
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SelectBusiness() {
  const [businessName, setBusinessName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null);
  const [devDialogOpen, setDevDialogOpen] = useState(false);
  const { user } = useAuth();
  const { businesses, createBusiness, deleteBusiness, loading: businessLoading } = useBusiness();
  const navigate = useNavigate();
  
  // Tipos de negócio ativos
  const activeBusinessTypes = ['nr', 'medical', 'sst', 'industria', 'fabrica'];
  
  const handleBusinessTypeClick = (type: string) => {
    if (activeBusinessTypes.includes(type)) {
      setSelectedType(type);
    } else {
      setDevDialogOpen(true);
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5514981359770', '_blank');
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  const handleDeleteClick = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinessToDelete(businessId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return;
    
    try {
      await deleteBusiness(businessToDelete);
      setDeleteDialogOpen(false);
      setBusinessToDelete(null);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast({
        variant: "destructive",
        title: "Selecione um tipo",
        description: "Por favor, selecione o tipo de negócio.",
      });
      return;
    }

    if (!businessName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira o nome do negócio.",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createBusiness(selectedType, businessName.trim());
      
      const businessTypeNames: Record<string, string> = {
        medical: 'consultório médico',
        sst: 'negócio de SST',
        nr: 'sistema de treinamento de NRs',
        dental: 'consultório odontológico',
        pharmacy: 'farmácia',
        restaurant: 'restaurante',
        hotel: 'hotel',
        carwash: 'estética automotiva',
        accounting: 'escritório contábil',
        retail: 'comércio',
        industria: 'indústria',
        fabrica: 'fábrica'
      };
      
      toast({
        title: "Negócio criado!",
        description: `Seu ${businessTypeNames[selectedType] || 'negócio'} foi criado com sucesso.`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar negócio",
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsCreating(false);
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
      title: 'TREINAMENTO DE NR NORMAS REGULAMENTADORAS',
      description: 'Sistema completo para treinamentos e gestão de Normas Regulamentadoras',
      features: ['Gestão de NRs', 'Provas', 'Certificados com QR Code', 'Conteúdo Programático', 'Histórico de Treinamentos']
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

  // Mostrar loading enquanto carrega
  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <div className="w-full max-w-6xl animate-in fade-in duration-500">
          {businesses && businesses.length > 0 && (
            <div className="mb-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {businesses && businesses.length > 0 ? 'Criar Novo Negócio' : 'Escolha Seu Negócio'}
            </h1>
            <p className="text-muted-foreground">Selecione o tipo de negócio que você deseja gerenciar</p>
          </div>

          {businesses && businesses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Suas Empresas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => {
                  const businessType = businessTypes.find(bt => bt.type === business.type);
                  const Icon = businessType?.icon || Building2;
                  
                  return (
                    <Card key={business.id} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDeleteClick(business.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-base mt-2">{business.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {businessType?.title || business.type}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessTypes.map((business) => {
              const Icon = business.icon;
              const isActive = activeBusinessTypes.includes(business.type);
              return (
                <Card 
                  key={business.type}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'hover:shadow-lg hover:border-primary' 
                      : 'opacity-60 hover:opacity-80'
                  }`}
                  onClick={() => handleBusinessTypeClick(business.type)}
                >
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {business.title}
                      {!isActive && <span className="ml-2 text-xs text-muted-foreground">(Em breve)</span>}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {business.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {business.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso irá excluir permanentemente esta empresa
                e todos os dados associados a ela.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={devDialogOpen} onOpenChange={setDevDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">🚧 Em Desenvolvimento</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Este modelo de negócio está sendo desenvolvido e estará disponível em breve.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <p className="text-sm text-muted-foreground">
                Quer saber mais ou acompanhar o desenvolvimento? Entre em contato com o responsável!
              </p>
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full gap-2"
                size="lg"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com o Desenvolvedor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const currentBusiness = businessTypes.find(b => b.type === selectedType);
  const CurrentIcon = currentBusiness?.icon || Building2;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedType(null)}
          className="mb-4"
        >
          ← Voltar
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CurrentIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            {currentBusiness?.title}
          </h1>
          <p className="text-muted-foreground mt-2">Configure seu negócio para começar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Criar Novo Negócio
            </CardTitle>
            <CardDescription>
              {currentBusiness?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome do Negócio</Label>
                <Input
                  id="business-name"
                  type="text"
                  placeholder={`Ex: ${currentBusiness?.title}`}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  disabled={isCreating}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={isCreating}
              >
                {isCreating ? (
                  "Criando negócio..."
                ) : (
                  <>
                    Criar Negócio
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
