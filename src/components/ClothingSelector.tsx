import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { ClothingItem, CLOTHING_TYPES, COLORS } from '@/types/clothing';
import ClothingCard from './ClothingCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClothingSelectorProps {
  clothes: ClothingItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyMessage?: string;
}

const ClothingSelector = ({
  clothes,
  selectedIds,
  onToggle,
  emptyMessage = 'No tienes ropa guardada',
}: ClothingSelectorProps) => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredClothes = useMemo(() => {
    return clothes.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesColor = colorFilter === 'all' || item.color === colorFilter;
      return matchesType && matchesColor;
    });
  }, [clothes, typeFilter, colorFilter]);

  const hasActiveFilters = typeFilter !== 'all' || colorFilter !== 'all';

  const clearFilters = () => {
    setTypeFilter('all');
    setColorFilter('all');
  };

  if (clothes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <Button onClick={() => navigate('/subir')} className="mt-4">
          Subir tu primera prenda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {(typeFilter !== 'all' ? 1 : 0) + (colorFilter !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-4 h-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-3 animate-fade-in">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Tipo de prenda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {CLOTHING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los colores</SelectItem>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color} className="capitalize">
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredClothes.length} de {clothes.length} prendas
      </p>

      {/* Clothing grid */}
      {filteredClothes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay prendas con estos filtros</p>
          <Button variant="outline" onClick={clearFilters} className="mt-2">
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filteredClothes.map((item) => (
            <ClothingCard
              key={item.id}
              clothing={item}
              selected={selectedIds.includes(item.id)}
              selectable
              onClick={() => onToggle(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClothingSelector;
