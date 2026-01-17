import { ReactNode } from "react";
import { usePermissions, ModuleName, PermissionAction } from "@/hooks/usePermissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface PermissionGuardProps {
  module: ModuleName;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
  showAlert?: boolean;
}

/**
 * Componente que controla acesso baseado em permissões
 * Só renderiza children se o usuário tiver a permissão necessária
 */
export const PermissionGuard = ({
  module,
  action,
  children,
  fallback,
  showAlert = true
}: PermissionGuardProps) => {
  const { hasPermission, loading, isAdmin } = usePermissions();

  if (loading) {
    return null;
  }

  const hasAccess = hasPermission(module, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAlert) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para {getActionLabel(action)} neste módulo.
            Entre em contato com um administrador para solicitar acesso.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
};

/**
 * Versão inline do PermissionGuard que retorna boolean
 * Útil para condicionais inline
 */
export const usePermissionCheck = (module: ModuleName, action: PermissionAction): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(module, action);
};

const getActionLabel = (action: PermissionAction): string => {
  const labels: Record<PermissionAction, string> = {
    view: 'visualizar',
    create: 'criar',
    update: 'editar',
    delete: 'excluir',
    manage: 'gerenciar'
  };
  return labels[action] || action;
};
