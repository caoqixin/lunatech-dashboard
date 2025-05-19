import { WelcomePage } from "@/views/welcome/components/welcome-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benvenuti da Luna Tech | Riparazione Cellulari e Accessori",
  description:
    "Luna Tech: il tuo centro di fiducia per riparazioni smartphone, attivazione SIM e vendita di accessori di alta qualità. Scopri i nostri servizi!",
  // Aggiungi qui altre meta tags SEO come keywords, open graph, etc.
};

// Questa pagina non richiede login
export default function Page() {
  return <WelcomePage />;
}
