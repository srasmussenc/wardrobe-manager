export interface ClothingItem {
  id: string;
  imageUrl: string;
  color: string;
  size: string;
  width?: string;
  length?: string;
  brand: string;
  type: ClothingType;
  createdAt: Date;
  lastWorn?: Date;
  timesWorn: number;
}

export type ClothingType = 
  | 'camiseta'
  | 'camisa'
  | 'pantalon'
  | 'shorts'
  | 'vestido'
  | 'falda'
  | 'chaqueta'
  | 'abrigo'
  | 'sudadera'
  | 'jersey'
  | 'zapatos'
  | 'accesorios'
  | 'otro';

export interface Outfit {
  id: string;
  name: string;
  clothingIds: string[];
  createdAt: Date;
  lastWorn?: Date;
}

export interface OutfitOfToday {
  date: string;
  clothingIds: string[];
}

export const CLOTHING_TYPES: { value: ClothingType; label: string }[] = [
  { value: 'camiseta', label: 'Camiseta' },
  { value: 'camisa', label: 'Camisa' },
  { value: 'pantalon', label: 'Pantalón' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'vestido', label: 'Vestido' },
  { value: 'falda', label: 'Falda' },
  { value: 'chaqueta', label: 'Chaqueta' },
  { value: 'abrigo', label: 'Abrigo' },
  { value: 'sudadera', label: 'Sudadera' },
  { value: 'jersey', label: 'Jersey' },
  { value: 'zapatos', label: 'Zapatos' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'otro', label: 'Otro' },
];

export const COLORS = [
  'negro', 'blanco', 'gris', 'azul', 'rojo', 'verde', 
  'amarillo', 'naranja', 'rosa', 'morado', 'marrón', 'beige'
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
