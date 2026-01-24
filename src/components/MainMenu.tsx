import { Shirt, Layers, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Shirt,
      label: 'Ropa',
      description: 'Ver toda tu ropa',
      path: '/ropa',
    },
    {
      icon: Layers,
      label: 'Outfits',
      description: 'Gestionar outfits',
      path: '/outfits',
    },
    {
      icon: Upload,
      label: 'Subir ropa',
      description: 'Añadir nueva prenda',
      path: '/subir',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-semibold text-foreground tracking-tight">
            Mi Armario
          </h1>
          <p className="text-muted-foreground font-body">
            Organiza tu ropa con estilo
          </p>
        </div>

        <div className="space-y-4 pt-8">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-2xl p-6 shadow-wardrobe transition-all duration-300 hover:shadow-wardrobe-lg hover:-translate-y-1 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center transition-colors group-hover:bg-primary">
                    <item.icon className="w-6 h-6 text-secondary-foreground transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-xl font-medium text-foreground">
                      {item.label}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
