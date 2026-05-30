import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HeroSequence = lazy(() => import("@/components/HeroSequence"));
const SectionReveal = lazy(() => import("@/components/SectionReveal"));
import Tilt3D from "@/components/Tilt3D";


export const Route = createFileRoute("/")({
  component: Index,
});

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2rdh8-Ko9V-8xu6VG9x-HcgEtny8BeGhfXJnhLtIwCYcdp-eAXEMjxEuJqDnReJ0PvZnPO7QqBfFQPXlUAA8bhylguar0opDd1xa5U4AWCVAeEEs6vd-rQDNB7ZSuwrDEY6fS6HbCVQpIqt7NIPlDgMob7qyoBPs62NESlgbhizfkGQ2LYggQfg34SyL49hMd4FKZurtt5AqmRxOmMiIFPvMIi_yTn93Uo68DZTd1buBmPPaUDB_8WxUZ97I8kivsGzUrXqsyV49";
const SUCC_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqMQaTdxXuizkRkm_PlwB6wuOyP1di6EmVKa6W3Q65MxUJqrhOyMCMWZjhmB2_046mYAB2XME88cogEqu4wNsTqPwniJDP6AH4GzEOr5DXnyxRLozAzW754pSr1cpwUkTunLA82J125nGooNA4qvWO9nYkdl_2kg4w0_GxhEUd3c_PMrdM-DhFchL3s4OVN91au5Tozh-LRENr9VvFG_L7j2KjfXyhPNzs0Zcu2ncbzDF06efKfj45vU3iv27EtBHug22m1TioX0o8";
const LEAF_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmgFdSZ6JBgvLfNmkMWdCsKdqxIR1WsPx4nSdQF2PhTTHr2FrC67PwgGQ0l1J8YqBaJm9cuH4mJommgTeWtaJP-rFmdM__ZNFT_CZhTYDOtnDaXUwicQ0OWK6mbAvPePFQwc8IOz7wPeEBwtrqxM3UJl6cb7Rr4oXwNiQhgt1IMaxYo7z45KeT3FLOyt22NgMtwRFk5x9T4FlKY8ik7vwIUXF2FOcsEGt-8ZEyHweRlztTbUcx48m01Uk_6s4sFDEYNmbhOv5Xl9oD";

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
    >
      {name}
    </span>
  );
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

