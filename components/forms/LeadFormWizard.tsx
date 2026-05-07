'use client';

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  AlignJustify,
  ArrowUpFromLine,
  Check,
  CheckCircle2,
  HelpCircle,
  LayoutGrid,
  Layers,
  Package,
  Sparkles,
  TreePine,
  type LucideIcon,
} from 'lucide-react';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';
import { trackConversion } from '@/lib/analytics';
import { companyConfig } from '@/lib/company';

const initialState: CreateLeadState = { status: 'idle' };

type FloorType = {
  value: string;
  service_slug: string;
  label: string;
  sub: string;
  Icon: LucideIcon;
};

type BrandOpt = {
  id: string;
  slug: string;
  name: string;
  logo_url?: string | null;
  products: Array<{
    id: string;
    slug: string;
    name: string;
    hero_image?: string | null;
    specs?: Record<string, string> | null;
  }>;
};

const FLOOR_TYPES: FloorType[] = [
  {
    value: 'pvc',
    service_slug: 'pvc-vloeren',
    label: 'PVC Vloeren',
    sub: 'Stijlvol en onderhoudsvriendelijk',
    Icon: LayoutGrid,
  },
  {
    value: 'traditioneel',
    service_slug: 'traditioneel-parket',
    label: 'Traditioneel Parket',
    sub: 'Tijdloze warmte van echt hout',
    Icon: TreePine,
  },
  {
    value: 'multiplanken',
    service_slug: 'multiplanken',
    label: 'Multiplanken',
    sub: 'Brede planken, robuuste look',
    Icon: AlignJustify,
  },
  {
    value: 'laminaat',
    service_slug: 'laminaat',
    label: 'Laminaat',
    sub: 'Betaalbaar en duurzaam',
    Icon: Layers,
  },
  {
    value: 'traprenovatie',
    service_slug: 'traprenovatie',
    label: 'Traprenovatie',
    sub: 'Geef uw trap een nieuw leven',
    Icon: ArrowUpFromLine,
  },
  {
    value: 'schuren',
    service_slug: 'schuren-onderhoud',
    label: 'Schuren & Onderhoud',
    sub: 'Maak uw vloer weer als nieuw',
    Icon: Sparkles,
  },
  {
    value: 'anders',
    service_slug: '',
    label: 'Anders / weet ik nog niet',
    sub: 'We helpen je graag verder',
    Icon: HelpCircle,
  },
];

const NOG_GEEN_IDEE = 'nog-geen-idee' as const;
const STEP_LABELS = [
  'Type Vloer',
  'Kies Merk',
  'Kies Variant',
  'Oppervlakte',
  'Contactgegevens',
] as const;

