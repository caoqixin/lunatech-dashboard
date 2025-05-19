// app/cookie-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link"; // Importa Link se necessario
import { Button } from "@/components/ui/button"; // Importa Button

export const metadata: Metadata = {
  title: "Cookie Policy | Luna Tech",
  description: "Informativa sui cookie utilizzati dal sito web di Luna Tech.",
};

export default function CookiePolicyPage() {
  const storeName = "Luna Tech";
  const lastUpdated = "15 Ottobre 2023"; // Aggiorna questa data

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Informativa sui Cookie di {storeName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ultimo aggiornamento: {lastUpdated}
        </p>
      </header>

      <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto max-w-3xl space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold">
          1. Cosa sono i Cookie?
        </h2>
        <p>
          I cookie sono piccoli file di testo che i siti visitati dagli utenti
          inviano ai loro terminali (solitamente al browser), dove vengono
          memorizzati per essere poi ritrasmessi agli stessi siti alla
          successiva visita del medesimo utente. Possono essere utilizzati per
          diverse finalità, come eseguire autenticazioni informatiche,
          monitorare sessioni, memorizzare informazioni su specifiche
          configurazioni riguardanti gli utenti che accedono al server, ecc.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          2. Cookie Utilizzati da Questo Sito
        </h2>
        <p>
          Questo Sito si impegna a minimizzare l'uso di cookie, specialmente
          quelli non strettamente necessari per il suo funzionamento.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Cookie Tecnici Strettamente Necessari:</strong>
            <ul className="list-circle space-y-1 pl-5 mt-1">
              <li>
                <code>cookie_consent</code> (o nome simile): Utilizziamo un
                cookie per memorizzare le tue preferenze riguardo al consenso
                all'utilizzo dei cookie su questo Sito. Questo cookie è
                essenziale per ricordare la tua scelta e non richiederti il
                consenso ad ogni visita. Durata: [specifica durata, es. 1 anno].
              </li>
              {/* Aggiungi qui altri cookie tecnici se li usi, es. per preferenze di lingua, tema, etc. */}
            </ul>
          </li>
          <li>
            <strong>Cookie di Terze Parti (Analytics):</strong>
            <ul className="list-circle space-y-1 pl-5 mt-1">
              <li>
                <strong>Vercel Analytics:</strong> Come menzionato nella nostra
                Informativa Privacy, utilizziamo Vercel Analytics per monitorare
                le prestazioni del sito e raccogliere dati statistici aggregati
                e anonimi. Per impostazione predefinita, Vercel Analytics è
                progettato per essere conforme alla privacy e **non utilizza
                cookie lato client** per il tracciamento standard degli utenti.
                Tuttavia, a seconda della configurazione specifica o di
                funzionalità aggiuntive che Vercel potrebbe introdurre, è buona
                norma verificare la loro documentazione più recente. Per
                maggiori informazioni:{" "}
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Vercel Analytics Privacy
                </a>
                .
              </li>
              <li>
                <strong>Vercel Speed Insights:</strong> Questo servizio aiuta a
                misurare le prestazioni reali del sito per gli utenti.
                Analogamente a Vercel Analytics, è progettato tenendo conto
                della privacy. Ti invitiamo a consultare la documentazione di
                Vercel per i dettagli specifici sui dati raccolti e su eventuali
                meccanismi di memorizzazione utilizzati.
              </li>
            </ul>
          </li>
        </ul>
        <p>
          **Non utilizziamo cookie di profilazione** per inviare messaggi
          pubblicitari basati sulle preferenze manifestate dall'utente
          nell'ambito della navigazione in rete.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          3. Natura del Conferimento dei Dati e Consenso
        </h2>
        <p>
          I cookie tecnici sono essenziali per il corretto funzionamento del
          Sito. Per l'utilizzo di cookie di terze parti (come quelli
          potenzialmente usati da Vercel Analytics, sebbene la loro
          configurazione predefinita sia orientata alla privacy), ti verrà
          richiesto il consenso tramite un apposito banner al primo accesso al
          Sito. Potrai modificare le tue preferenze in qualsiasi momento.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          4. Come Gestire o Disabilitare i Cookie
        </h2>
        <p>
          Oltre a quanto indicato in questo documento e tramite il banner di
          consenso, puoi gestire le preferenze relative ai Cookie direttamente
          all'interno del tuo browser ed impedire – ad esempio – che terze parti
          possano installarne. Tramite le preferenze del browser è inoltre
          possibile eliminare i Cookie installati in passato, incluso il Cookie
          in cui venga eventualmente salvato il consenso all'installazione di
          Cookie da parte di questo sito.
        </p>
        <p>
          Puoi trovare informazioni su come gestire i Cookie con alcuni dei
          browser più diffusi ai seguenti indirizzi:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Apple Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/it-it/windows/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Per quanto riguarda i cookie installati da terze parti, puoi inoltre
          gestire le tue impostazioni e revocare il consenso visitando il
          relativo link di opt-out (qualora disponibile), utilizzando gli
          strumenti descritti nella privacy policy della terza parte o
          contattando direttamente la stessa.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          5. Titolare del Trattamento
        </h2>
        <p>
          {storeName}, [Il Tuo Indirizzo Qui], Email: [La Tua Email di
          Contatto].
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          6. Ulteriori Informazioni sul Trattamento
        </h2>
        <p>
          Maggiori informazioni in relazione al trattamento dei Dati Personali
          potranno essere richieste in qualsiasi momento al Titolare del
          Trattamento utilizzando le informazioni di contatto. Per tutto quanto
          non specificato qui, si rimanda alla{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Informativa Privacy
          </Link>{" "}
          completa del Sito.
        </p>
      </article>

      <div className="mt-12 text-center">
        <Link href="/welcome" legacyBehavior>
          <Button variant="outline">Torna alla Home</Button>
        </Link>
      </div>
    </div>
  );
}
