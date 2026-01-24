import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Check } from 'lucide-react';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { CLOTHING_TYPES } from '@/types/clothing';
import ClothingCard from './ClothingCard';
import { Button } from '@/components/ui/button';
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
  const { clothes, outfits, setOutfitOfToday, getOutfitOfToday } = useWardrobeStore();
  const [isSelectingOutfit, setIsSelectingOutfit] = useState(false);
  const [selectedClothingIds, setSelectedClothingIds] = useState<string[]>([]);

  const todaysOutfit = getOutfitOfToday();
  const todaysClothes = todaysOutfit
    ? clothes.filter((c) => todaysOutfit.clothingIds.includes(c.id))
    : [];

  const toggleClothingSelection = (id: string) => {
    setSelectedClothingIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleSaveOutfitOfToday = () => {
    if (selectedClothingIds.length === 0) {
      toast.error('Selecciona al menos una prenda');
      return;
    }
    setOutfitOfToday(selectedClothingIds);
    setIsSelectingOutfit(false);
    setSelectedClothingIds([]);
    toast.success('Outfit del día guardado');
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
            <Sheet open={isSelectingOutfit} onOpenChange={setIsSelectingOutfit}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  {todaysOutfit ? 'Cambiar' : 'Añadir'}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Selecciona tu outfit</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto h-[calc(100%-120px)]">
                  {clothes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No tienes ropa guardada</p>
                      <Button onClick={() => navigate('/subir')} className="mt-4">
                        Subir tu primera prenda
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {clothes.map((item) => (
                        <ClothingCard
                          key={item.id}
                          clothing={item}
                          selected={selectedClothingIds.includes(item.id)}
                          selectable
                          onClick={() => toggleClothingSelection(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {clothes.length > 0 && (
                  <div className="absolute bottom-6 left-4 right-4">
                    <Button
                      onClick={handleSaveOutfitOfToday}
                      className="w-full h-12"
                      disabled={selectedClothingIds.length === 0}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Guardar outfit ({selectedClothingIds.length} prendas)
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
          <h2 className="font-display text-lg font-medium mb-4">Outfits guardados</h2>
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
                    <h3 className="font-medium mb-2">{outfit.name}</h3>
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
