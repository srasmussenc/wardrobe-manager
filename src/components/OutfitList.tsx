import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Check, Save } from 'lucide-react';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { CLOTHING_TYPES } from '@/types/clothing';
import ClothingSelector from './ClothingSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

const OutfitList = () => {
  const navigate = useNavigate();
  const { clothes, outfits, addOutfit, deleteOutfit, setOutfitOfToday, getOutfitOfToday } = useWardrobeStore();
  
  // Outfit of today state
  const [isSelectingTodayOutfit, setIsSelectingTodayOutfit] = useState(false);
  const [selectedTodayClothingIds, setSelectedTodayClothingIds] = useState<string[]>([]);
  
  // Save outfit state
  const [isSavingOutfit, setIsSavingOutfit] = useState(false);
  const [selectedSaveClothingIds, setSelectedSaveClothingIds] = useState<string[]>([]);
  const [outfitName, setOutfitName] = useState('');

  const todaysOutfit = getOutfitOfToday();
  const todaysClothes = todaysOutfit
    ? clothes.filter((c) => todaysOutfit.clothingIds.includes(c.id))
    : [];

  const toggleTodayClothingSelection = (id: string) => {
    setSelectedTodayClothingIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const toggleSaveClothingSelection = (id: string) => {
    setSelectedSaveClothingIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleSaveOutfitOfToday = () => {
    if (selectedTodayClothingIds.length === 0) {
      toast.error('Selecciona al menos una prenda');
      return;
    }
    setOutfitOfToday(selectedTodayClothingIds);
    setIsSelectingTodayOutfit(false);
    setSelectedTodayClothingIds([]);
    toast.success('Outfit del día guardado');
  };

  const handleSaveOutfit = () => {
    if (selectedSaveClothingIds.length === 0) {
      toast.error('Selecciona al menos una prenda');
      return;
    }
    if (!outfitName.trim()) {
      toast.error('Escribe un nombre para el outfit');
      return;
    }
    addOutfit({
      name: outfitName.trim(),
      clothingIds: selectedSaveClothingIds,
    });
    setIsSavingOutfit(false);
    setSelectedSaveClothingIds([]);
    setOutfitName('');
    toast.success('Outfit guardado');
  };

  const handleDeleteOutfit = (id: string) => {
    deleteOutfit(id);
    toast.success('Outfit eliminado');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
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
          <h1 className="font-display text-xl font-medium">Outfits</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
        {/* Outfit of Today Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-medium">Outfit del día</h2>
            </div>
            <Sheet open={isSelectingTodayOutfit} onOpenChange={setIsSelectingTodayOutfit}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  {todaysOutfit ? 'Cambiar' : 'Añadir'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Selecciona tu outfit del día</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto h-[calc(100%-120px)]">
                  <ClothingSelector
                    clothes={clothes}
                    selectedIds={selectedTodayClothingIds}
                    onToggle={toggleTodayClothingSelection}
                    emptyMessage="No tienes ropa guardada"
                  />
                </div>
                {clothes.length > 0 && (
                  <div className="absolute bottom-6 left-4 right-4">
                    <Button
                      onClick={handleSaveOutfitOfToday}
                      className="w-full h-12"
                      disabled={selectedTodayClothingIds.length === 0}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Guardar outfit ({selectedTodayClothingIds.length} prendas)
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {todaysOutfit ? (
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-wardrobe">
              <p className="text-sm text-muted-foreground mb-3 capitalize">
                {formatDate(todaysOutfit.date)}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {todaysClothes.map((item) => {
                  const typeLabel =
                    CLOTHING_TYPES.find((t) => t.value === item.type)?.label || item.type;
                  return (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-20"
                    >
                      <div className="aspect-square rounded-xl bg-secondary overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={typeLabel}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            Sin foto
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 truncate">{typeLabel}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-6 border border-dashed border-border text-center">
              <p className="text-muted-foreground">
                No has registrado tu outfit de hoy
              </p>
            </div>
          )}
        </section>

        {/* Saved Outfits Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium">Outfits guardados</h2>
            <Sheet open={isSavingOutfit} onOpenChange={setIsSavingOutfit}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Save className="w-4 h-4" />
                  Guardar outfit
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Crear nuevo outfit</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Input
                    placeholder="Nombre del outfit (ej: Casual de verano)"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    className="h-12"
                  />
                  <div className="overflow-y-auto h-[calc(85vh-220px)]">
                    <ClothingSelector
                      clothes={clothes}
                      selectedIds={selectedSaveClothingIds}
                      onToggle={toggleSaveClothingSelection}
                      emptyMessage="No tienes ropa guardada"
                    />
                  </div>
                </div>
                {clothes.length > 0 && (
                  <div className="absolute bottom-6 left-4 right-4">
                    <Button
                      onClick={handleSaveOutfit}
                      className="w-full h-12"
                      disabled={selectedSaveClothingIds.length === 0 || !outfitName.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar outfit ({selectedSaveClothingIds.length} prendas)
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {outfits.length === 0 ? (
            <div className="bg-card rounded-2xl p-6 border border-dashed border-border text-center">
              <p className="text-muted-foreground">
                No tienes outfits guardados todavía
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {outfits.map((outfit) => {
                const outfitClothes = clothes.filter((c) =>
                  outfit.clothingIds.includes(c.id)
                );
                return (
                  <div
                    key={outfit.id}
                    className="bg-card rounded-2xl p-4 border border-border/50 shadow-wardrobe"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{outfit.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Eliminar
                      </Button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {outfitClothes.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-16">
                          <div className="aspect-square rounded-lg bg-secondary overflow-hidden">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OutfitList;