export function LeadFormWizard() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);

  const [step, setStep] = useState(1);
  const [floorValue, setFloorValue] = useState('');
  const [brandSlug, setBrandSlug] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [area, setArea] = useState(50);
  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [brands, setBrands] = useState<BrandOpt[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  // URL prefill: read query params once on mount
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (prefilledRef.current) return;
    prefilledRef.current = true;
    const urlFloor = searchParams.get('floor_type') ?? '';
    const urlBrand = searchParams.get('brand') ?? '';
    const urlProduct = searchParams.get('product') ?? '';
    if (urlFloor) setFloorValue(urlFloor);
    if (urlBrand) setBrandSlug(urlBrand);
    if (urlProduct) setProductSlug(urlProduct);
    // Decide initial step based on what is provided
    // - no floor → 1 (even if brand provided, we need floor first)
    // - floor 'anders' → 4 (no service, brand step is skipped)
    // - floor only → 2
    // - floor+brand → 3
    // - floor+brand+product → 4
    if (urlFloor && urlBrand && urlProduct) setStep(4);
    else if (urlFloor === 'anders') setStep(4);
    else if (urlFloor && urlBrand) setStep(3);
    else if (urlFloor) setStep(2);
    else setStep(1);
  }, [searchParams]);

  const floorEntry = useMemo(
    () => FLOOR_TYPES.find((f) => f.value === floorValue),
    [floorValue],
  );
  const serviceSlug = floorEntry?.service_slug ?? '';

  // Fetch brands when serviceSlug changes
  useEffect(() => {
    if (!serviceSlug) {
      setBrands([]);
      setBrandsLoading(false);
      return;
    }
    let cancelled = false;
    setBrandsLoading(true);
    fetch(`/api/brands/by-service?service=${encodeURIComponent(serviceSlug)}`)
      .then((r) => r.json())
      .then((data: { brands?: BrandOpt[] }) => {
        if (cancelled) return;
        setBrands(data.brands ?? []);
        setBrandsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setBrands([]);
        setBrandsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serviceSlug]);

  const selectedBrand = useMemo(() => {
    if (!brandSlug || brandSlug === NOG_GEEN_IDEE) return undefined;
    return brands.find((b) => b.slug === brandSlug);
  }, [brands, brandSlug]);

  const selectedProduct = useMemo(() => {
    if (!productSlug || productSlug === NOG_GEEN_IDEE) return undefined;
    return selectedBrand?.products.find((p) => p.slug === productSlug);
  }, [selectedBrand, productSlug]);

  // Skip-aware navigation helpers
  const skipBrandStep = () => floorValue === 'anders' || (!brandsLoading && brands.length === 0);
  const skipVariantStep = () =>
    brandSlug === NOG_GEEN_IDEE || !selectedBrand || selectedBrand.products.length === 0;

  const nextStep = (s: number): number => {
    let n = s + 1;
    if (n === 2 && skipBrandStep()) n = 3;
    if (n === 3 && skipVariantStep()) n = 4;
    return Math.min(n, 5);
  };
  const prevStep = (s: number): number => {
    let n = s - 1;
    if (n === 3 && skipVariantStep()) n = 2;
    if (n === 2 && skipBrandStep()) n = 1;
    return Math.max(n, 1);
  };

  const canAdvance = (s: number): boolean => {
    if (s === 1) return Boolean(floorValue);
    if (s === 2) return Boolean(brandSlug);
    if (s === 3) return Boolean(productSlug);
    if (s === 4) return area > 0;
    return true;
  };

  const handleFloorPick = (value: string) => {
    setFloorValue(value);
    // Reset downstream state when changing floor
    setBrandSlug('');
    setProductSlug('');
  };

  const handleBrandPick = (slug: string) => {
    setBrandSlug(slug);
    setProductSlug('');
  };

  const goNext = () => setStep((s) => nextStep(s));
  const goPrev = () => setStep((s) => prevStep(s));

  // Track conversion on success
  useEffect(() => {
    if (state.status === 'success') {
      trackConversion({
        name: 'lead_submit',
        source: 'quote-wizard',
        brand: brandSlug && brandSlug !== NOG_GEEN_IDEE ? brandSlug : undefined,
        product: productSlug && productSlug !== NOG_GEEN_IDEE ? productSlug : undefined,
      });
    }
  }, [state.status, brandSlug, productSlug]);

  const isSuccess = state.status === 'success';

  // For the sidebar: if success, show all 5 steps as completed
  const sidebarStep = isSuccess ? 6 : step;

  return (
    <>
      <Sidebar currentStep={sidebarStep} serviceLabel="" />
      <main className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col">
        {isSuccess ? (
          <SuccessPane />
        ) : (
          <>
            <div className="flex-1">
              {step === 1 && <Step1 floorValue={floorValue} onPick={handleFloorPick} />}
              {step === 2 && (
                <Step2
                  brands={brands}
                  brandsLoading={brandsLoading}
                  brandSlug={brandSlug}
                  serviceLabel={floorEntry?.label ?? ''}
                  onPick={handleBrandPick}
                />
              )}
              {step === 3 && selectedBrand && (
                <Step3
                  brand={selectedBrand}
                  productSlug={productSlug}
                  onPick={(slug) => setProductSlug(slug)}
                />
              )}
              {step === 4 && (
                <Step4 area={area} onChange={setArea} />
              )}
              {step === 5 && (
                <Step5Form
                  floorEntry={floorEntry}
                  selectedBrand={selectedBrand}
                  selectedProduct={selectedProduct}
                  brandSlug={brandSlug}
                  productSlug={productSlug}
                  floorValue={floorValue}
                  area={area}
                  voornaam={voornaam}
                  setVoornaam={setVoornaam}
                  achternaam={achternaam}
                  setAchternaam={setAchternaam}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  message={message}
                  setMessage={setMessage}
                  formAction={formAction}
                  pending={pending}
                  errorMessage={state.status === 'error' ? state.message : undefined}
                  onPrev={goPrev}
                />
              )}
            </div>

            {step !== 5 && (
              <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="text-sm font-medium text-brand-dark/60 hover:text-brand-dark transition-colors"
                  >
                    &larr; Vorige stap
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance(step)}
                  className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Volgende stap &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

// --- Sidebar ----------------------------------------------------------------

function Sidebar({
  currentStep,
  serviceLabel,
}: {
  currentStep: number;
  serviceLabel: string;
}) {
  return (
    <aside className="w-full lg:w-1/3 bg-gray-50 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
      <div>
        {serviceLabel ? (
          <p className="text-brand-red font-bold tracking-wide text-sm uppercase mb-3">
            {serviceLabel}
          </p>
        ) : null}
        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark">Jouw Offerte</h2>
        <p className="text-sm text-brand-dark/60 mt-2 mb-10">
          Stel eenvoudig je ideale droomvloer samen. Wij maken een prijsindicatie op maat.
        </p>

        <ul className="space-y-5">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-brand-red text-white'
                      : isCompleted
                        ? 'bg-brand-dark text-white'
                        : 'bg-gray-200 text-gray-500',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check size={16} /> : stepNum}
                </span>
                <span
                  className={[
                    'text-sm',
                    isActive
                      ? 'font-bold text-brand-dark'
                      : isCompleted
                        ? 'font-medium text-brand-dark/70'
                        : 'text-gray-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-12">
        <p className="text-xs font-bold uppercase text-brand-red tracking-wide mb-2">
          Heb je een vraag?
        </p>
        <p className="text-sm font-bold text-brand-dark">{companyConfig.contact.phone}</p>
        <p className="text-sm text-brand-dark/60">{companyConfig.contact.email}</p>
      </div>
    </aside>
  );
}

// --- Step 1: Type Vloer -----------------------------------------------------

function Step1({
  floorValue,
  onPick,
}: {
  floorValue: string;
  onPick: (v: string) => void;
}) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
        Waar ben je naar op zoek?
      </h1>
      <p className="text-base text-brand-dark/60 mt-2">
        Kies de hoofdcategorie van je gewenste renovatie.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {FLOOR_TYPES.map((t) => {
          const selected = t.value === floorValue;
          const Icon = t.Icon;
          return (
            <button
              type="button"
              key={t.value}
              onClick={() => onPick(t.value)}
              aria-pressed={selected}
              className={[
                'relative text-left p-6 rounded-2xl border-2 transition-all',
                selected
                  ? 'border-brand-red bg-brand-red/5'
                  : 'border-gray-200 hover:border-brand-red/40 bg-white',
              ].join(' ')}
            >
              {selected && (
                <CheckCircle2
                  className="absolute top-3 right-3 text-brand-red"
                  size={20}
                  aria-hidden
                />
              )}
              <span
                className={[
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  selected ? 'bg-brand-red text-white' : 'bg-gray-100 text-brand-dark/60',
                ].join(' ')}
              >
                <Icon size={24} aria-hidden />
              </span>
              <p className="text-lg font-bold text-brand-dark mt-6">{t.label}</p>
              <p className="text-sm text-brand-dark/60 mt-1">{t.sub}</p>
            </button>
          );
        })}
      </div>
    </>
  );
}

// --- Step 2: Kies Merk ------------------------------------------------------

function Step2({
  brands,
  brandsLoading,
  brandSlug,
  serviceLabel,
  onPick,
}: {
  brands: BrandOpt[];
  brandsLoading: boolean;
  brandSlug: string;
  serviceLabel: string;
  onPick: (slug: string) => void;
}) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
        Heb je een voorkeur voor een merk?
      </h1>
      <p className="text-base text-brand-dark/60 mt-2">
        Kies een van onze {serviceLabel.toLowerCase() || 'vloer'} merken of sla deze stap over.
      </p>

      {brandsLoading ? (
        <p className="mt-10 text-sm text-brand-dark/60">Merken laden…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {brands.map((b) => {
            const selected = brandSlug === b.slug;
            return (
              <button
                type="button"
                key={b.slug}
                onClick={() => onPick(b.slug)}
                aria-pressed={selected}
                className={[
                  'aspect-[3/2] flex items-center justify-center bg-white rounded-2xl border-2 p-6 transition-all',
                  selected
                    ? 'border-brand-red bg-brand-red/5'
                    : 'border-gray-200 hover:border-brand-red/40',
                ].join(' ')}
              >
                {b.logo_url ? (
                  <Image
                    src={b.logo_url}
                    alt={b.name}
                    width={140}
                    height={70}
                    className="object-contain max-h-12 w-auto"
                  />
                ) : (
                  <span className="text-xl font-bold text-brand-dark text-center">{b.name}</span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPick(NOG_GEEN_IDEE)}
            aria-pressed={brandSlug === NOG_GEEN_IDEE}
            className={[
              'aspect-[3/2] flex flex-col items-center justify-center bg-white rounded-2xl border-2 p-6 transition-all',
              brandSlug === NOG_GEEN_IDEE
                ? 'border-brand-red bg-brand-red/5'
                : 'border-gray-200 hover:border-brand-red/40',
            ].join(' ')}
          >
            <Package size={32} className="text-gray-400 mb-2" aria-hidden />
            <span className="text-sm font-bold text-brand-dark">Nog geen idee</span>
          </button>
        </div>
      )}
    </>
  );
}

// --- Step 3: Kies Variant ---------------------------------------------------

function Step3({
  brand,
  productSlug,
  onPick,
}: {
  brand: BrandOpt;
  productSlug: string;
  onPick: (slug: string) => void;
}) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Kies de uitstraling!</h1>
      <p className="text-base text-brand-dark/60 mt-2">
        Welke collectie of specifieke variant van {brand.name} vind je het mooist?
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {brand.products.map((p) => {
          const selected = productSlug === p.slug;
          const sub =
            (p.specs && (p.specs.Legsysteem ?? p.specs.legsysteem)) || 'Bekijk variant';
          return (
            <button
              type="button"
              key={p.slug}
              onClick={() => onPick(p.slug)}
              aria-pressed={selected}
              className={[
                'text-left rounded-2xl border-2 overflow-hidden bg-white transition-all',
                selected
                  ? 'border-brand-red'
                  : 'border-gray-200 hover:border-brand-red/40',
              ].join(' ')}
            >
              <div className="aspect-[4/3] relative bg-gray-200">
                {p.hero_image ? (
                  <Image
                    src={p.hero_image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <p className="font-bold text-brand-dark">{p.name}</p>
                <p className="text-xs uppercase text-brand-dark/50 tracking-wide mt-1">
                  {sub}
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPick(NOG_GEEN_IDEE)}
          aria-pressed={productSlug === NOG_GEEN_IDEE}
          className={[
            'flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-8 transition-all',
            productSlug === NOG_GEEN_IDEE
              ? 'border-brand-red bg-brand-red/5'
              : 'border-gray-200 hover:border-brand-red/40',
          ].join(' ')}
        >
          <Package size={32} className="text-gray-400 mb-2" aria-hidden />
          <span className="text-sm font-bold text-brand-dark">Nog geen idee</span>
        </button>
      </div>
    </>
  );
}

// --- Step 4: Oppervlakte ----------------------------------------------------

function Step4({
  area,
  onChange,
}: {
  area: number;
  onChange: (n: number) => void;
}) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
        Hoe groot is de oppervlakte?
      </h1>
      <p className="text-base text-brand-dark/60 mt-2">
        Geef een schatting van het aantal vierkante meters in totaal.
      </p>

      <div className="text-center py-12">
        <span className="text-7xl md:text-8xl font-bold text-brand-red">{area}</span>
        <span className="text-2xl text-brand-red/70 ml-2">m&sup2;</span>
      </div>

      <div>
        <label htmlFor="area-slider" className="sr-only">
          Oppervlakte in m&sup2;
        </label>
        <input
          id="area-slider"
          type="range"
          min={10}
          max={500}
          step={5}
          value={area}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
          className="w-full accent-brand-red"
        />
        <div className="flex justify-between text-xs text-brand-dark/60 mt-2">
          <span>10 M&sup2;</span>
          <span>250 M&sup2;</span>
          <span>500+ M&sup2;</span>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <CheckCircle2
          className="text-blue-500 mt-0.5 shrink-0"
          size={20}
          aria-hidden
        />
        <div>
          <p className="font-bold text-brand-dark">Meerdere ruimtes of trappen?</p>
          <p className="text-sm text-brand-dark/70 mt-1">
            Je kunt dit straks in de laatste stap eenvoudig doorgeven via het opmerkingenveld!
          </p>
        </div>
      </div>
    </>
  );
}

// --- Step 5: Contactgegevens ------------------------------------------------

type Step5Props = {
  floorEntry: FloorType | undefined;
  selectedBrand: BrandOpt | undefined;
  selectedProduct: BrandOpt['products'][number] | undefined;
  brandSlug: string;
  productSlug: string;
  floorValue: string;
  area: number;
  voornaam: string;
  setVoornaam: (v: string) => void;
  achternaam: string;
  setAchternaam: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  formAction: (formData: FormData) => void;
  pending: boolean;
  errorMessage?: string;
  onPrev: () => void;
};

function Step5Form(props: Step5Props) {
  const {
    floorEntry,
    selectedBrand,
    selectedProduct,
    brandSlug,
    productSlug,
    floorValue,
    area,
    voornaam,
    setVoornaam,
    achternaam,
    setAchternaam,
    email,
    setEmail,
    phone,
    setPhone,
    message,
    setMessage,
    formAction,
    pending,
    errorMessage,
    onPrev,
  } = props;

  const showChip = Boolean(floorEntry);
  const showBrandChip =
    Boolean(selectedBrand) && brandSlug !== NOG_GEEN_IDEE;
  const showProductChip =
    Boolean(selectedProduct) && productSlug !== NOG_GEEN_IDEE;

  return (
    <form action={formAction} className="flex flex-col flex-1">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0"
        aria-hidden
      />
      <input type="hidden" name="source" value="quote-wizard" />
      <input
        type="hidden"
        name="brand_id"
        value={selectedBrand && brandSlug !== NOG_GEEN_IDEE ? selectedBrand.id : ''}
      />
      <input
        type="hidden"
        name="product_id"
        value={selectedProduct && productSlug !== NOG_GEEN_IDEE ? selectedProduct.id : ''}
      />
      <input type="hidden" name="floor_type" value={floorValue} />
      <input type="hidden" name="area_size" value={String(area)} />
      <input
        type="hidden"
        name="name"
        value={`${voornaam} ${achternaam}`.trim()}
      />

      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
          Bijna klaar! &#127881;
        </h1>
        <p className="text-base text-brand-dark/60 mt-2">
          Laat je gegevens achter en we maken een prachtige offerte op maat voor je.
        </p>

        {showChip && floorEntry && (
          <div className="bg-gray-50 rounded-xl p-4 mt-6 text-sm">
            <span className="text-brand-dark/50 uppercase font-bold tracking-wide mr-2">
              Keuze:
            </span>
            <span className="font-bold text-brand-dark">{floorEntry.label}</span>
            {showBrandChip && selectedBrand && (
              <>
                <span className="text-brand-dark/30 mx-2">/</span>
                <span className="font-bold text-brand-dark">{selectedBrand.name}</span>
              </>
            )}
            {showProductChip && selectedProduct && (
              <>
                <span className="text-brand-dark/30 mx-2">/</span>
                <span className="font-bold text-brand-red">{selectedProduct.name}</span>
              </>
            )}
            <span className="text-brand-dark/30 mx-2">/</span>
            <span className="font-bold text-brand-dark">{area} m&sup2;</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Field
            id="wiz-voornaam"
            label="Voornaam *"
            value={voornaam}
            onChange={setVoornaam}
            autoComplete="given-name"
            required
          />
          <Field
            id="wiz-achternaam"
            label="Achternaam *"
            value={achternaam}
            onChange={setAchternaam}
            autoComplete="family-name"
            required
          />
        </div>

        <div className="mt-4">
          <Field
            id="wiz-email"
            label="Emailadres *"
            type="email"
            name="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
        </div>

        <div className="mt-4">
          <Field
            id="wiz-phone"
            label="Telefoonnummer *"
            type="tel"
            name="phone"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
            required
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="wiz-message"
            className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2"
          >
            Aanvullende wensen (optioneel)
          </label>
          <textarea
            id="wiz-message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bijv. plinten gewenst, we hebben vloerverwarming, etc..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-brand-red outline-none transition-colors"
          />
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="text-sm text-red-700 mt-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
        <button
          type="button"
          onClick={onPrev}
          className="text-sm font-medium text-brand-dark/60 hover:text-brand-dark transition-colors"
        >
          &larr; Vorige stap
        </button>
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-red text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {pending ? 'Versturen…' : 'Verstuur aanvraag'}
        </button>
      </div>
    </form>
  );
}

// --- Field helper ----------------------------------------------------------

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  name,
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-brand-red outline-none transition-colors"
      />
    </div>
  );
}

// --- Success pane -----------------------------------------------------------

function SuccessPane() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 text-center max-w-lg">
        <h2 className="text-3xl font-bold text-brand-dark">Bedankt! &#127881;</h2>
        <p className="mt-4 text-brand-dark/70">
          We hebben je aanvraag ontvangen en nemen binnen 24 uur contact met je op.
        </p>
      </div>
    </div>
  );
}
