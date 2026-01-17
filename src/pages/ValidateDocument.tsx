import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, FileText, Calendar, Shield, Home } from 'lucide-react';
import { useDocumentValidation, DocumentValidation } from '@/hooks/useDocumentValidation';
import { Skeleton } from '@/components/ui/skeleton';

const ValidateDocument = () => {
  const { code } = useParams<{ code: string }>();
  const [validation, setValidation] = useState<DocumentValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const { getValidationByCode } = useDocumentValidation();

  useEffect(() => {
    const loadValidation = async () => {
      if (!code) return;
      
      setLoading(true);
      const data = await getValidationByCode(code);
      setValidation(data);
      setLoading(false);
    };

    loadValidation();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!validation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Documento Não Encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              O código de validação fornecido não foi encontrado em nosso sistema.
            </p>
            <p className="text-sm text-muted-foreground">
              Código: <code className="bg-muted px-2 py-1 rounded">{code}</code>
            </p>
            <Link to="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isValid = validation.is_valid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isValid ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isValid ? 'Documento Válido' : 'Documento Inválido'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Nome do Documento</p>
                <p className="text-base font-semibold">{validation.document_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                <p className="text-base font-semibold">
                  {new Date(validation.issued_date).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Código de Validação</p>
                <code className="text-sm bg-background px-2 py-1 rounded inline-block mt-1">
                  {validation.validation_code}
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Tipo de Documento</p>
                <p className="text-base font-semibold">
                  {validation.document_type?.toLowerCase() === 'aso' 
                    ? 'ASO - ATESTADO DE SAÚDE OCUPACIONAL' 
                    : validation.document_type}
                </p>
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium">
                Este documento foi invalidado e não possui mais validade legal.
              </p>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>Sistema de Validação de Documentos</p>
            <p>Negócio Fácil © {new Date().getFullYear()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidateDocument;
