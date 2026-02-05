 import { useState, useMemo } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { ArrowLeft, Search } from 'lucide-react';
 import { useWardrobeStore } from '@/store/wardrobeStore';
 import { ClothingType, CLOTHING_TYPES, SIZES, SHOE_SIZES, isFootwear } from '@/types/clothing';
 import ClothingCard from './ClothingCard';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 
 interface ScoredItem {
   id: string;
   score: number;
 }
 
 const SizeComparison = () => {
   const navigate = useNavigate();
   const { clothes } = useWardrobeStore();
 
   const [type, setType] = useState<ClothingType | ''>('');
   const [brand, setBrand] = useState<string>('');
   const [size, setSize] = useState<string>('');
   const [width, setWidth] = useState<string>('');
   const [length, setLength] = useState<string>('');
   const [hasSearched, setHasSearched] = useState(false);
   const [results, setResults] = useState<ScoredItem[]>([]);
 
   const brands = useMemo(() => {
     if (!type) return [];
     const uniqueBrands = [...new Set(
       clothes
         .filter((c) => c.type === type && c.brand)
         .map((c) => c.brand)
     )];
     return uniqueBrands;
   }, [clothes, type]);
 
   const currentSizes = type && isFootwear(type) ? SHOE_SIZES : SIZES;
   const showMeasurements = type && !isFootwear(type);
 
   const handleTypeChange = (value: ClothingType) => {
     setType(value);
     setSize('');
     setBrand('');
     setWidth('');
     setLength('');
     setHasSearched(false);
     setResults([]);
   };
 
   const handleSearch = () => {
     if (!type) return;
 
     const typeClothes = clothes.filter((c) => c.type === type);
     const scored: ScoredItem[] = [];
 
     for (const item of typeClothes) {
       let score = 0;
 
       // Priority 1: Size + Brand match (highest priority)
       const sizeMatch = size && item.size === size;
       const brandMatch = brand && item.brand.toLowerCase() === brand.toLowerCase();
       
       if (sizeMatch && brandMatch) {
         score += 100;
       }
 
       // Priority 2: Measurements match
       if (showMeasurements && (width || length)) {
         const widthNum = width ? parseFloat(width) : null;
         const lengthNum = length ? parseFloat(length) : null;
         const itemWidth = item.width ? parseFloat(item.width) : null;
         const itemLength = item.length ? parseFloat(item.length) : null;
 
         let measurementScore = 0;
         if (widthNum && itemWidth) {
           const diff = Math.abs(widthNum - itemWidth);
           if (diff <= 2) measurementScore += 30;
           else if (diff <= 5) measurementScore += 15;
         }
         if (lengthNum && itemLength) {
           const diff = Math.abs(lengthNum - itemLength);
           if (diff <= 2) measurementScore += 30;
           else if (diff <= 5) measurementScore += 15;
         }
         score += measurementScore;
       }
 
       // Priority 3: Brand only match
       if (brandMatch && !sizeMatch) {
         score += 40;
       }
 
       // Priority 4: Size only match
       if (sizeMatch && !brandMatch) {
         score += 20;
       }
 
       // Add all items of matching type (score 0 means just type match)
       scored.push({ id: item.id, score });
     }
 
     // Sort by score descending
     scored.sort((a, b) => b.score - a.score);
     setResults(scored);
     setHasSearched(true);
   };
 
   const getClothingById = (id: string) => clothes.find((c) => c.id === id);
 
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
           <h1 className="font-display text-xl font-medium">Comparar Tallas</h1>
           <div className="w-9" />
         </div>
       </header>
 
       <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
         <div className="space-y-6">
           {/* Search Form */}
           <div className="space-y-4 bg-card rounded-2xl p-4 border border-border/50">
             <p className="text-sm text-muted-foreground">
               Ingresa los datos de la prenda que quieres comparar y te mostraremos prendas similares de tu armario.
             </p>
 
             {/* Type - Required */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-muted-foreground">
                 Tipo de prenda *
               </label>
               <Select value={type} onValueChange={handleTypeChange}>
                 <SelectTrigger>
                   <SelectValue placeholder="Selecciona el tipo" />
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
 
             {type && (
               <>
                 {/* Brand */}
                 <div className="space-y-2 animate-fade-in">
                   <label className="text-sm font-medium text-muted-foreground">
                     Marca (opcional)
                   </label>
                   <Input
                     value={brand}
                     onChange={(e) => setBrand(e.target.value)}
                     placeholder="Nombre de la marca"
                     list="brands-list"
                   />
                   {brands.length > 0 && (
                     <datalist id="brands-list">
                       {brands.map((b) => (
                         <option key={b} value={b} />
                       ))}
                     </datalist>
                   )}
                 </div>
 
                 {/* Size */}
                 <div className="space-y-2 animate-fade-in">
                   <label className="text-sm font-medium text-muted-foreground">
                     {isFootwear(type) ? 'Talla de calzado' : 'Talla'} (opcional)
                   </label>
                   <Select value={size} onValueChange={setSize}>
                     <SelectTrigger>
                       <SelectValue placeholder="Selecciona la talla" />
                     </SelectTrigger>
                     <SelectContent>
                       {currentSizes.map((s) => (
                         <SelectItem key={s} value={s}>
                           {s}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 {/* Measurements - Only for non-footwear */}
                 {showMeasurements && (
                   <div className="grid grid-cols-2 gap-4 animate-fade-in">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">
                         Ancho (cm)
                       </label>
                       <Input
                         value={width}
                         onChange={(e) => setWidth(e.target.value)}
                         placeholder="Ej: 50"
                         type="number"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-muted-foreground">
                         Largo (cm)
                       </label>
                       <Input
                         value={length}
                         onChange={(e) => setLength(e.target.value)}
                         placeholder="Ej: 70"
                         type="number"
                       />
                     </div>
                   </div>
                 )}
               </>
             )}
 
             <Button
               onClick={handleSearch}
               disabled={!type}
               className="w-full gap-2"
             >
               <Search className="w-4 h-4" />
               Buscar similares
             </Button>
           </div>
 
           {/* Results */}
           {hasSearched && (
             <div className="space-y-4 animate-fade-in">
               <h2 className="font-display text-lg font-medium">
                 Resultados ({results.length})
               </h2>
 
               {results.length === 0 ? (
                 <div className="text-center py-8 bg-card rounded-2xl border border-border/50">
                   <p className="text-muted-foreground">
                     No tienes prendas de este tipo guardadas
                   </p>
                   <Button
                     onClick={() => navigate('/subir')}
                     variant="outline"
                     className="mt-4"
                   >
                     Subir prenda
                   </Button>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4">
                   {results.map((result, index) => {
                     const item = getClothingById(result.id);
                     if (!item) return null;
                     return (
                       <div
                         key={item.id}
                         className="animate-fade-in relative"
                         style={{ animationDelay: `${index * 50}ms` }}
                       >
                         {result.score > 0 && (
                           <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                             {result.score >= 100 ? '⭐ Mejor' : 
                              result.score >= 40 ? 'Similar' : 'Parcial'}
                           </div>
                         )}
                         <ClothingCard
                           clothing={item}
                           onClick={() => navigate(`/ropa/${item.id}`)}
                         />
                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
           )}
         </div>
       </main>
     </div>
   );
 };
 
 export default SizeComparison;