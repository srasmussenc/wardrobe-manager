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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/ropa" element={<ClothingList />} />
          <Route path="/ropa/:id" element={<ClothingDetail />} />
          <Route path="/subir" element={<UploadClothing />} />
          <Route path="/outfits" element={<OutfitList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
