import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <Smartphone className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-semibold text-foreground">Instalar Mi Armario</h1>
          <p className="text-muted-foreground mt-2">
            Instala la app en tu dispositivo para acceder rápidamente
          </p>
        </div>

        {isInstalled ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 text-center">
              <Check className="w-12 h-12 mx-auto text-primary mb-4" />
              <p className="text-lg font-medium text-foreground">¡App instalada!</p>
              <p className="text-muted-foreground mt-2">
                Ya puedes usar Mi Armario desde tu pantalla de inicio
              </p>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instalación en iPhone/iPad</CardTitle>
              <CardDescription>
                Sigue estos pasos para instalar la app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                  1
                </div>
                <p className="text-sm text-foreground">
                  Toca el botón <strong>Compartir</strong> en Safari (el ícono de cuadrado con flecha)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                  2
                </div>
                <p className="text-sm text-foreground">
                  Desliza hacia abajo y toca <strong>"Añadir a pantalla de inicio"</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                  3
                </div>
                <p className="text-sm text-foreground">
                  Toca <strong>"Añadir"</strong> para confirmar
                </p>
              </div>
            </CardContent>
          </Card>
        ) : deferredPrompt ? (
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleInstall} className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Instalar App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                Abre esta página en Chrome o Safari para instalar la app
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>✓ Funciona sin conexión</p>
          <p>✓ Acceso rápido desde tu pantalla</p>
          <p>✓ Sin necesidad de tiendas de apps</p>
        </div>
      </div>
    </div>
  );
};

export default Install;
