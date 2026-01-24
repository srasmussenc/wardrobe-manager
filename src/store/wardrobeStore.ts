import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClothingItem, Outfit, OutfitOfToday } from '@/types/clothing';

interface WardrobeState {
  clothes: ClothingItem[];
  outfits: Outfit[];
  outfitsOfToday: OutfitOfToday[];
  
  // Clothing actions
  addClothing: (item: Omit<ClothingItem, 'id' | 'createdAt' | 'timesWorn'>) => void;
  updateClothing: (id: string, updates: Partial<ClothingItem>) => void;
  deleteClothing: (id: string) => void;
  
  // Outfit actions
  addOutfit: (outfit: Omit<Outfit, 'id' | 'createdAt'>) => void;
  updateOutfit: (id: string, updates: Partial<Outfit>) => void;
  deleteOutfit: (id: string) => void;
  
  // Outfit of today actions
  setOutfitOfToday: (clothingIds: string[]) => void;
  getOutfitOfToday: () => OutfitOfToday | undefined;
}

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      clothes: [],
      outfits: [],
      outfitsOfToday: [],
      
      addClothing: (item) => set((state) => ({
        clothes: [...state.clothes, {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          timesWorn: 0,
        }],
      })),
      
      updateClothing: (id, updates) => set((state) => ({
        clothes: state.clothes.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      })),
      
      deleteClothing: (id) => set((state) => ({
        clothes: state.clothes.filter((item) => item.id !== id),
        outfits: state.outfits.map((outfit) => ({
          ...outfit,
          clothingIds: outfit.clothingIds.filter((cId) => cId !== id),
        })),
      })),
      
      addOutfit: (outfit) => set((state) => ({
        outfits: [...state.outfits, {
          ...outfit,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }],
      })),
      
      updateOutfit: (id, updates) => set((state) => ({
        outfits: state.outfits.map((outfit) =>
          outfit.id === id ? { ...outfit, ...updates } : outfit
        ),
      })),
      
      deleteOutfit: (id) => set((state) => ({
        outfits: state.outfits.filter((outfit) => outfit.id !== id),
      })),
      
      setOutfitOfToday: (clothingIds) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Update times worn for each clothing item
        set((state) => ({
          clothes: state.clothes.map((item) =>
            clothingIds.includes(item.id)
              ? { ...item, lastWorn: new Date(), timesWorn: item.timesWorn + 1 }
              : item
          ),
          outfitsOfToday: [
            ...state.outfitsOfToday.filter((o) => o.date !== today),
            { date: today, clothingIds },
          ],
        }));
      },
      
      getOutfitOfToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().outfitsOfToday.find((o) => o.date === today);
      },
    }),
    {
      name: 'wardrobe-storage',
    }
  )
);
