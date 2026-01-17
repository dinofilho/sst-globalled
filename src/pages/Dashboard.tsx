import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { useClinicRole } from "@/hooks/useClinicRole";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Building2,
  ChevronDown,
  Stethoscope,
  Users,
  Calendar,
  FileText,
  HardHat,
  Shield,
  AlertTriangle,
  FileCheck,
  UserCog,
  Download,
  QrCode,
  Award,
  BookOpen,
  Home,
  ClipboardCheck,
  Trash2,
  Settings,
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { PWAController } from "@/components/PWAController";

const MedicalExamsModule = lazy(() => import("@/components/modules/MedicalExamsModule"));
const CompaniesModule = lazy(() => import("@/components/modules/CompaniesModule"));
const DoctorsModule = lazy(() => import("@/components/modules/DoctorsModule"));
const TeamManagement = lazy(() => import("@/components/modules/TeamManagement"));
const PermissionsModule = lazy(() => import("@/components/modules/PermissionsModule"));
const CalendarModule = lazy(() => import("@/components/modules/CalendarModule"));
const SSTProgramsModule = lazy(() => import("@/components/modules/SSTProgramsModule"));
const ReportsModule = lazy(() => import("@/components/modules/ReportsModule"));
const RisksModule = lazy(() => import("@/components/modules/RisksModule"));
const ASOModule = lazy(() => import("@/components/modules/ASOModule"));
const DocumentValidationsModule = lazy(() => import("@/components/modules/DocumentValidationsModule"));
const CertificatesModule = lazy(() => import("@/components/modules/CertificatesModule"));
const NRsModule = lazy(() => import("@/components/modules/NRsModule"));
const AssessmentsModule = lazy(() => import("@/components/modules/AssessmentsModule"));
const AccountSettings = lazy(() => import("@/components/modules/AccountSettings").then(m => ({ default: m.AccountSettings })));
import { MedicalStats } from "@/components/dashboard/MedicalStats";
import { ExamsChart } from "@/components/dashboard/ExamsChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { selectedBusiness, currentBusiness, businesses, selectBusiness, deleteBusiness, loading: businessLoading } = useBusiness();
  const { role, loading: roleLoading, isAdmin, isAtendente, isMedico } = useClinicRole(selectedBusiness);
  const { isAdmin: isSSTAdmin, loading: permissionsLoading } = usePermissions();
  const [activeTab, setActiveTab] = useState(
    currentBusiness?.type === 'sst' ? 'sst' : 
    currentBusiness?.type === 'nr' ? 'nrs' : 'exams'
  );
  const [stats, setStats] = useState({
    totalExams: 0,
    pendingExams: 0,
    completedExams: 0,
  });
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (businessLoading) return; // Aguarda carregar os negócios
    if (!businesses || businesses.length === 0) {
      navigate('/select-business');
    }
  }, [user, businessLoading, businesses, navigate]);

  useEffect(() => {
    const checkSystemAdmin = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        setIsSystemAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkSystemAdmin();
  }, [user]);

  useEffect(() => {
    if (currentBusiness?.type === 'sst') {
      setActiveTab('sst');
    } else if (currentBusiness?.type === 'nr') {
      setActiveTab('nrs');
    } else {
      setActiveTab('exams');
    }
  }, [currentBusiness]);

  useEffect(() => {
    const loadStats = async () => {
      if (!selectedBusiness || currentBusiness?.type !== 'medical') return;

      try {
        const { data: exams } = await supabase
          .from('medical_exams')
          .select('status')
          .eq('business_id', selectedBusiness);

        if (exams) {
          setStats({
            totalExams: exams.length,
            pendingExams: exams.filter(e => e.status === 'agendado').length,
            completedExams: exams.filter(e => e.status === 'realizado').length,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [selectedBusiness, currentBusiness]);

  const handleDownloadBackup = async () => {
    if (!currentBusiness) return;

    try {
      // Fetch all data from the business
      const tables = [
        'cash_flows',
        'products',
        'employees',
        'companies',
        'doctors',
        'medical_exams',
        'notifications',
        'calendar_events',
        'aso',
        'epi',
        'ppp',
        'harmful_agents',
        'risks',
        'nrs'
      ];

      const backup: Record<string, any> = {
        version: '2.1.3',
        business_id: currentBusiness.id,
        business_name: currentBusiness.name,
        exported_at: new Date().toISOString(),
        data: {}
      };

      for (const tableName of tables) {
        const { data, error } = await supabase
          .from(tableName as any)
          .select('*')
          .eq('business_id', currentBusiness.id) as any;

        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
          continue;
        }

        (backup.data as any)[tableName] = data || [];
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${currentBusiness.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado",
        description: "O backup dos dados foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar backup dos dados.",
        variant: "destructive",
      });
    }
  };

  const getRoleLabel = () => {
    if (currentBusiness?.type === 'sst') {
      return isSSTAdmin ? "Administrador" : "Membro";
    }
    if (currentBusiness?.type === 'nr') {
      return currentBusiness.user_id === user?.id ? "Proprietário" : "Membro";
    }
    
    const roles: Record<string, string> = {
      admin: "Administrador",
      atendente: "Atendente",
      medico: "Médico",
    };
    return roles[role || ''] || "Sem permissão";
  };

  const getRoleBadgeVariant = () => {
    if (currentBusiness?.type === 'sst') {
      return isSSTAdmin ? 'default' : 'secondary';
    }
    if (currentBusiness?.type === 'nr') {
      return currentBusiness.user_id === user?.id ? 'default' : 'secondary';
    }
    
    switch (role) {
      case 'admin': return 'default';
      case 'medico': return 'secondary';
      case 'atendente': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 px-2">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold truncate max-w-[100px]">
                    {currentBusiness?.name || "Selecione"}
                  </span>
                  <ChevronDown className="w-3 h-3 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px] max-h-[400px] overflow-y-auto">
                {businesses.map((business) => (
                  <DropdownMenuItem
                    key={business.id}
                    onClick={() => selectBusiness(business.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className={`w-4 h-4 ${business.id === currentBusiness?.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex flex-col">
                      <p className={`font-medium ${business.id === currentBusiness?.id ? 'text-primary' : ''}`}>
                        {business.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {business.type === 'sst' ? 'SST' : business.type === 'nr' ? 'Treinamento NR' : 'Consultório Médico'}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/select-business")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">+ Novo Negócio</span>
                </DropdownMenuItem>
                {currentBusiness && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Excluir Empresa Atual</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Voltar para página inicial"
              >
                <Home className="h-4 w-4" />
              </Button>
              <PWAController />
              <Button
                onClick={handleDownloadBackup}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Fazer backup"
              >
                <Download className="h-4 w-4" />
              </Button>
              <NotificationBell />
              {isSystemAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="h-8 w-8 p-0"
                  title="Admin"
                >
                  <UserCog className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="w-5 h-5" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm font-bold truncate max-w-[200px]">
                        {currentBusiness?.name || "Selecione"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {currentBusiness?.type === 'sst' ? 'SST' : currentBusiness?.type === 'nr' ? 'Treinamento NR' : 'Consultório Médico'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[250px] max-h-[400px] overflow-y-auto">
                  {businesses.map((business) => (
                    <DropdownMenuItem
                      key={business.id}
                      onClick={() => selectBusiness(business.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className={`w-4 h-4 ${business.id === currentBusiness?.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex flex-col">
                        <p className={`font-medium ${business.id === currentBusiness?.id ? 'text-primary' : ''}`}>
                          {business.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {business.type === 'sst' ? 'SST' : business.type === 'nr' ? 'Treinamento NR' : 'Consultório Médico'}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/select-business")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-medium text-primary">+ Novo Negócio</span>
                  </DropdownMenuItem>
                  {currentBusiness && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">Excluir Empresa Atual</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold truncate">
                  {currentBusiness?.type === 'sst' 
                    ? 'SST - Gestão em Saúde e Segurança no Trabalho' 
                    : currentBusiness?.type === 'nr'
                      ? 'Treinamento de NR - Normas Regulamentadoras'
                      : 'Consultório Médico Ocupacional'}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  {!(currentBusiness?.type === 'sst' ? permissionsLoading : roleLoading) && (
                    <Badge variant={getRoleBadgeVariant()}>
                      {getRoleLabel()}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                    v2.1.3
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="sm"
                className="gap-2"
                title="Voltar para página inicial"
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Button>
              <PWAController />
              <Button
                onClick={handleDownloadBackup}
                variant="outline"
                size="sm"
                className="gap-2"
                title="Fazer backup"
              >
                <Download className="h-4 w-4" />
                <span>Backup</span>
              </Button>
              <NotificationBell />
              {isSystemAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <UserCog className="h-5 w-5" />
                  <span>Admin</span>
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Professional Stats Dashboard */}
        {selectedBusiness && currentBusiness?.type === 'medical' && (
          <>
            <MedicalStats businessId={selectedBusiness} />
            <ExamsChart businessId={selectedBusiness} />
          </>
        )}
        
        {/* Legacy Stats Cards - Only for medical */}
        {currentBusiness?.type === 'medical' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Exames
                </CardTitle>
                <Stethoscope className="w-8 h-8 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalExams}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Exames Pendentes
                </CardTitle>
                <Calendar className="w-8 h-8 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.pendingExams}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Exames Realizados
                </CardTitle>
                <FileText className="w-8 h-8 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.completedExams}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full flex-wrap gap-1 justify-start overflow-x-auto">
            {currentBusiness?.type === 'medical' ? (
              <>
                <TabsTrigger value="exams" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Exames
                </TabsTrigger>
                <TabsTrigger value="companies" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Empresas
                </TabsTrigger>
                <TabsTrigger value="doctors" className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Médicos
                </TabsTrigger>
                <TabsTrigger value="risks" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Riscos
                </TabsTrigger>
                <TabsTrigger value="aso" className="gap-2">
                  <FileCheck className="w-4 h-4" />
                  ASO
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Agenda
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Relatórios
                </TabsTrigger>
                <TabsTrigger value="validations" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Validações
                </TabsTrigger>
              </>
            ) : currentBusiness?.type === 'nr' ? (
              <>
                <TabsTrigger value="nrs" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  NRs
                </TabsTrigger>
                <TabsTrigger value="assessments" className="gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Avaliações
                </TabsTrigger>
                <TabsTrigger value="certificates" className="gap-2">
                  <Award className="w-4 h-4" />
                  Certificados
                </TabsTrigger>
                <TabsTrigger value="validations" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Validações
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="sst" className="gap-2">
                  <HardHat className="w-4 h-4" />
                  SST
                </TabsTrigger>
                <TabsTrigger value="nrs" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  NRs
                </TabsTrigger>
                <TabsTrigger value="assessments" className="gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Avaliações
                </TabsTrigger>
                <TabsTrigger value="companies" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Empresas
                </TabsTrigger>
                <TabsTrigger value="risks" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Riscos
                </TabsTrigger>
                <TabsTrigger value="aso" className="gap-2">
                  <FileCheck className="w-4 h-4" />
                  ASO
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Agenda
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Relatórios
                </TabsTrigger>
                <TabsTrigger value="validations" className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Validações
                </TabsTrigger>
                {isSSTAdmin && (
                  <TabsTrigger value="certificates" className="gap-2">
                    <Award className="w-4 h-4" />
                    Certificados NR
                  </TabsTrigger>
                )}
              </>
            )}
            {/* Aba Equipe visível para todos, com restrições internas */}
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 w-4" />
              Equipe
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="permissions" className="gap-2">
                <Shield className="w-4 h-4" />
                Permissões
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Minha Conta
            </TabsTrigger>
          </TabsList>

          <Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
            {currentBusiness?.type === 'medical' ? (
              <>
                <TabsContent value="exams" className="space-y-4">
                  <MedicalExamsModule />
                </TabsContent>

                <TabsContent value="companies" className="space-y-4">
                  <CompaniesModule />
                </TabsContent>

                <TabsContent value="doctors" className="space-y-4">
                  <DoctorsModule />
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <RisksModule />
                </TabsContent>

                <TabsContent value="aso" className="space-y-4">
                  <ASOModule />
                </TabsContent>

                <TabsContent value="calendar" className="space-y-4">
                  <CalendarModule />
                </TabsContent>
                
                <TabsContent value="reports" className="space-y-4">
                  <ReportsModule />
                </TabsContent>

                <TabsContent value="validations" className="space-y-4">
                  <DocumentValidationsModule />
                </TabsContent>
              </>
            ) : currentBusiness?.type === 'nr' ? (
              <>
                <TabsContent value="nrs" className="space-y-4">
                  <NRsModule />
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                  <AssessmentsModule />
                </TabsContent>

                <TabsContent value="certificates" className="space-y-4">
                  <CertificatesModule />
                </TabsContent>

                <TabsContent value="validations" className="space-y-4">
                  <DocumentValidationsModule />
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="sst" className="space-y-4">
                  <SSTProgramsModule />
                </TabsContent>

                <TabsContent value="companies" className="space-y-4">
                  <CompaniesModule />
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <RisksModule />
                </TabsContent>

                <TabsContent value="aso" className="space-y-4">
                  <ASOModule />
                </TabsContent>

                <TabsContent value="calendar" className="space-y-4">
                  <CalendarModule />
                </TabsContent>
                
                <TabsContent value="reports" className="space-y-4">
                  <ReportsModule />
                </TabsContent>

                <TabsContent value="validations" className="space-y-4">
                  <DocumentValidationsModule />
                </TabsContent>

                {isSSTAdmin && (
                  <TabsContent value="certificates" className="space-y-4">
                    <CertificatesModule />
                  </TabsContent>
                )}

                <TabsContent value="nrs" className="space-y-4">
                  <NRsModule />
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                  <AssessmentsModule />
                </TabsContent>
              </>
            )}

            {/* Aba Equipe visível para todos, mas com restrições de gestão */}
            {selectedBusiness && (
              <TabsContent value="team" className="space-y-4">
                <TeamManagement businessId={selectedBusiness} />
              </TabsContent>
            )}

            {isAdmin && selectedBusiness && (
              <TabsContent value="permissions" className="space-y-4">
                <PermissionsModule />
              </TabsContent>
            )}

            <TabsContent value="settings" className="space-y-4">
              <AccountSettings />
            </TabsContent>
          </Suspense>
        </Tabs>
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa "{currentBusiness?.name}"? 
              Esta ação não pode ser desfeita e todos os dados relacionados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (currentBusiness) {
                  try {
                    await deleteBusiness(currentBusiness.id);
                    setShowDeleteDialog(false);
                  } catch (error) {
                    console.error("Erro ao excluir empresa:", error);
                  }
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
