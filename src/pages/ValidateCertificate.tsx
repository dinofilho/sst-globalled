import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Award, Calendar, Shield, Home, User, FileText } from 'lucide-react';
import { useCertificateValidation, CertificateValidation } from '@/hooks/useCertificateValidation';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ValidateCertificate = () => {
  const { code } = useParams<{ code: string }>();
  const [certificate, setCertificate] = useState<CertificateValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const { getValidationByCode } = useCertificateValidation();

  useEffect(() => {
    const loadCertificate = async () => {
      if (!code) return;
      
      setLoading(true);
      const data = await getValidationByCode(code);
      setCertificate(data);
      setLoading(false);
    };

    loadCertificate();
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

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Certificado Não Encontrado</CardTitle>
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

  const isValid = certificate.is_valid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isValid ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isValid ? 'Certificado Válido' : 'Certificado Inválido'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 mt-0.5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Treinamento</p>
                <p className="text-base font-semibold">
                  {certificate.nr_number} - {certificate.nr_title}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Aluno</p>
                <p className="text-base font-semibold">{certificate.student_name}</p>
                <p className="text-sm text-muted-foreground">CPF: {certificate.student_cpf}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Aproveitamento</p>
                <p className="text-base font-semibold">{certificate.exam_score}%</p>
                <p className="text-sm text-muted-foreground">
                  Exame realizado em {format(new Date(certificate.exam_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Técnico Responsável</p>
                <p className="text-base font-semibold">{certificate.issuer_name}</p>
                {certificate.issuer_crea && (
                  <>
                    <p className="text-sm text-muted-foreground">Engenheiro de Segurança do Trabalho</p>
                    <p className="text-sm text-muted-foreground">CREA: {certificate.issuer_crea}</p>
                  </>
                )}
                {certificate.issuer_cft_eletrotecnico && (
                  <p className="text-sm text-muted-foreground">CFT Eletrotécnica: {certificate.issuer_cft_eletrotecnico}</p>
                )}
                {certificate.issuer_cft_mecanico && (
                  <p className="text-sm text-muted-foreground">CFT Mecânica: {certificate.issuer_cft_mecanico}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                <p className="text-base font-semibold">
                  {format(new Date(certificate.issue_date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Código de Validação</p>
                <code className="text-sm bg-background px-2 py-1 rounded inline-block mt-1">
                  {certificate.validation_code}
                </code>
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium">
                Este certificado foi invalidado e não possui mais validade legal.
              </p>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground pt-6">
            <p>Sistema de Validação de Certificados</p>
            <p>Hub Negócio Fácil © {new Date().getFullYear()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidateCertificate;
