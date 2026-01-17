import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NRExam } from "@/components/modules/NRExam";
import { NRStudy } from "@/components/modules/NRStudy";
import { getNRContentNormalized, getNRExamNormalized, normalizeNRNumber } from "@/lib/nr-data";
import { ClipboardCheck, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PublicAssessment() {
  const [searchParams] = useSearchParams();

  // Lê o parâmetro "nr" de forma case-insensível e normaliza para o formato "NR-<n>"
  const getNrParam = () => {
    let value = searchParams.get("nr");
    if (!value) {
      for (const [k, v] of Array.from(searchParams.entries())) {
        if (k.toLowerCase() === "nr") {
          value = v;
          break;
        }
      }
    }
    return value;
  };

  const normalizeNr = (value: string | null): string | null => {
    if (!value) return null;
    const str = decodeURIComponent(value).trim().toUpperCase();
    // Suporta formatos: "NR-06", "NR06", "6", "NR 6"
    const match = str.match(/NR[-\s]?(\d+)$|^(\d+)$/);
    const digits = match ? (match[1] || match[2]) : str.replace(/[^0-9]/g, "");
    if (!digits) return null;
    const n = parseInt(digits, 10);
    if (Number.isNaN(n)) return null;
    return `NR-${n}`;
  };

  const nrNumber = normalizeNr(getNrParam());
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{ number: string; title: string } | null>(null);
  const [studyDialogOpen, setStudyDialogOpen] = useState(false);

  const { toast } = useToast();

  const getPublicLink = () => {
    const url = new URL(window.location.href);
    let host = url.hostname;
    if (host.includes(".lovable.app")) {
      host = host.replace("id-preview--", "").replace(".lovable.app", ".lovableproject.com");
    }
    return `${url.protocol}//${host}${url.pathname}${url.search}`;
  };

  const handleCopyPublicLink = async () => {
    try {
      const link = getPublicLink();
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link público copiado",
        description: "Compartilhe este link para que qualquer pessoa acesse a avaliação.",
      });
    } catch {}
  };

  // Redireciona links de pré-visualização (id-preview--) para o domínio público acessível
  useEffect(() => {
    const host = window.location.hostname;
    if (host.startsWith("id-preview--") && host.endsWith(".lovable.app")) {
      const targetHost = host.replace("id-preview--", "").replace(".lovable.app", ".lovableproject.com");
      const newUrl = `${window.location.protocol}//${targetHost}${window.location.pathname}${window.location.search}`;
      window.location.replace(newUrl);
    }
  }, []);

  useEffect(() => {
    if (nrNumber) {
      console.log("🔍 Buscando avaliação para:", nrNumber);
      const normalizedNr = normalizeNRNumber(nrNumber);
      console.log("📝 NR normalizado:", normalizedNr);
      
      const content = getNRContentNormalized(nrNumber);
      const exam = getNRExamNormalized(nrNumber);
      
      console.log("📚 Conteúdo encontrado:", !!content);
      console.log("✍️ Exame encontrado:", !!exam);
      
      if (exam && content) {
        setSelectedExam({
          number: normalizedNr,
          title: content.title
        });
        setExamDialogOpen(true);
        console.log("✅ Abrindo dialog de avaliação");
      } else {
        console.error("❌ Avaliação não encontrada - Conteúdo:", !!content, "Exame:", !!exam);
      }
    }
  }, [nrNumber]);

  const nrExam = nrNumber ? getNRExamNormalized(nrNumber) : null;

  if (!nrNumber || !nrExam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Avaliação não encontrada</h1>
            <p className="text-muted-foreground">
              O link da avaliação é inválido ou expirou. Por favor, solicite um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Avaliação {nrExam.nrNumber}</h1>
              <p className="text-muted-foreground mt-1">
                {nrExam.questions.length} questões disponíveis
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyPublicLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar link público
              </Button>
              <Button variant="outline" onClick={() => setStudyDialogOpen(true)}>
                Estudar conteúdo
              </Button>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setExamDialogOpen(true)}
          >
            <ClipboardCheck className="mr-2 h-5 w-5" />
            Iniciar Avaliação
          </Button>
        </Card>
        <NRExam
          open={examDialogOpen}
          onOpenChange={setExamDialogOpen}
          nrExam={nrExam}
          nrNumber={selectedExam?.number || ""}
          nrTitle={selectedExam?.title || ""}
        />
        <NRStudy
          open={studyDialogOpen}
          onOpenChange={setStudyDialogOpen}
          nrContent={getNRContentNormalized(selectedExam?.number || "") || null}
        />
      </div>
    </div>
  );
}
