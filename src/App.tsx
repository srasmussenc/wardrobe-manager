import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import ClothingList from "./components/ClothingList";
import ClothingDetail from "./components/ClothingDetail";
import UploadClothing from "./components/UploadClothing";
import OutfitList from "./components/OutfitList";
 import SizeComparison from "./components/SizeComparison";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
 import { useBackButton } from "./hooks/useBackButton";

const queryClient = new QueryClient();

 const AppContent = () => {
   useBackButton();
   
   return (
     <Routes>
       <Route path="/" element={<MainMenu />} />
       <Route path="/ropa" element={<ClothingList />} />
       <Route path="/ropa/:id" element={<ClothingDetail />} />
       <Route path="/subir" element={<UploadClothing />} />
       <Route path="/outfits" element={<OutfitList />} />
       <Route path="/comparar" element={<SizeComparison />} />
       <Route path="/install" element={<Install />} />
       <Route path="*" element={<NotFound />} />
     </Routes>
   );
 };
 
 const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
         <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
