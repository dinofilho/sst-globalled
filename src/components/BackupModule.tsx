import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Database, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "@/hooks/useBusiness";
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

export const BackupModule = () => {
  const { currentBusiness } = useBusiness();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const exportBackup = async () => {
    if (!currentBusiness?.id) {
      toast({
        title: "Erro",
        description: "Nenhum negócio selecionado",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all data tables
      const tables = [
        "cash_flows",
        "products",
        "employees",
        "medical_exams",
        "epis",
        "nrs",
        "risk_assessments",
        "sst_programs",
        "ppp_records",
        "esocial_events",
        "events",
        "notifications",
      ] as const;

      const backupData: any = {
        version: "1.0",
        business: currentBusiness,
        exported_at: new Date().toISOString(),
        data: {} as Record<string, any[]>,
      };

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table as any)
          .select("*")
          .eq("business_id", currentBusiness.id);

        if (error) {
          console.error(`Error fetching ${table}:`, error);
          continue;
        }

        backupData.data[table] = data || [];
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_${currentBusiness.name}_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado com sucesso!",
        description: "Seus dados foram exportados.",
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      toast({
        title: "Erro ao criar backup",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
  };

  const importBackup = async () => {
    if (!importFile || !currentBusiness?.id) return;

    setIsImporting(true);
    setShowImportDialog(false);

    try {
      const fileContent = await importFile.text();
      const backupData = JSON.parse(fileContent);

      if (!backupData.version || !backupData.data) {
        throw new Error("Formato de backup inválido");
      }

      // Import data to each table
      const tableEntries = Object.entries(backupData.data);
      
      for (const [table, records] of tableEntries) {
        const recordsArray = records as any[];
        if (!recordsArray || recordsArray.length === 0) continue;

        // Update business_id to current business
        const recordsWithNewBusiness = recordsArray.map((record: any) => {
          const { id, created_at, updated_at, ...rest } = record;
          return {
            ...rest,
            business_id: currentBusiness.id,
          };
        });

        const { error } = await supabase.from(table as any).insert(recordsWithNewBusiness);

        if (error) {
          console.error(`Error importing to ${table}:`, error);
        }
      }

      toast({
        title: "Backup restaurado com sucesso!",
        description: "Seus dados foram importados.",
      });

      // Reload page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error importing backup:", error);
      toast({
        title: "Erro ao restaurar backup",
        description: "Não foi possível importar os dados. Verifique se o arquivo está correto.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportFile(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Restauração
          </CardTitle>
          <CardDescription>
            Faça backup dos seus dados e restaure quando necessário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Exportar Backup</CardTitle>
                <CardDescription>
                  Crie uma cópia de segurança de todos os seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={exportBackup}
                  disabled={isExporting}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exportando..." : "Baixar Backup"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Importar Backup</CardTitle>
                <CardDescription>
                  Restaure seus dados de um backup anterior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label htmlFor="backup-file">
                  <Button
                    disabled={isImporting}
                    className="w-full"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {isImporting ? "Importando..." : "Selecionar Arquivo"}
                    </span>
                  </Button>
                </label>
                <input
                  id="backup-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Importante sobre backups
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1">
                <li>Faça backups regularmente para não perder informações</li>
                <li>Guarde seus arquivos de backup em local seguro</li>
                <li>Ao importar, os dados serão adicionados ao negócio atual</li>
                <li>Recomendamos fazer backup antes de importar novos dados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Importação de Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá importar os dados do arquivo de backup selecionado para o negócio atual.
              Recomendamos fazer um backup dos dados atuais antes de continuar.
              <br /><br />
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImportFile(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={importBackup}>
              Importar Dados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
