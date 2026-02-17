import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Save, X } from 'lucide-react';
import { useWardrobeStore } from '@/store/wardrobeStore';
import { CLOTHING_TYPES, COLORS, SIZES, SHOE_SIZES, PANT_SIZES_EUR, PANT_SIZES_US, SizeSystem, isFootwear, isPants } from '@/types/clothing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const ClothingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clothes, updateClothing, deleteClothing } = useWardrobeStore();

  const clothing = clothes.find((c) => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(clothing);
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>(() => {
    // Detect current size system from existing size
    if (clothing?.size && clothing.size.includes('EUR')) return 'EUR';
    return 'US';
  });

  if (!clothing || !editData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Prenda no encontrada</p>
          <Button onClick={() => navigate('/ropa')} className="mt-4">
            Volver a mi ropa
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateClothing(clothing.id, editData);
    setIsEditing(false);
    toast.success('Prenda actualizada');
  };

  const handleDelete = () => {
    deleteClothing(clothing.id);
    toast.success('Prenda eliminada');
    navigate('/ropa');
  };

  const handleCancel = () => {
    setEditData(clothing);
    setIsEditing(false);
  };

  const typeLabel = CLOTHING_TYPES.find((t) => t.value === clothing.type)?.label || clothing.type;

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/ropa')}
            className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-xl font-medium">
            {isEditing ? 'Editar prenda' : typeLabel}
          </h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <Save className="w-5 h-5 text-primary" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-foreground" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-2 hover:bg-destructive/10 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar prenda?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La prenda será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 animate-fade-in">
        <div className="bg-card rounded-2xl overflow-hidden shadow-wardrobe border border-border/50">
          <div className="aspect-square bg-secondary">
            {clothing.imageUrl ? (
              <img
                src={clothing.imageUrl}
                alt={typeLabel}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <Select
                  value={editData.type}
                  onValueChange={(v) => setEditData({ ...editData, type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select
                  value={editData.color}
                  onValueChange={(v) => setEditData({ ...editData, color: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size System Toggle for pants/shorts */}
              {editData.type && isPants(editData.type) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sistema de talla</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={sizeSystem === 'US' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => { setSizeSystem('US'); setEditData({ ...editData, size: '' }); }}
                    >
                      US
                    </Button>
                    <Button
                      type="button"
                      variant={sizeSystem === 'EUR' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => { setSizeSystem('EUR'); setEditData({ ...editData, size: '' }); }}
                    >
                      EUR
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Talla</label>
                <Select
                  value={editData.size}
                  onValueChange={(v) => setEditData({ ...editData, size: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(editData.type && isFootwear(editData.type)
                      ? SHOE_SIZES
                      : editData.type && isPants(editData.type)
                        ? (sizeSystem === 'EUR' ? PANT_SIZES_EUR : PANT_SIZES_US)
                        : SIZES
                    ).map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Marca</label>
                <Input
                  value={editData.brand}
                  onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                  placeholder="Marca"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Ancho</label>
                  <Input
                    value={editData.width || ''}
                    onChange={(e) => setEditData({ ...editData, width: e.target.value })}
                    placeholder="Ancho"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Largo</label>
                  <Input
                    value={editData.length || ''}
                    onChange={(e) => setEditData({ ...editData, length: e.target.value })}
                    placeholder="Largo"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 bg-card rounded-2xl p-4 border border-border/50">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium">{typeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color</span>
                <span className="font-medium capitalize">{clothing.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Talla</span>
                <span className="font-medium">{clothing.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Marca</span>
                <span className="font-medium">{clothing.brand || 'Sin marca'}</span>
              </div>
              {clothing.width && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ancho</span>
                  <span className="font-medium">{clothing.width}</span>
                </div>
              )}
              {clothing.length && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Largo</span>
                  <span className="font-medium">{clothing.length}</span>
                </div>
              )}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Veces usado</span>
                  <span className="font-medium">{clothing.timesWorn}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Último uso</span>
                  <span className="font-medium">{formatDate(clothing.lastWorn)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Añadido</span>
                  <span className="font-medium">{formatDate(clothing.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClothingDetail;
