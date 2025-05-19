// app/privacy-policy/page.tsx
import { Button } from "@/components/ui/button";
import {
  EMAIL_ADDRESS,
  LAST_UPDATED,
  RAGIONE_SOCIALE,
  SEDE_LEGALE,
  STORE_NAME,
} from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informativa sulla Privacy | Luna Tech",
  description: "Informativa sulla privacy per il sito web di Luna Tech.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Informativa sulla Privacy di {STORE_NAME}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ultimo aggiornamento: {LAST_UPDATED}
        </p>
      </header>

      <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto max-w-3xl space-y-6">
        <p>
          Benvenuto/a sul sito web di <strong>{STORE_NAME}</strong>. La tua
          privacy è importante per noi. Questa informativa sulla privacy spiega
          come trattiamo le informazioni raccolte attraverso questo sito web (di
          seguito "Sito").
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          1. Titolare del Trattamento
        </h2>
        <p>
          Il titolare del trattamento dei dati è{" "}
          <strong>{RAGIONE_SOCIALE}</strong>, con sede in
          <strong>{SEDE_LEGALE}</strong>. Puoi contattarci all'indirizzo email:{" "}
          <strong>{EMAIL_ADDRESS}</strong>.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          2. Dati Personali Raccolti
        </h2>
        <p>
          Questo Sito è stato progettato principalmente per fornire informazioni
          sui nostri servizi e prodotti. **Non raccogliamo attivamente dati
          personali identificativi** (come nome, cognome, indirizzo email,
          numero di telefono) a meno che tu non decida volontariamente di
          fornirceli contattandoci direttamente tramite i recapiti indicati.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          3. Dati di Navigazione e Cookie (Servizi di Terze Parti)
        </h2>
        <p>
          Per il funzionamento del Sito e per migliorarne l'esperienza,
          utilizziamo servizi di terze parti che potrebbero raccogliere alcuni
          dati di navigazione e utilizzare cookie.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Vercel Speed Insights e Analytics:</strong> Utilizziamo
            Vercel Speed Insights e Vercel Analytics per monitorare le
            prestazioni del sito e raccogliere dati statistici aggregati e
            anonimi sull'utilizzo del Sito (ad esempio, pagine visitate, durata
            della visita, tipo di dispositivo, paese di provenienza). Questi
            servizi sono forniti da Vercel Inc. e sono configurati per
            rispettare la privacy dell'utente. Vercel Analytics non utilizza
            cookie lato client per il tracciamento predefinito e raccoglie dati
            in forma aggregata e anonima. Per maggiori informazioni su come
            Vercel tratta i dati, ti invitiamo a consultare la loro{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Informativa sulla Privacy
            </a>
            e la documentazione specifica sui loro servizi di analytics.
          </li>
        </ul>
        <p>
          Per informazioni dettagliate sui cookie utilizzati, consulta la nostra{" "}
          <Link href="/cookie-policy" className="text-primary hover:underline">
            Cookie Policy
          </Link>
          .
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          4. Finalità del Trattamento
        </h2>
        <p>
          I dati di navigazione anonimi raccolti tramite Vercel Analytics
          vengono utilizzati esclusivamente per:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Analizzare l'utilizzo del Sito per migliorarne contenuti e
            funzionalità.
          </li>
          <li>Monitorare le prestazioni tecniche del Sito.</li>
        </ul>
        <p>
          Eventuali dati personali forniti volontariamente tramite email o
          telefono verranno utilizzati esclusivamente per rispondere alle tue
          richieste.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          5. Base Giuridica del Trattamento
        </h2>
        <p>
          Il trattamento dei dati di navigazione anonimi per Vercel Analytics si
          basa sul nostro legittimo interesse a migliorare il Sito e i nostri
          servizi. Per l'utilizzo di cookie non strettamente necessari, ci
          basiamo sul tuo consenso (vedi Cookie Policy).
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          6. Condivisione dei Dati
        </h2>
        <p>
          Non condividiamo i tuoi dati personali con terze parti, a meno che non
          sia strettamente necessario per adempiere a obblighi di legge o per
          rispondere alle tue richieste (ad esempio, se ci contatti per un
          servizio che richiede l'intervento di un fornitore esterno, previo tuo
          consenso). I dati raccolti da Vercel sono gestiti da Vercel Inc.
          secondo le loro policy.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          7. Diritti dell'Interessato
        </h2>
        <p>
          In base al GDPR, hai il diritto di accedere ai tuoi dati, richiederne
          la rettifica, la cancellazione, la limitazione del trattamento, o
          opporti al loro trattamento. Poiché questo Sito non raccoglie
          attivamente dati personali identificativi, l'esercizio di tali diritti
          potrebbe essere limitato. Tuttavia, per qualsiasi richiesta o domanda
          relativa alla tua privacy, puoi contattarci ai recapiti indicati nella
          sezione "Titolare del Trattamento".
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold">
          8. Modifiche a questa Informativa
        </h2>
        <p>
          Ci riserviamo il diritto di modificare questa informativa sulla
          privacy in qualsiasi momento. Eventuali modifiche saranno pubblicate
          su questa pagina con l'indicazione della data di ultimo aggiornamento.
          Ti invitiamo a consultare regolarmente questa informativa.
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
