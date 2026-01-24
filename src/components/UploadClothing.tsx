import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Sparkles } from 'lucide-react';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { ClothingType, CLOTHING_TYPES, COLORS, SIZES } from '@/types/clothing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const UploadClothing = () => {
  const navigate = useNavigate();
  const { addClothing } = useWardrobeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [type, setType] = useState<ClothingType>('camiseta');
  const [color, setColor] = useState<string>('');
  const [size, setSize] = useState<string>('M');
  const [width, setWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        // Simulate AI analysis
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis - in production, this would call an AI service
    setTimeout(() => {
      // Random suggestions for demo
      const suggestedColors = ['negro', 'blanco', 'azul', 'gris'];
      const suggestedTypes: ClothingType[] = ['camiseta', 'camisa', 'pantalon', 'sudadera'];
      
      setColor(suggestedColors[Math.floor(Math.random() * suggestedColors.length)]);
      setType(suggestedTypes[Math.floor(Math.random() * suggestedTypes.length)]);
      setIsAnalyzing(false);
      setAiSuggested(true);
      toast.success('IA ha detectado color y tipo');
    }, 1500);
  };

  const handleSubmit = () => {
    if (!imageUrl) {
      toast.error('Por favor, sube una foto');
      return;
    }
    if (!color) {
      toast.error('Por favor, selecciona un color');
      return;
    }

    addClothing({
      imageUrl,
      type,
      color,
      size,
      width: width || undefined,
      length: length || undefined,
      brand,
    });

    toast.success('Prenda añadida');
    navigate('/ropa');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-xl font-medium">Subir ropa</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
        <div className="space-y-6">
          {/* Image Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative bg-card rounded-2xl overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors"
          >
            {imageUrl ? (
              <div className="aspect-square">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Analizando con IA...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Toca para subir foto</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {aiSuggested && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-primary">
                Color y tipo detectados por IA. Puedes editarlos si lo deseas.
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4 bg-card rounded-2xl p-4 border border-border/50">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Tipo de prenda *
              </label>
              <Select value={type} onValueChange={(v) => setType(v as ClothingType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLOTHING_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Color *</label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Talla</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Marca</label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nombre de la marca"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Ancho (cm)</label>
                <Input
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Ej: 50"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Largo (cm)</label>
                <Input
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Ej: 70"
                  type="number"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full h-12 text-base">
            Guardar prenda
          </Button>
        </div>
      </main>
    </div>
  );
};

export default UploadClothing;
