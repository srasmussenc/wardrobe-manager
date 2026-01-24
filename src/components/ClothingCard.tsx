import { ClothingItem, CLOTHING_TYPES } from '@/types/clothing';

interface ClothingCardProps {
  clothing: ClothingItem;
  onClick?: () => void;
  selected?: boolean;
  selectable?: boolean;
}

const ClothingCard = ({ clothing, onClick, selected, selectable }: ClothingCardProps) => {
  const typeLabel = CLOTHING_TYPES.find((t) => t.value === clothing.type)?.label || clothing.type;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group transition-all duration-300 ${
        selectable ? 'cursor-pointer' : ''
      }`}
    >
      <div
        className={`relative bg-card rounded-2xl overflow-hidden shadow-wardrobe transition-all duration-300 hover:shadow-wardrobe-lg hover:-translate-y-1 border ${
          selected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
        }`}
      >
        <div className="aspect-square bg-secondary overflow-hidden">
          {clothing.imageUrl ? (
            <img
              src={clothing.imageUrl}
              alt={`${typeLabel} ${clothing.brand}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-foreground text-sm truncate">
            {typeLabel}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {clothing.brand || 'Sin marca'}
          </p>
          {clothing.timesWorn > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Usado {clothing.timesWorn}x
            </p>
          )}
        </div>
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};

export default ClothingCard;
