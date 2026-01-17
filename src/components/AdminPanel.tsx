import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Shield, ArrowLeft, Key, Video, DollarSign, Plus, Pencil, Trash2, Send, Share2, Download, Mail } from "lucide-react";
import type { ModuleName, PermissionAction } from "@/hooks/usePermissions";
import VideoManagement from "./modules/VideoManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { nrExams } from "@/lib/nr-data";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Profile {
  id: string;
  email: string;
  name: string;
  plan: string;
  approved: boolean;
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [selectedNR, setSelectedNR] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadProfiles();
      loadPlans();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error: any) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_list_profiles');
      if (error) throw error;
      setProfiles((data as Profile[]) || []);
      
      // Mostrar notificação se houver pendentes
      const pending = (data as Profile[])?.filter(p => !p.approved) || [];
      if (pending.length > 0) {
        toast({
          title: `🔔 ${pending.length} cadastro(s) aguardando aprovação`,
          description: "Clique para aprovar agora",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfis",
        description: error.message,
      });
    }
  };

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("display_order");
      if (error) throw error;
      setPlans((data as Plan[]) || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar planos",
        description: error.message,
      });
    }
  };

  const handleOpenPlanDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        name: plan.name,
        price: plan.price.toString(),
        description: plan.description || "",
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        name: "",
        price: "",
        description: "",
      });
    }
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      const price = parseFloat(planForm.price);
      if (isNaN(price)) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Preço inválido",
        });
        return;
      }

      const planData = {
        name: planForm.name,
        price: price,
        description: planForm.description || null,
      };

      if (editingPlan) {
        const { error } = await supabase
          .from("plans")
          .update(planData)
          .eq("id", editingPlan.id);
        
        if (error) throw error;
        
        toast({
          title: "Plano atualizado",
          description: "O plano foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("plans")
          .insert(planData);
        
        if (error) throw error;
        
        toast({
          title: "Plano criado",
          description: "O plano foi criado com sucesso.",
        });
      }

      setIsPlanDialogOpen(false);
      loadPlans();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar plano",
        description: error.message,
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return;

    try {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", planId);
      
      if (error) throw error;
      
      toast({
        title: "Plano excluído",
        description: "O plano foi excluído com sucesso.",
      });
      
      loadPlans();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir plano",
        description: error.message,
      });
    }
  };

  const grantAllPermissions = async (userId: string, businessId: string) => {
    try {
      console.log('Admin RPC: grant all permissions', { userId, businessId });
      const { error } = await supabase.rpc('admin_grant_all_permissions', {
        _target_user: userId,
        _business_id: businessId,
      });
      if (error) throw error;
      console.log('Permissões concedidas via RPC com sucesso!');
    } catch (error) {
      console.error('Erro em grantAllPermissions (RPC):', error);
      throw error;
    }
  };

  const updateApprovalStatus = async (profileId: string, approved: boolean) => {
    try {
      console.log('Atualizando status de aprovação:', { profileId, approved });
      
      if (!approved && profileId === user?.id) {
        toast({
          variant: "destructive",
          title: "Ação não permitida",
          description: "Você não pode revogar o seu próprio acesso.",
        });
        return;
      }
      
      const { error: rpcError } = await supabase.rpc('admin_set_user_approval', {
        _target_user: profileId,
        _approved: approved,
      });

      if (rpcError) {
        console.error('Erro em admin_set_user_approval (RPC):', rpcError);
        throw rpcError;
      }

      console.log('Aprovação atualizada via RPC com sucesso');

      if (approved) {
        toast({
          title: "✅ Usuário aprovado",
          description: "Acesso liberado com sucesso!",
        });
      } else {
        toast({
          title: "❌ Usuário rejeitado",
          description: "O usuário não poderá acessar o sistema.",
        });
      }

      loadProfiles();
    } catch (error: any) {
      console.error('Erro completo em updateApprovalStatus:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.message || 'Erro desconhecido',
      });
    }
  };

  const handleApproveAll = async () => {
    const pendingProfiles = profiles.filter(p => !p.approved);
    if (pendingProfiles.length === 0) {
      toast({
        title: "Nenhum cadastro pendente",
        description: "Todos os usuários já foram aprovados.",
      });
      return;
    }

    try {
      for (const profile of pendingProfiles) {
        const { error } = await supabase.rpc('admin_set_user_approval', {
          _target_user: profile.id,
          _approved: true
        });
        if (error) throw error;
      }

      toast({
        title: `✅ ${pendingProfiles.length} usuário(s) aprovado(s)`,
        description: "Todos os cadastros pendentes foram liberados!",
      });

      loadProfiles();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao aprovar usuários",
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Chamar RPC para excluir usuário
      const { error } = await supabase.rpc('admin_delete_user', {
        _target_user: userToDelete.id
      });

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema com sucesso.",
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadProfiles();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message || 'Erro desconhecido',
      });
    }
  };

  const handleShareNR = (nrNumber: string) => {
    setSelectedNR(nrNumber);
    setShareSheetOpen(true);
  };

  const handleWhatsAppShare = () => {
    const nr = nrExams.find(n => n.nrNumber === selectedNR);
    if (!nr) return;

    const baseUrl = window.location.origin;
    const publicUrl = `${baseUrl}/avaliacoes?nr=${selectedNR}`;
    const message = `🎓 Avaliação NR Disponível!\n\n📋 ${nr.nrNumber}\n🔢 ${nr.questions.length} questões\n\n✅ Faça a avaliação agora:\n${publicUrl}\n\nCompartilhado pelo Hub Negócio Fácil`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShareSheetOpen(false);
  };

  const handleEmailShare = () => {
    const nr = nrExams.find(n => n.nrNumber === selectedNR);
    if (!nr) return;

    const baseUrl = window.location.origin;
    const publicUrl = `${baseUrl}/avaliacoes?nr=${selectedNR}`;
    const subject = `Avaliação ${nr.nrNumber} - Hub Negócio Fácil`;
    const body = `Olá!\n\nCompartilho com você a avaliação ${nr.nrNumber} com ${nr.questions.length} questões.\n\nAcesse agora:\n${publicUrl}\n\nAtenciosamente,\nHub Negócio Fácil`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_self');
    setShareSheetOpen(false);
  };

  const handleDownloadPDF = () => {
    const nr = nrExams.find(n => n.nrNumber === selectedNR);
    if (!nr) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Avaliação ${nr.nrNumber}`, pageWidth / 2, 20, { align: "center" });
    
    // Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total de questões: ${nr.questions.length}`, 20, 35);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 42);
    
    // Questões
    let yPosition = 55;
    nr.questions.forEach((q, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const questionText = `${index + 1}. ${q.question}`;
      const questionLines = doc.splitTextToSize(questionText, pageWidth - 40);
      doc.text(questionLines, 20, yPosition);
      yPosition += questionLines.length * 7 + 5;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      q.options.forEach((opt, optIndex) => {
        const optionText = `${String.fromCharCode(97 + optIndex)}) ${opt}`;
        const optionLines = doc.splitTextToSize(optionText, pageWidth - 50);
        doc.text(optionLines, 30, yPosition);
        yPosition += optionLines.length * 6 + 2;
      });
      
      yPosition += 8;
    });
    
    doc.save(`Avaliacao-${nr.nrNumber}.pdf`);
    setShareSheetOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel administrativo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie aprovações de novos usuários, planos e conteúdo
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="gap-2">
              <Shield className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="plans" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-2">
              <Send className="h-4 w-4" />
              Avaliações NR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuários Cadastrados</CardTitle>
                    <CardDescription>
                      Gerencie o status de aprovação dos usuários
                      {profiles.filter(p => !p.approved).length > 0 && (
                        <span className="text-orange-500 font-semibold ml-2">
                          ({profiles.filter(p => !p.approved).length} pendente{profiles.filter(p => !p.approved).length > 1 ? 's' : ''})
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {profiles.filter(p => !p.approved).length > 0 && (
                    <Button 
                      onClick={handleApproveAll}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      Aprovar Todos ({profiles.filter(p => !p.approved).length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum usuário cadastrado ainda.
                    </p>
                  ) : (
                    profiles.map((profile) => (
                      <Card key={profile.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{profile.name || "Sem nome"}</h3>
                                {profile.approved && (
                                  <Badge variant="default" className="bg-green-500">
                                    Aprovado
                                  </Badge>
                                )}
                                {!profile.approved && (
                                  <Badge variant="secondary">
                                    Pendente
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{profile.email}</p>
                              <div className="flex gap-2 items-center">
                                <Badge variant="outline">
                                  Plano: {profile.plan}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Cadastrado em: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!profile.approved && (
                                <Button
                                  size="sm"
                                  onClick={() => updateApprovalStatus(profile.id, true)}
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Aprovar e Liberar Acesso
                                </Button>
                              )}
                              {profile.approved && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        const { error } = await supabase.rpc('admin_grant_full_access_all_businesses', { _target_user: profile.id });
                                        if (error) throw error;

                                        toast({
                                          title: "Permissões concedidas",
                                          description: "Todas as permissões foram concedidas ao usuário.",
                                        });
                                      } catch (error: any) {
                                        toast({
                                          variant: "destructive",
                                          title: "Erro",
                                          description: error.message,
                                        });
                                      }
                                    }}
                                    className="gap-2"
                                  >
                                    <Key className="h-4 w-4" />
                                    Liberar Acesso Completo
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateApprovalStatus(profile.id, false)}
                                    className="gap-2"
                                    disabled={profile.id === user?.id}
                                    title={profile.id === user?.id ? "Você não pode revogar seu próprio acesso." : undefined}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Revogar
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setUserToDelete(profile);
                                  setDeleteDialogOpen(true);
                                }}
                                className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                disabled={profile.id === user?.id}
                                title={profile.id === user?.id ? "Você não pode excluir sua própria conta." : "Excluir usuário permanentemente"}
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Planos e Preços</CardTitle>
                    <CardDescription>
                      Gerencie os planos disponíveis no sistema
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleOpenPlanDialog()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Plano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum plano cadastrado ainda.
                    </p>
                  ) : (
                    plans.map((plan) => (
                      <Card key={plan.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                <Badge variant={plan.is_active ? "default" : "secondary"}>
                                  {plan.is_active ? "Ativo" : "Inativo"}
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                R$ {plan.price.toFixed(2)}
                              </p>
                              {plan.description && (
                                <p className="text-sm text-muted-foreground">
                                  {plan.description}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenPlanDialog(plan)}
                                className="gap-2"
                              >
                                <Pencil className="h-4 w-4" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePlan(plan.id)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <VideoManagement />
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Avaliações NR</CardTitle>
                <CardDescription>
                  Compartilhe avaliações de segurança com terceiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {nrExams.sort((a, b) => {
                    const numA = parseInt(a.nrNumber.replace('NR-', ''));
                    const numB = parseInt(b.nrNumber.replace('NR-', ''));
                    return numA - numB;
                  }).map((exam) => (
                    <Card key={exam.nrNumber} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-primary">{exam.nrNumber}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {exam.questions.length} questões disponíveis
                            </p>
                          </div>
                          <Button
                            onClick={() => handleShareNR(exam.nrNumber)}
                            className="w-full gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            Compartilhar Avaliação
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet open={shareSheetOpen} onOpenChange={setShareSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Compartilhar Avaliação</SheetTitle>
              <SheetDescription>
                Escolha como deseja compartilhar a avaliação {selectedNR}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <Button
                onClick={handleWhatsAppShare}
                className="w-full gap-2"
                variant="outline"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar via WhatsApp
              </Button>
              <Button
                onClick={handleEmailShare}
                className="w-full gap-2"
                variant="outline"
              >
                <Mail className="h-4 w-4" />
                Compartilhar via Email
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="w-full gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Baixar PDF da Avaliação
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Dialog de Edição de Plano */}
        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Editar Plano" : "Novo Plano"}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Atualize as informações do plano"
                  : "Cadastre um novo plano no sistema"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, name: e.target.value })
                  }
                  placeholder="Ex: Profissional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={planForm.price}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, price: e.target.value })
                  }
                  placeholder="Ex: 99.90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={planForm.description}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, description: e.target.value })
                  }
                  placeholder="Descreva os recursos do plano"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPlanDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSavePlan}>
                {editingPlan ? "Salvar Alterações" : "Criar Plano"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmação para excluir usuário */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
                <br /><br />
                Esta ação é <strong>irreversível</strong> e irá remover:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Todos os dados do perfil</li>
                  <li>Todos os negócios criados pelo usuário</li>
                  <li>Todas as permissões associadas</li>
                  <li>O acesso à conta será permanentemente removido</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setUserToDelete(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
              >
                Sim, Excluir Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
