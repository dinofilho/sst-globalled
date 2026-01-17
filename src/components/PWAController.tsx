import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Wifi, WifiOff, Monitor, Info } from "lucide-react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PWAController() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success("App instalado com sucesso!");
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Modo Online ativado");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info("Modo Offline - Dados serão sincronizados quando voltar online");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("App já instalado ou instalação não disponível neste navegador");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast.success("Instalação iniciada!");
    } else {
      toast.info("Instalação cancelada");
    }

    setDeferredPrompt(null);
  };

  const toggleOnlineMode = () => {
    // This is just a visual indicator
    // The actual online/offline is controlled by the browser
    toast.info(
      isOnline
        ? "Você está online. Vá para um local sem internet para testar o modo offline."
        : "Você está offline. Os dados serão sincronizados quando voltar online."
    );
  };

  useEffect(() => {
    if (needRefresh) {
      toast.info("Nova versão disponível! Atualizando...", {
        action: {
          label: "Atualizar",
          onClick: () => updateServiceWorker(true),
        },
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return (
    <div className="flex items-center gap-2">
      {!isInstalled && (
        <>
          {deferredPrompt && (
            <Button
              onClick={handleInstallClick}
              variant="default"
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Monitor className="h-4 w-4" />
              Instalar no PC
            </Button>
          )}
          
          <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Como Instalar o App no PC
                </DialogTitle>
                <DialogDescription>
                  Instale o aplicativo no seu computador para usar offline e ter acesso rápido
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Depois de instalado, o app funcionará offline e aparecerá como um programa normal no seu computador!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                      Google Chrome ou Microsoft Edge
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
                      <li>Clique no ícone de <strong>"Instalar"</strong> na barra de endereço (ao lado da URL)</li>
                      <li>Ou clique nos 3 pontos (menu) → <strong>"Instalar Negócio Fácil"</strong></li>
                      <li>Confirme clicando em <strong>"Instalar"</strong></li>
                      <li>O app será instalado e abrirá em uma janela separada</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                      Usando o Botão de Instalação
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
                      <li>Se você vir o botão <strong>"Instalar no PC"</strong> acima, basta clicar nele</li>
                      <li>Uma janela popup aparecerá para confirmar a instalação</li>
                      <li>Clique em <strong>"Instalar"</strong> e pronto!</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                      Depois da Instalação
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-muted-foreground">
                      <li>O app aparecerá no menu Iniciar do Windows ou Launchpad do Mac</li>
                      <li>Você pode fixar o app na barra de tarefas para acesso rápido</li>
                      <li>O app funcionará mesmo sem internet (modo offline)</li>
                      <li>Seus dados serão sincronizados automaticamente quando voltar online</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Nota:</strong> A instalação ocupa muito pouco espaço no seu disco e você pode desinstalar a qualquer momento através das configurações do navegador.
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <Button
        onClick={toggleOnlineMode}
        variant={isOnline ? "default" : "secondary"}
        size="sm"
        className="gap-2"
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Offline
          </>
        )}
      </Button>
    </div>
  );
}
