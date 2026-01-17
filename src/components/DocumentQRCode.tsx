import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentQRCodeProps {
  validationCode: string;
  documentName: string;
  issuedDate: string;
}

export const DocumentQRCode = ({ validationCode, documentName, issuedDate }: DocumentQRCodeProps) => {
  const [showQR, setShowQR] = useState(false);
  const envUrl = (import.meta as any).env?.VITE_PUBLIC_BASE_URL?.replace(/\/$/, '');
  const baseUrl = envUrl && !envUrl.includes('lovable.dev') ? envUrl : window.location.origin;
  const validationUrl = `${baseUrl}/validate-doc/${validationCode}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${validationCode}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${validationCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQR(true)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver QR Code
        </Button>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code de Validação</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{documentName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Emitido em: {new Date(issuedDate).toLocaleDateString('pt-BR')}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  id={`qr-${validationCode}`}
                  value={validationUrl}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Código de Validação:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {validationCode}
                </code>
              </div>
              <Button onClick={downloadQR} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar QR Code
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};
