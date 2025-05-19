"use client"; // Lo rendiamo client component per eventuali animazioni o interazioni future

import React, { useEffect, useState } from "react";
import Image from "next/image"; // Per eventuali immagini
import {
  Phone,
  ShieldCheck,
  Headphones,
  Wrench,
  IdCard,
  ShoppingBag,
  MapPin,
  Mail,
  Clock,
  ExternalLink,
} from "lucide-react"; // Icone utili
import { Button } from "@/components/ui/button"; // Bottone Shadcn
import Link from "next/link"; // Per navigazione
import {
  COOKIE_POLICY_LINK,
  PRIVACY_POLICY_LINK,
  STORE_NAME,
  STORE_SLOGAN,
  ADDRESS,
  PHONE_NUMBER,
  EMAIL_ADDRESS,
  OPENING_HOURS,
} from "@/lib/constants";
import { CookieConsentManager } from "./cookie-consent-manager";

// Componente per una singola card di servizio
const ServiceCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  const IconComponent = icon;
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
      <IconComponent
        className="w-12 h-12 text-primary mb-4"
        strokeWidth={1.5}
      />
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

// Componente per il banner dei cookie
const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Controlla se il consenso è già stato dato/rifiutato
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
    // Qui potresti inizializzare script di tracciamento che richiedono consenso
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setIsVisible(false);
    // Qui potresti gestire il caso di rifiuto (es. disabilitare analytics non essenziali)
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary text-secondary-foreground p-4 shadow-lg z-[60] border-t">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          Utilizziamo i cookie per migliorare la tua esperienza. Per saperne di
          più, consulta la nostra{" "}
          <Link
            href={COOKIE_POLICY_LINK}
            className="font-semibold underline hover:text-primary"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={handleAccept}>
            Accetta
          </Button>
          <Button size="sm" variant="outline" onClick={handleDecline}>
            Rifiuta
          </Button>
        </div>
      </div>
    </div>
  );
};

export function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar Semplice (Opzionale, potresti non averne una per la welcome page o usarne una diversa) */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            {STORE_NAME}
          </Link>
        </div>
      </nav>

      {/* Sezione Hero */}
      <header className="relative py-16 sm:py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="absolute inset-0 opacity-5">
          {/* Immagine di sfondo generica o pattern (opzionale) */}
          {/* <Image src="/path/to/hero-background.jpg" layout="fill" objectFit="cover" alt="Sfondo Luna Tech"/> */}
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl xxs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Benvenuti da <span className="text-primary">{STORE_NAME}</span>!
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xl md:max-w-3xl mx-auto text-md sm:text-lg md:text-xl text-muted-foreground">
            {STORE_SLOGAN}
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center items-center gap-3 sm:gap-4">
            <Link href="#services" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-base"
              >
                Scopri i Servizi
              </Button>
            </Link>
            <Link href="#contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-base"
              >
                Contattaci
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sezione Servizi */}
      <section
        id="services"
        className="py-12 sm:py-16 md:py-24 bg-secondary/10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              I Nostri Servizi
            </h2>
            <p className="mt-3 sm:mt-4 text-md sm:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto">
              Soluzioni per smartphone, SIM e accessori.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ServiceCard
              icon={Wrench}
              title="Riparazioni Smartphone"
              description="Servizio di riparazione rapido e professionale per tutte le marche e modelli. Schermi, batterie, connettori e molto altro."
            />
            <ServiceCard
              icon={IdCard}
              title="Vendita e Attivazione SIM"
              description="Offriamo SIM di Iliad, DIGI, Optima, CMLink con le migliori tariffe. Attivazione immediata e portabilità del numero."
            />
            <ServiceCard
              icon={ShoppingBag}
              title="Accessori di Qualità"
              description="Vasta selezione di cover, pellicole protettive, caricabatterie, cavi, auricolari e gadget per il tuo smartphone."
            />
          </div>
        </div>
      </section>

      {/* Sezione Chi Siamo (Opzionale) */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Perché Scegliere {STORE_NAME}?
            </h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-4">
              <ShieldCheck
                className="w-12 h-12 text-primary mx-auto mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-lg mb-1">
                Affidabilità e Garanzia
              </h4>
              <p className="text-sm text-muted-foreground">
                Utilizziamo solo ricambi di alta qualità e offriamo garanzia su
                tutte le nostre riparazioni.
              </p>
            </div>
            <div className="p-4">
              <Clock
                className="w-12 h-12 text-primary mx-auto mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-lg mb-1">Servizio Rapido</h4>
              <p className="text-sm text-muted-foreground">
                Comprendiamo l'importanza del tuo dispositivo. Riparazioni
                espresse quando possibile.
              </p>
            </div>
            <div className="p-4">
              <Headphones
                className="w-12 h-12 text-primary mx-auto mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-lg mb-1">Consulenza Esperta</h4>
              <p className="text-sm text-muted-foreground">
                Il nostro team è pronto ad aiutarti a scegliere la soluzione
                migliore per le tue esigenze.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Contatti */}
      <section id="contact" className="py-12 sm:py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Contattaci o Vieni a Trovarci
            </h2>
            <p className="mt-3 sm:mt-4 text-md sm:text-lg text-muted-foreground">
              Siamo qui per rispondere a tutte le tue domande.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-xl">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-x-12">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Indirizzo</h4>
                    <p className="text-muted-foreground text-sm">{ADDRESS}</p>
                    {/* Opzionale: Link a Google Maps */}
                    <a
                      href="https://maps.app.goo.gl/f7FsgbakNJDw1mxM8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs sm:text-sm font-medium mt-1 inline-flex items-center gap-1"
                    >
                      Visualizza su Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Telefono</h4>
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {PHONE_NUMBER}
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <a
                      href={`mailto:${EMAIL_ADDRESS}`}
                      className="text-muted-foreground text-sm hover:text-primary"
                    >
                      {EMAIL_ADDRESS}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Orari di Apertura
                    </h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {OPENING_HOURS.replace(", ", "\n")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Semplice */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground space-y-2">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. Tutti i diritti
            riservati. P.IVA 07122910487
          </p>
          {/* Link GDPR Obbligatori */}
          <div className="flex justify-center gap-x-4 gap-y-2 flex-wrap">
            <Link
              href={PRIVACY_POLICY_LINK}
              className="hover:text-primary hover:underline"
            >
              Informativa Privacy
            </Link>
            <Link
              href={COOKIE_POLICY_LINK}
              className="hover:text-primary hover:underline"
            >
              Cookie Policy
            </Link>
            <CookieConsentManager />
          </div>
        </div>
      </footer>
    </div>
  );
}