/* ── Testimonial data ───────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "We believe every person deserves to live surrounded by nature — and we make that effortlessly possible.",
    highlight: "effortlessly possible",
    name: "Aria Chen",
    role: "Co-founder & CEO",
    icon: "person",
    accent: "text-leaf",
  },
  {
    quote: "VerdantAI identified my rare Alocasia in seconds. I've tried five other apps — nothing comes close to this accuracy.",
    highlight: "nothing comes close",
    name: "Maya Patel",
    role: "Verified User · ★★★★★",
    icon: "yard",
    accent: "text-coral",
  },
  {
    quote: "The watering reminders literally saved my entire collection last summer. It feels like having a personal botanist on call.",
    highlight: "personal botanist on call",
    name: "James Okafor",
    role: "Urban Garden Enthusiast",
    icon: "water_drop",
    accent: "text-leaf",
  },
  {
    quote: "I manage 200+ plants across two locations. VerdantAI's garden dashboard is the only tool that keeps me sane.",
    highlight: "keeps me sane",
    name: "Sofia Reyes",
    role: "Plant Shop Owner",
    icon: "storefront",
    accent: "text-coral",
  },
  {
    quote: "Within 48 hours of installing VerdantAI, the AI diagnosed root rot in my Pothos and gave me a step-by-step rescue plan.",
    highlight: "step-by-step rescue plan",
    name: "Luca Bianchi",
    role: "Verified User · ★★★★★",
    icon: "health_and_safety",
    accent: "text-leaf",
  },
];

/* ── Testimonial Carousel ───────────────────────────────────────────────── */
function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const total = TESTIMONIALS.length;

  // Refs so the interval callback always reads the latest values
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const pausedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { animatingRef.current = animating; }, [animating]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const goTo = (idx: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setAnimating(true);
    setTimeout(() => {
      activeRef.current = idx;
      setActive(idx);
      animatingRef.current = false;
      setAnimating(false);
    }, 350);
  };

  // Single interval — set up once on mount, loops forever via refs
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current || animatingRef.current) return;
      const next = (activeRef.current + 1) % total;
      animatingRef.current = true;
      setAnimating(true);
      setTimeout(() => {
        activeRef.current = next;
        setActive(next);
        animatingRef.current = false;
        setAnimating(false);
      }, 350);
    }, 3000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = TESTIMONIALS[active];

  /* Highlight helper */
  const renderQuote = (quote: string, highlight: string, accentClass: string) => {
    const parts = quote.split(highlight);
    if (parts.length < 2) return <>{quote}</>;
    return (
      <>
        {parts[0]}
        <em className={`italic not-italic font-semibold ${accentClass}`}>{highlight}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className="relative rounded-[2.5rem] bg-sand/30 border border-sand/60 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative rings */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-leaf/20 pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full border border-leaf/15 pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-surface-variant/40">
        <div
          key={active}
          className="h-full bg-leaf/60 rounded-full"
          style={{
            animation: paused ? "none" : "progress-bar 3s linear forwards",
          }}
        />
      </div>

      {/* Slide content */}
      <div
        className="px-10 py-12 md:px-20 md:py-16 relative z-10"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Quote icon */}
        <span
          className="material-symbols-outlined !text-5xl text-leaf/40 mb-4 block"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
        >
          format_quote
        </span>

        <blockquote
          className="text-2xl md:text-4xl text-primary leading-snug mb-8 max-w-3xl"
          style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
        >
          "{renderQuote(t.quote, t.highlight, t.accent)}"
        </blockquote>

        {/* Author row + dots in one flex line */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span
                className="material-symbols-outlined !text-lg"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
              >
                {t.icon}
              </span>
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-primary">{t.name}</p>
              <p className="text-xs text-on-surface-variant font-display tracking-widest uppercase">{t.role}</p>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === active ? "28px" : "8px",
                  height: "8px",
                  background: i === active ? "var(--color-primary)" : "var(--color-primary)",
                  opacity: i === active ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Contact Section Component ──────────────────────────────────────────── */
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <SectionReveal id="contact" className="py-12 md:py-24 border-t border-surface-variant/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left Side: Editorial context & Details */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
          <span className="self-start inline-block text-coral font-display font-semibold tracking-[0.3em] text-xs uppercase">
            Get In Touch
          </span>
          <h2
            className="text-[40px] leading-[1.05] md:text-[68px] md:leading-[1.02] text-primary tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            Start a conversation with our <em className="italic text-leaf">experts</em>
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Have questions about tailored botanical diagnostics, enterprise custom solutions, or general garden management assistance? Reach out and watch your garden thrive.
          </p>

          {/* Quick contact details grid */}
          <div className="flex flex-col gap-4 mt-4">
            {[
              { icon: "mail", label: "Email us", value: "hello@verdantai.com" },
              { icon: "call", label: "Call us", value: "+1 (800) 555-LEAF" },
              { icon: "location_on", label: "Visit our greenhouse", value: "San Francisco, CA" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-sand/20 border border-sand/40 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <Icon name={item.icon} className="!text-xl" />
                </div>
                <div>
                  <p className="text-xs font-display tracking-widest text-on-surface-variant/60 uppercase">{item.label}</p>
                  <p className="font-semibold text-primary">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Premium Form Card */}
        <div className="lg:col-span-7">
          <div className="relative bg-surface-container-lowest rounded-[2.5rem] p-8 md:p-12 border border-surface-variant/60 shadow-[0_30px_70px_rgba(26,77,46,0.06)] overflow-hidden">
            {/* Top glowing/decorative blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sand/20 rounded-full blur-3xl pointer-events-none" />
            
            {status === "success" ? (
              <div className="text-center py-16 px-4 space-y-6 animate-fade-in relative z-10">
                <div className="w-20 h-20 bg-leaf/10 text-leaf border border-leaf/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-up">
                  <Icon name="check_circle" className="!text-5xl" />
                </div>
                <h3
                  className="text-4xl text-primary"
                  style={{ fontFamily: "'Instrument Serif', serif'", fontWeight: 400 }}
                >
                  Your message has taken root!
                </h3>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-primary">{formData.name}</span>. Our specialist team of botanists has received your query and will contact you via <span className="font-semibold text-primary">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setFormData({ name: "", email: "", phone: "", message: "" });
                    setStatus("idle");
                  }}
                  className="mt-6 border border-primary text-primary font-display font-semibold text-sm tracking-wider px-8 py-3 rounded-full hover:bg-primary hover:text-on-primary transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <h3
                    className="text-3xl text-primary"
                    style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
                  >
                    Send us a message
                  </h3>
                  <p className="text-sm text-on-surface-variant/80">We would love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="form-name" className="block text-xs font-display tracking-wider text-primary font-semibold uppercase">
                      Full Name *
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-surface-container/50 border border-surface-variant/70 rounded-xl px-5 py-3.5 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body text-base"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="form-email" className="block text-xs font-display tracking-wider text-primary font-semibold uppercase">
                      Email Address *
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. hello@domain.com"
                      className="w-full bg-surface-container/50 border border-surface-variant/70 rounded-xl px-5 py-3.5 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body text-base"
                    />
                  </div>
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label htmlFor="form-phone" className="block text-xs font-display tracking-wider text-primary font-semibold uppercase">
                    Phone Number
                  </label>
                  <input
                    id="form-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full bg-surface-container/50 border border-surface-variant/70 rounded-xl px-5 py-3.5 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body text-base"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="form-message" className="block text-xs font-display tracking-wider text-primary font-semibold uppercase">
                    Your Message *
                    </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your garden or inquiry..."
                    className="w-full bg-surface-container/50 border border-surface-variant/70 rounded-xl px-5 py-3.5 text-primary placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body text-base resize-none"
                  />
                </div>

                {/* Submit button with progress state */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-coral text-coral-foreground font-display font-semibold text-sm tracking-wider py-4 rounded-full hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(210,118,133,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="animate-spin border-2 border-coral-foreground border-t-transparent rounded-full w-4 h-4" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Icon name="send" className="!text-sm" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}


function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased pt-24">
      <nav className="bg-surface/80 backdrop-blur-md shadow-[0_4px_20px_rgba(26,77,46,0.05)] fixed top-0 inset-x-0 z-50">
        <div className="max-w-[1520px] mx-auto flex justify-between items-center px-8 lg:px-12 py-4">
          <div className="font-display text-2xl font-semibold text-primary tracking-tight">
            VerdantAI
          </div>
          <div className="hidden md:flex items-center space-x-8 font-display text-sm">
            <a className="text-primary font-semibold border-b-2 border-primary pb-1" href="#features">Features</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#about">About</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#contact">Contact</a>
          </div>
          <button className="bg-coral text-coral-foreground font-display font-semibold text-sm tracking-wider px-6 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all hidden md:block">
            Download Now
          </button>
          <button className="md:hidden text-primary">
            <Icon name="menu" />
          </button>
        </div>
      </nav>

      <ClientOnly>
        <Suspense fallback={<div className="h-screen w-full bg-sand/30" />}>
          <HeroSequence />
        </Suspense>
      </ClientOnly>

      {/* ── Hero copy — below the video banner ──────────────────────── */}
      <div className="w-full max-w-[1520px] mx-auto px-8 lg:px-12 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-display font-bold text-[48px] leading-[1.08] md:text-[80px] md:leading-[1.02] tracking-tight text-primary">
            Identify every leaf,{" "}
            <em className="not-italic text-leaf">grow every garden.</em>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl mx-auto">
            AI-powered plant identification and garden management in the palm of your hand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
            <button className="bg-coral text-coral-foreground font-display font-semibold text-sm tracking-wider px-10 py-5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-[0_8px_24px_rgba(210,118,133,0.3)]">
              Download for iOS
            </button>
            <button className="border-2 border-primary text-primary font-display font-semibold text-sm tracking-wider px-10 py-5 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
              Watch Video
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-[1520px] mx-auto px-8 lg:px-12">
        <ClientOnly>
        <Suspense fallback={null}>

        <SectionReveal id="features" className="relative py-16 md:py-24 my-12 rounded-[3.5rem] overflow-hidden border border-surface-variant/40 bg-surface/30 px-6 md:px-16">
          {/* Elegant background foliage watermark */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none select-none"
            style={{ backgroundImage: "url('/features-bg.png')" }}
          />

          {/* Ambient glowing lights */}
          <div className="absolute -left-20 top-1/4 w-[30rem] h-[30rem] bg-leaf/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-20 bottom-1/4 w-[35rem] h-[35rem] bg-sand/30 rounded-full blur-3xl pointer-events-none" />

          {/* Minimal botanical rings */}
          <div className="absolute -left-12 -top-12 w-80 h-80 rounded-full border border-leaf/15 pointer-events-none" />
          <div className="absolute right-12 bottom-12 w-[28rem] h-[28rem] rounded-full border border-sand/40 pointer-events-none" />

          <div className="relative z-10 text-center mb-20">
            <span className="inline-block text-coral font-display font-semibold tracking-[0.3em] text-xs uppercase mb-5">
              Features
            </span>
            <h2
              className="text-[44px] leading-[1.05] md:text-[80px] md:leading-[1.02] text-primary mb-6 tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
            >
              Nurture Your <em className="italic text-leaf">Digital Forest</em>
            </h2>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Everything you need to turn your living space into a thriving botanical sanctuary.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "1400px" }}>
            {[
              { icon: "energy_savings_leaf", title: "AI Identification", body: "Instantly identify thousands of plants, trees, and flowers with unprecedented accuracy using our advanced botanical AI." },
              { icon: "calendar_month", title: "Garden Management", body: "Track watering schedules, monitor sunlight exposure, and receive timely notifications for fertilizing and repotting.", decorated: true },
              { icon: "smart_toy", title: "AI Plant Assistant", body: "Got a sick plant? Chat with our AI assistant to diagnose issues, get treatment plans, and receive expert care advice." },
            ].map((f, i) => (
              <Tilt3D key={f.title} max={8} lift={20} className={`rounded-[2.5rem] ${i === 1 ? "md:translate-y-8" : ""}`}>
                <div
                  className="group relative bg-surface-container-lowest rounded-[2.5rem] p-10 border border-surface-variant/60 shadow-[0_8px_30px_rgba(26,77,46,0.04)] hover:shadow-[0_40px_80px_rgba(26,77,46,0.18)] transition-shadow duration-500 overflow-hidden"
                >
                  {f.decorated && (
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sand/40 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                  )}
                  <div className="relative z-10" style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-sand/60 flex items-center justify-center text-leaf group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500" style={{ transform: "translateZ(30px)" }}>
                        <Icon name={f.icon} className="!text-3xl" />
                      </div>
                      <span className="font-display text-xs tracking-[0.25em] text-on-surface-variant/60">
                        0{i + 1}
                      </span>
                    </div>
                    <h3
                      className="text-3xl md:text-4xl text-primary mb-4"
                      style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, transform: "translateZ(25px)" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-base text-on-surface-variant leading-relaxed">{f.body}</p>
                    <div className="mt-8 flex items-center gap-2 text-leaf font-display text-sm font-semibold tracking-wider opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                      LEARN MORE
                      <Icon name="arrow_forward" className="!text-lg" />
                    </div>
                  </div>
                </div>
              </Tilt3D>
            ))}

          </div>
        </SectionReveal>

        <SectionReveal id="gallery" className="py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="inline-block text-coral font-display font-semibold tracking-[0.3em] text-xs uppercase mb-5">
                Gallery
              </span>
              <h2
                className="text-[40px] leading-[1.05] md:text-[72px] md:leading-[1.02] text-primary tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                See VerdantAI <em className="italic text-leaf">in action</em>
              </h2>
            </div>
            <a
              href="#"
              className="self-start md:self-end inline-flex items-center gap-2 px-7 py-3 rounded-full border border-primary text-primary font-display font-semibold text-sm tracking-wider hover:bg-primary hover:text-on-primary transition-all"
            >
              Explore Gallery
              <Icon name="arrow_outward" className="!text-lg" />
            </a>
          </div>
          <div className="grid grid-cols-12 gap-4 md:gap-6" style={{ perspective: "1400px" }}>
            <Tilt3D max={6} lift={18} className="col-span-12 md:col-span-8 rounded-[2.5rem]">
              <div className="h-[420px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative group shadow-[0_30px_70px_rgba(26,77,46,0.18)]">
                <img alt="App overlay on succulents" src={SUCC_IMG} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10" style={{ transform: "translateZ(40px)" }}>
                  <span className="text-on-primary/70 font-display tracking-[0.25em] text-xs uppercase mb-3 block">
                    Featured
                  </span>
                  <h4
                    className="text-on-primary text-3xl md:text-5xl leading-tight"
                    style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
                  >
                    Instant <em className="italic">recognition</em>
                  </h4>
                  <p className="text-on-primary/80 mt-3 max-w-md">Scan any leaf, get a botanical match in seconds — 99% accuracy.</p>
                </div>
              </div>
            </Tilt3D>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6">
              <Tilt3D max={10} lift={20} className="rounded-[2.5rem]">
                <div className="h-[200px] md:h-[288px] rounded-[2.5rem] bg-primary text-on-primary p-10 flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-leaf/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative z-10 flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                    <Icon name="water_drop" className="!text-5xl text-sand" />
                    <span className="font-display text-xs tracking-[0.25em] opacity-60">SMART</span>
                  </div>
                  <div className="relative z-10" style={{ transform: "translateZ(35px)" }}>
                    <h4 className="text-3xl md:text-4xl leading-tight" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
                      Reminders that <em className="italic">grow</em> with you
                    </h4>
                  </div>
                </div>
              </Tilt3D>
              <Tilt3D max={10} lift={20} className="rounded-[2.5rem]">
                <div className="h-[200px] md:h-[288px] rounded-[2.5rem] overflow-hidden relative group shadow-[0_20px_50px_rgba(26,77,46,0.1)]">
                  <img alt="Indoor plant detail" src={LEAF_IMG} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Tilt3D>
            </div>
          </div>

        </SectionReveal>

        {/* ── About Section ─────────────────────────────────────────── */}
        <SectionReveal id="about" className="py-12 md:py-24">
          {/* Top label */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-block text-coral font-display font-semibold tracking-[0.3em] text-xs uppercase mb-4">
              Our Story
            </span>
            <h2
              className="text-[38px] leading-[1.05] md:text-[72px] md:leading-[1.02] text-primary tracking-tight max-w-3xl"
              style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
            >
              Born from a love of{" "}
              <em className="italic text-leaf">living things</em>
            </h2>
          </div>

          {/* Main split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            {/* Left — product image */}
            <Tilt3D max={6} lift={24} className="rounded-[2.5rem]">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(26,77,46,0.22)] group">
                <img
                  src="/about-hero.png"
                  alt="VerdantAI app surrounded by lush houseplants"
                  className="w-full h-[480px] lg:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-leaf/20" />
                {/* floating badge */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div className="bg-surface/80 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-surface-variant/40">
                    <p className="text-xs font-display tracking-[0.2em] text-on-surface-variant uppercase mb-1">Accuracy</p>
                    <p
                      className="text-3xl text-primary"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      99<span className="text-leaf text-xl">%</span>
                    </p>
                  </div>
                  <div className="bg-primary/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg">
                    <p className="text-xs font-display tracking-[0.2em] text-on-primary/70 uppercase mb-1">Plants identified</p>
                    <p
                      className="text-3xl text-on-primary"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      50<span className="text-sand text-xl">k+</span>
                    </p>
                  </div>
                </div>
              </div>
            </Tilt3D>

            {/* Right — copy + stats + callouts */}
            <div className="flex flex-col gap-8">
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
                VerdantAI started in a tiny apartment overflowing with plants and one persistent question —{" "}
                <em className="text-primary not-italic font-semibold">what is that?</em>{" "}
                We fused cutting-edge computer vision with the world's largest botanical database to give every plant
                parent a pocket-sized expert, available 24 / 7.
              </p>

              {/* Stat pills row */}
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "1M+", label: "Plant lovers" },
                  { value: "50k", label: "Species" },
                  { value: "4.9★", label: "App rating" },
                  { value: "< 2s", label: "Scan time" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 bg-sand/40 border border-sand/70 rounded-full px-5 py-2.5"
                  >
                    <span
                      className="text-lg font-bold text-primary"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs font-display tracking-[0.15em] text-on-surface-variant uppercase">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Two value-prop callout cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "psychiatry",
                    title: "AI-powered care",
                    body: "Our models are trained on 12 M+ botanical images and retrained monthly to stay ahead of seasonal changes and new cultivars.",
                    accent: "bg-leaf/10 border-leaf/30 text-leaf",
                  },
                  {
                    icon: "diversity_3",
                    title: "Community-driven",
                    body: "A global community of botanists, gardeners, and plant enthusiasts continuously curates and verifies every species entry.",
                    accent: "bg-coral/10 border-coral/30 text-coral",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-surface-variant/60 bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(26,77,46,0.04)] hover:shadow-[0_12px_40px_rgba(26,77,46,0.10)] transition-shadow duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${c.accent}`}>
                      <Icon name={c.icon} className="!text-xl" />
                    </div>
                    <h4
                      className="text-xl text-primary mb-2"
                      style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
                    >
                      {c.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>

              {/* CTA link */}
              <a
                href="#cta"
                className="self-start inline-flex items-center gap-2 text-primary font-display font-semibold text-sm tracking-wider border-b-2 border-primary/30 pb-0.5 hover:border-primary transition-colors duration-200"
              >
                Start growing with us
                <Icon name="arrow_forward" className="!text-lg" />
              </a>
            </div>
          </div>

          {/* Bottom — Testimonial Carousel */}
          <TestimonialCarousel />
        </SectionReveal>

        <SectionReveal id="cta" className="py-10 md:py-16 mb-12">
          <div className="relative bg-primary rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center overflow-hidden shadow-[0_30px_60px_rgba(26,77,46,0.25)]">
            <div className="absolute inset-0 opacity-[0.08] flex items-center justify-center pointer-events-none">
              <svg className="w-[140%] h-[140%]" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.2" />
                <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="0.2" />
                <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="0.2" />
                <circle cx="50" cy="50" r="18" stroke="white" strokeWidth="0.2" />
              </svg>
            </div>
            <div className="absolute top-0 left-0 w-80 h-80 bg-primary-container rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-leaf rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-40" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <span className="inline-block text-sand font-display font-semibold tracking-[0.3em] text-xs uppercase">
                Join 1M+ Plant Lovers
              </span>
              <h2
                className="text-[40px] leading-[1.05] md:text-[88px] md:leading-[1] text-on-primary tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                Ready to bring your <em className="italic text-sand">botanical legacy</em> to life?
              </h2>
              <p className="text-lg text-on-primary/70 max-w-xl mx-auto">
                Start your journey towards a greener home today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <button className="bg-coral text-coral-foreground font-display font-semibold text-sm tracking-wider px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                  Download for iOS
                </button>
                <button className="border border-on-primary/30 text-on-primary font-display font-semibold text-sm tracking-wider px-10 py-5 rounded-full hover:bg-on-primary/10 transition-all backdrop-blur-md">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </SectionReveal>

        <ContactSection />
        </Suspense>
        </ClientOnly>
      </main>

      <footer className="bg-primary w-full py-16 md:py-24 px-8 lg:px-12">
        <div className="max-w-[1520px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="font-display font-semibold text-2xl text-surface-container-lowest">VerdantAI</div>
            <p className="text-sm text-on-primary/60">© 2024 VerdantAI. Nurturing the digital forest.</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-3">
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">Privacy Policy</a>
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">Terms of Service</a>
            </div>
            <div className="flex flex-col space-y-3">
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">Support</a>
            </div>
            <div className="flex flex-col space-y-3">
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">Instagram</a>
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">Twitter</a>
              <a className="text-sm text-on-primary/60 hover:text-on-primary transition-colors" href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
