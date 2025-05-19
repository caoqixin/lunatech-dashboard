"use client";
import { Switch } from "@/components/ui/switch"; // Per i toggle
import { Label } from "@/components/ui/label"; // Per le etichette dei toggle
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"; // Per il modale delle preferenze su mobile
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { COOKIE_POLICY_LINK, COOKIE_PREFERENCES_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Info, Settings2, XCircle } from "lucide-react";

// Definiamo i tipi di preferenze
export interface CookiePreferences {
  necessary: boolean; // Sempre true
  analytics: boolean; // Es. per Vercel Analytics
  // Aggiungi altre categorie se necessario in futuro (marketing, preferences, etc.)
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: true, // Di default, potresti impostare gli analitici su false o true
};

// Componente per il banner dei cookie e gestione preferenze
export const CookieConsentManager = () => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        const parsedPrefs = JSON.parse(savedPreferences) as CookiePreferences;
        setPreferences({ ...parsedPrefs, necessary: true }); // Necessary è sempre true
      } catch (e) {
        console.error("Errore nel parsing delle preferenze cookie:", e);
        setPreferences({ ...DEFAULT_PREFERENCES, necessary: true });
        setBannerVisible(true); // Mostra banner se c'è errore o no prefs
      }
    } else {
      setBannerVisible(true);
      setPreferences({ ...DEFAULT_PREFERENCES, necessary: true });
    }
  }, []);

  // Applica le preferenze (es. logica per caricare script analitici)
  useEffect(() => {
    if (preferences.analytics) {
      console.log("Analytics consentiti (simulazione caricamento script).");
      // Qui andrebbe la logica per inizializzare Vercel Analytics se fosse controllabile client-side
      // o altri script di analytics di terze parti.
    } else {
      console.log("Analytics NON consentiti.");
    }
  }, [preferences]);

  const savePreferences = (newPreferences: CookiePreferences) => {
    const prefsToSave = { ...newPreferences, necessary: true };
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefsToSave));
    setPreferences(prefsToSave);
    toast.success("Preferenze cookie salvate!");
  };

  const handleAcceptAll = () => {
    savePreferences({ necessary: true, analytics: true });
    setBannerVisible(false);
    setPreferencesModalOpen(false);
  };

  const handleSaveCurrentPreferences = () => {
    savePreferences(preferences); // Salva lo stato corrente dei toggle
    setBannerVisible(false);
    setPreferencesModalOpen(false);
  };

  const handleRejectAllOptional = () => {
    savePreferences({
      ...DEFAULT_PREFERENCES,
      necessary: true,
      analytics: false,
    }); // Disattiva tutti gli opzionali
    setBannerVisible(false);
    setPreferencesModalOpen(false);
  };

  const openPreferencesModal = () => {
    setBannerVisible(false); // Nascondi il banner quando apri il modale delle preferenze
    setPreferencesModalOpen(true);
  };

  // Non renderizzare nulla se l'utente ha già interagito o se il modale è aperto
  if (!bannerVisible && !preferencesModalOpen) {
    // Opzionale: Aggiungere un piccolo link/bottone "Gestisci Cookie" nel footer se il banner è nascosto
    // return <Button onClick={() => setPreferencesModalOpen(true)}>Modifica preferenze cookie</Button>;
    return null;
  }

  return (
    <>
      {/* Banner Consenso Cookie */}
      {bannerVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-[60] transition-transform duration-300 ease-out transform translate-y-0">
          <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
            {/*
              Contenitore principale del banner - Grid Layout
              - Mobile (default): una colonna, gli item si impilano
              - Desktop (sm e sup.): due colonne, items-center per allineamento verticale
            */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-3 text-center sm:text-left">
              {/* Sezione Testo - Occupa la prima colonna */}
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Info className="w-5 h-5 text-primary shrink-0 hidden sm:block" />
                <p>
                  Utilizziamo i cookie per garantirti la migliore esperienza sul
                  nostro sito.{" "}
                  <Link
                    href={COOKIE_POLICY_LINK}
                    className="font-semibold underline hover:text-primary"
                  >
                    Scopri di più
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto shrink-0 sm:justify-self-end">
                <Button
                  size="sm"
                  onClick={openPreferencesModal}
                  variant="outline"
                  className="w-full xs:w-auto"
                >
                  <Settings2 className="mr-1.5 size-4" />
                  Personalizza
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="w-full xs:w-auto bg-primary hover:bg-primary/90"
                >
                  <CheckCircle className="mr-1.5 size-4" />
                  Accetta Tutti
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRejectAllOptional}
                  className="w-full xs:w-auto"
                >
                  <XCircle className="mr-1.5 size-4" />
                  Rifiuta
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale Preferenze Cookie (Sheet) */}
      <Sheet
        open={preferencesModalOpen}
        onOpenChange={(open) => {
          setPreferencesModalOpen(open);
          // Se il modale viene chiuso senza salvare (es. cliccando fuori) e non ci sono preferenze salvate,
          // rimetti il banner principale visibile.
          if (!open && !localStorage.getItem(COOKIE_PREFERENCES_KEY)) {
            setBannerVisible(true);
          }
        }}
      >
        {/* Non serve SheetTrigger qui, viene aperto programmaticamente o da "Personalizza" */}
        <SheetContent
          side="bottom"
          className="w-full max-w-2xl mx-auto rounded-t-lg max-h-[90vh] flex flex-col p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full"
        >
          <SheetHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b sticky top-0 bg-background z-10">
            <SheetTitle className="text-lg font-semibold">
              Preferenze Privacy e Cookie
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Personalizza le tue impostazioni.{" "}
              <Link
                href={COOKIE_POLICY_LINK}
                className="text-primary hover:underline"
              >
                Leggi la nostra Cookie Policy
              </Link>
              .
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-5 p-4 sm:p-6">
              {/* Cookie Strettamente Necessari */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-muted/30 shadow-sm">
                <div className="mb-2 sm:mb-0 sm:mr-4">
                  <Label
                    htmlFor="necessary-cookies"
                    className="font-semibold text-base flex items-center gap-1.5"
                  >
                    <CheckCircle className="size-4 text-green-600" /> Cookie
                    Strettamente Necessari
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sempre attivi. Essenziali per il funzionamento del sito (es.
                    salvare queste preferenze).
                  </p>
                </div>
                <Switch
                  id="necessary-cookies"
                  checked={true}
                  disabled
                  className="ml-auto sm:ml-0"
                />
              </div>

              {/* Cookie Analitici */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg shadow-sm">
                <div className="mb-2 sm:mb-0 sm:mr-4">
                  <Label
                    htmlFor="analytics-cookies"
                    className="font-semibold text-base"
                  >
                    Cookie Analitici
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ci aiutano a capire come interagisci con il sito, in forma
                    aggregata e anonima (Vercel Analytics).
                  </p>
                </div>
                <Switch
                  id="analytics-cookies"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, analytics: checked }))
                  }
                  className="ml-auto sm:ml-0"
                />
              </div>
              {/* Aggiungi altre categorie qui */}
            </div>
          </ScrollArea>

          <SheetFooter className="px-4 py-3 sm:px-6 sm:py-4 border-t flex flex-col xs:flex-row gap-2 justify-center sm:justify-end sticky bottom-0 bg-background z-10">
            <Button
              variant="ghost"
              onClick={handleRejectAllOptional}
              className="w-full xs:w-auto text-destructive hover:text-destructive"
            >
              <XCircle className="mr-1.5 size-4" />
              Rifiuta Opzionali
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveCurrentPreferences}
              className="w-full xs:w-auto"
            >
              Salva Preferenze
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="w-full xs:w-auto bg-primary hover:bg-primary/90"
            >
              Accetta Tutti
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
