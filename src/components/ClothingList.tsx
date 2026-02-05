import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
 import { ArrowLeft, Filter, SortAsc, Plus } from 'lucide-react';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { ClothingType, CLOTHING_TYPES, COLORS } from '@/types/clothing';
import ClothingCard from './ClothingCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

type SortOption = 'newest' | 'oldest' | 'mostUsed' | 'leastUsed' | 'recentlyWorn';

const ClothingList = () => {
  const navigate = useNavigate();
  const { clothes } = useWardrobeStore();
  
  const [filterType, setFilterType] = useState<ClothingType | 'all'>('all');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(clothes.map((c) => c.brand).filter(Boolean))];
    return uniqueBrands;
  }, [clothes]);

  const filteredAndSortedClothes = useMemo(() => {
    let result = [...clothes];

    // Apply filters
    if (filterType !== 'all') {
      result = result.filter((c) => c.type === filterType);
    }
    if (filterColor !== 'all') {
      result = result.filter((c) => c.color.toLowerCase() === filterColor.toLowerCase());
    }
    if (filterBrand !== 'all') {
      result = result.filter((c) => c.brand === filterBrand);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'mostUsed':
        result.sort((a, b) => b.timesWorn - a.timesWorn);
        break;
      case 'leastUsed':
        result.sort((a, b) => a.timesWorn - b.timesWorn);
        break;
      case 'recentlyWorn':
        result.sort((a, b) => {
          if (!a.lastWorn) return 1;
          if (!b.lastWorn) return -1;
          return new Date(b.lastWorn).getTime() - new Date(a.lastWorn).getTime();
        });
        break;
    }

    return result;
  }, [clothes, filterType, filterColor, filterBrand, sortBy]);

  const clearFilters = () => {
    setFilterType('all');
    setFilterColor('all');
    setFilterBrand('all');
  };

  const hasActiveFilters = filterType !== 'all' || filterColor !== 'all' || filterBrand !== 'all';

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
          <h1 className="font-display text-xl font-medium">Mi Ropa</h1>
          <div className="flex gap-2">
             <button
               onClick={() => navigate('/subir')}
               className="p-2 hover:bg-secondary rounded-xl transition-colors"
             >
               <Plus className="w-5 h-5 text-foreground" />
             </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-secondary rounded-xl transition-colors relative">
                  <Filter className="w-5 h-5 text-foreground" />
                  {hasActiveFilters && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Filtrar ropa</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <Select value={filterType} onValueChange={(v) => setFilterType(v as ClothingType | 'all')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {CLOTHING_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <Select value={filterColor} onValueChange={setFilterColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los colores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {brands.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Marca</label>
                      <Select value={filterBrand} onValueChange={setFilterBrand}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las marcas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-auto border-0 bg-transparent p-2 hover:bg-secondary rounded-xl">
                <SortAsc className="w-5 h-5 text-foreground" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="newest">Más reciente</SelectItem>
                <SelectItem value="oldest">Más antiguo</SelectItem>
                <SelectItem value="mostUsed">Más usado</SelectItem>
                <SelectItem value="leastUsed">Menos usado</SelectItem>
                <SelectItem value="recentlyWorn">Usado recientemente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {filteredAndSortedClothes.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">
              {clothes.length === 0
                ? 'No tienes ropa guardada todavía'
                : 'No hay ropa que coincida con los filtros'}
            </p>
            {clothes.length === 0 && (
              <Button
                onClick={() => navigate('/subir')}
                className="mt-4"
              >
                Subir tu primera prenda
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredAndSortedClothes.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ClothingCard
                  clothing={item}
                  onClick={() => navigate(`/ropa/${item.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClothingList;
