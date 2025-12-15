import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CasinoProvider, useCasino } from "./contexts/CasinoContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Slots from "./pages/Slots";
import Blackjack from "./pages/Blackjack";
import Poker from "./pages/Poker";
import Roulette from "./pages/Roulette";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme, soundEnabled } = useCasino();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (soundEnabled) {
      document.body.removeAttribute('data-sound-disabled');
    } else {
      document.body.setAttribute('data-sound-disabled', 'true');
    }
  }, [theme, soundEnabled]);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CasinoProvider>
        <ThemeWrapper>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/slots" element={<Slots />} />
              <Route path="/blackjack" element={<Blackjack />} />
              <Route path="/poker" element={<Poker />} />
              <Route path="/roulette" element={<Roulette />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeWrapper>
      </CasinoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
