import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface CartItem {
  product: Product;
  qty: number;
}

type OrderFlow = "whatsapp" | "gpay";

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  txnId?: string;
}

// ─── Product Data ─────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1, name: "Multani Mitti Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.29-PM-1--1.jpeg", price: 80 },
  { id: 2, name: "Neem and Tulsi Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-2--2.jpeg", price: 80 },
  { id: 3, name: "Goat Milk Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-1--3.jpeg", price: 80 },
  { id: 4, name: "Sandalwood Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-3--4.jpeg", price: 80 },
  { id: 5, name: "Nalangu Maavu Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-5.jpeg", price: 80 },
  { id: 6, name: "Mangosteen Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.29-PM-6.jpeg", price: 80 },
  { id: 7, name: "Kuppamieni Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-2--7.jpeg", price: 80 },
  { id: 8, name: "Charcoal & Sage Natural Soap", image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-8.jpeg", price: 80 },
];

// ─── Scroll Observer Hook ────────────────────────────────────────────────────

function useScrollReveal<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// ─── Ripple Button ───────────────────────────────────────────────────────────

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

function RippleButton({ children, className = "", onClick, ...props }: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (btn) {
      const span = document.createElement("span");
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const rect = btn.getBoundingClientRect();
      span.className = "ripple-span";
      span.style.width = span.style.height = `${diameter}px`;
      span.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      span.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      btn.appendChild(span);
      setTimeout(() => span.remove(), 650);
    }
    onClick?.(e);
  };

  return (
    <button ref={btnRef} className={`btn-ripple ${className}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// ─── Leaf Particles ──────────────────────────────────────────────────────────

function LeafParticles() {
  const leaves = [
    { cls: "leaf-1", style: { top: "15%", left: "8%", fontSize: "28px", opacity: 0.5 } },
    { cls: "leaf-2", style: { top: "25%", right: "10%", fontSize: "20px", opacity: 0.4 } },
    { cls: "leaf-3", style: { top: "60%", left: "5%", fontSize: "18px", opacity: 0.35 } },
    { cls: "leaf-4", style: { top: "70%", right: "7%", fontSize: "24px", opacity: 0.45 } },
    { cls: "leaf-5", style: { top: "40%", left: "15%", fontSize: "16px", opacity: 0.3 } },
  ];

  return (
    <>
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className={`${leaf.cls} pointer-events-none select-none absolute`}
          style={leaf.style}
        >
          🌿
        </span>
      ))}
    </>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-solid" : "navbar-transparent"
      }`}
      style={{ padding: "0 5%" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Brand */}
        <a href="#home" className="font-serif font-semibold tracking-widest" style={{ color: "oklch(var(--gold))", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", letterSpacing: "0.15em" }}>
          AMALA ORGANICS
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm tracking-wider transition-colors duration-200 hover:opacity-80"
              style={{ color: scrolled ? "oklch(var(--cream))" : "oklch(var(--cream))" }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: "oklch(var(--gold))",
              color: "oklch(var(--gold))",
              fontSize: "0.875rem"
            }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold"
                style={{ background: "oklch(var(--gold))", color: "oklch(var(--forest))" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onCartOpen}
            className="relative p-2"
            style={{ color: "oklch(var(--gold))" }}
          >
            🛒
            {cartCount > 0 && (
              <span
                className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full text-xs font-semibold"
                style={{ background: "oklch(var(--gold))", color: "oklch(var(--forest))", fontSize: "10px" }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: "oklch(var(--cream))" }} className="p-2 text-xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-4 py-6 px-6 border-t"
          style={{ background: "oklch(var(--forest))", borderColor: "oklch(var(--gold) / 0.3)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans tracking-wider text-sm"
              style={{ color: "oklch(var(--cream))" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 30% 40%, oklch(0.32 0.10 155) 0%, oklch(var(--forest)) 45%, oklch(0.18 0.06 155) 100%)`,
      }}
    >
      {/* Atmospheric noise overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* Floating leaves */}
      <LeafParticles />

      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none" style={{ background: "oklch(var(--gold))", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 pointer-events-none" style={{ background: "oklch(0.50 0.06 155)", filter: "blur(60px)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
          <div className="h-px w-16" style={{ background: "oklch(var(--gold) / 0.6)" }} />
          <span className="font-sans text-xs tracking-[0.3em]" style={{ color: "oklch(var(--gold))" }}>PURE · NATURAL · ORGANIC</span>
          <div className="h-px w-16" style={{ background: "oklch(var(--gold) / 0.6)" }} />
        </div>

        <h1
          className="font-serif font-light tracking-widest mb-4 animate-fade-in-up"
          style={{
            color: "oklch(var(--cream))",
            fontSize: "clamp(2.8rem, 8vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "0.12em",
            animationDelay: "0.2s",
          }}
        >
          AMALA
          <span style={{ display: "block", color: "oklch(var(--gold))" }}>ORGANICS</span>
        </h1>

        <p
          className="font-serif italic mb-3 animate-fade-in-up"
          style={{
            color: "oklch(var(--cream) / 0.9)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            animationDelay: "0.35s",
            animationFillMode: "both"
          }}
        >
          Pure Handmade Herbal Luxury
        </p>

        <p
          className="font-sans tracking-widest mb-12 animate-fade-in"
          style={{
            color: "oklch(var(--gold) / 0.85)",
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            animationDelay: "0.5s",
            animationFillMode: "both"
          }}
        >
          100% NATURAL &nbsp;|&nbsp; SKIN SAFE &nbsp;|&nbsp; CHEMICAL FREE
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "0.65s", animationFillMode: "both" }}
        >
          <RippleButton
            className="btn-pulse px-10 py-4 font-sans text-sm tracking-[0.2em] font-medium rounded-full transition-all duration-300"
            style={{
              background: "transparent",
              border: "2px solid oklch(var(--gold))",
              color: "oklch(var(--gold))",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(var(--gold))";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(var(--forest))";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px oklch(var(--gold) / 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(var(--gold))";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
            }}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            SHOP NOW
          </RippleButton>

          <a
            href="#about"
            className="font-sans text-sm tracking-widest transition-opacity duration-200 hover:opacity-70"
            style={{ color: "oklch(var(--cream) / 0.75)", borderBottom: "1px solid oklch(var(--cream) / 0.3)", paddingBottom: "2px" }}
          >
            Learn Our Story
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-20 animate-bounce" style={{ color: "oklch(var(--gold) / 0.5)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 md:py-32"
      style={{ background: "oklch(var(--cream))" }}
    >
      <div className={`max-w-3xl mx-auto px-6 text-center ${visible ? "scroll-visible" : "scroll-hidden"}`}>
        <span className="font-sans text-xs tracking-[0.3em] mb-4 block" style={{ color: "oklch(var(--gold-deep))" }}>
          OUR STORY
        </span>
        <h2
          className={`font-serif font-light text-5xl md:text-6xl mb-6 gold-underline-animate inline-block ${visible ? "visible" : ""}`}
          style={{ color: "oklch(var(--forest))" }}
        >
          About the Brand
        </h2>

        <hr className="gold-divider my-8 mx-auto" style={{ width: "80px" }} />

        <p
          className="font-sans leading-relaxed text-lg"
          style={{ color: "oklch(0.30 0.05 155)", lineHeight: "1.9" }}
        >
          AMALA ORGANICS crafts traditional herbal soaps using pure natural ingredients inspired by nature
          and ancient wellness practices. Every bar is handmade with care to nourish and protect your skin
          naturally — free from chemicals, rich in tradition, and worthy of trust.
        </p>

        <div className="flex justify-center gap-12 mt-14">
          {[
            { num: "100%", label: "Natural" },
            { num: "8+", label: "Varieties" },
            { num: "0", label: "Chemicals" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-4xl font-semibold" style={{ color: "oklch(var(--gold-deep))" }}>
                {stat.num}
              </div>
              <div className="font-sans text-xs tracking-widest mt-1" style={{ color: "oklch(0.50 0.04 155)" }}>
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "🌿", title: "100% Herbal Ingredients", desc: "Crafted from the finest botanical extracts and time-honoured herbal formulations." },
  { icon: "🧼", title: "Handmade with Care", desc: "Each soap bar is hand-poured and cold-pressed with artisan precision and love." },
  { icon: "🌎", title: "Eco-Friendly Production", desc: "Sustainably sourced, plastic-minimal packaging, and zero harmful effluents." },
  { icon: "✨", title: "Safe for All Skin Types", desc: "Dermatologically gentle — suitable for sensitive, dry, oily, and combination skin." },
];

function WhyChooseUs() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-24 md:py-32"
      style={{ background: "oklch(var(--sage))" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 ${visible ? "scroll-visible" : "scroll-hidden"}`}>
          <span className="font-sans text-xs tracking-[0.3em] mb-4 block" style={{ color: "oklch(var(--gold-deep))" }}>
            OUR PROMISE
          </span>
          <h2
            className={`font-serif font-light text-5xl md:text-6xl gold-underline-animate inline-block ${visible ? "visible" : ""}`}
            style={{ color: "oklch(var(--forest))" }}
          >
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`feature-card rounded-2xl p-8 text-center ${visible ? "scroll-visible" : "scroll-hidden"}`}
              style={{
                background: "oklch(var(--cream))",
                border: "1px solid oklch(var(--gold) / 0.2)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-serif text-xl mb-3" style={{ color: "oklch(var(--forest))" }}>
                {feature.title}
              </h3>
              <hr className="gold-divider my-3 mx-auto" style={{ width: "40px" }} />
              <p className="font-sans text-sm leading-relaxed" style={{ color: "oklch(0.40 0.04 155)" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, qty: number) => void;
  visible: boolean;
  delay: number;
}

function ProductCard({ product, onAddToCart, visible, delay }: ProductCardProps) {
  const [qty, setQty] = useState(1);

  const increment = () => setQty((prev) => prev + 1);
  const decrement = () => setQty((prev) => Math.max(1, prev - 1));

  return (
    <div
      className={`product-card rounded-2xl overflow-hidden flex flex-col ${visible ? "scroll-visible" : "scroll-hidden"}`}
      style={{
        background: "oklch(var(--cream))",
        border: "1px solid oklch(var(--gold) / 0.18)",
        boxShadow: "0 4px 20px rgba(15,61,46,0.06)",
        transitionDelay: `${delay}s`,
      }}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gold divider */}
      <hr className="gold-divider" />

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <h3
          className="font-serif text-lg leading-snug"
          style={{ color: "oklch(var(--forest))" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span
            className="font-serif text-2xl font-semibold"
            style={{ color: "oklch(var(--gold-deep))" }}
          >
            ₹{product.price}
          </span>
          <span className="font-sans text-xs tracking-wider px-2 py-1 rounded-full" style={{ background: "oklch(var(--sage))", color: "oklch(var(--forest))" }}>
            Per Bar
          </span>
        </div>

        {/* Qty selector */}
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs tracking-wider" style={{ color: "oklch(0.45 0.04 155)" }}>QTY:</span>
          <div
            className="flex items-center rounded-full overflow-hidden border"
            style={{ borderColor: "oklch(var(--gold) / 0.35)" }}
          >
            <button
              onClick={decrement}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-150 hover:bg-forest/5 font-semibold"
              style={{ color: "oklch(var(--forest))" }}
            >
              −
            </button>
            <span
              className="w-8 text-center font-sans text-sm font-medium"
              style={{ color: "oklch(var(--forest))" }}
            >
              {qty}
            </span>
            <button
              onClick={increment}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-150 hover:bg-forest/5 font-semibold"
              style={{ color: "oklch(var(--forest))" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <RippleButton
          className="mt-auto py-3 px-6 rounded-full font-sans text-sm tracking-widest font-medium transition-all duration-300"
          style={{
            background: "oklch(var(--forest))",
            color: "oklch(var(--cream))",
            border: "2px solid oklch(var(--forest))",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "oklch(var(--gold))";
            btn.style.borderColor = "oklch(var(--gold))";
            btn.style.color = "oklch(var(--forest))";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "oklch(var(--forest))";
            btn.style.borderColor = "oklch(var(--forest))";
            btn.style.color = "oklch(var(--cream))";
          }}
          onClick={() => {
            onAddToCart(product, qty);
            setQty(1);
          }}
        >
          ADD TO CART
        </RippleButton>
      </div>
    </div>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────

interface ProductsSectionProps {
  onAddToCart: (product: Product, qty: number) => void;
}

function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="products" ref={ref} className="py-24 md:py-32" style={{ background: "oklch(var(--cream))" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 ${visible ? "scroll-visible" : "scroll-hidden"}`}>
          <span className="font-sans text-xs tracking-[0.3em] mb-4 block" style={{ color: "oklch(var(--gold-deep))" }}>
            HANDCRAFTED SELECTION
          </span>
          <h2
            className={`font-serif font-light text-5xl md:text-6xl gold-underline-animate inline-block ${visible ? "visible" : ""}`}
            style={{ color: "oklch(var(--forest))" }}
          >
            Our Premium Collection
          </h2>
          <p className="font-sans mt-6 text-base" style={{ color: "oklch(0.40 0.04 155)" }}>
            Each bar lovingly handmade — ₹80 per soap
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              visible={visible}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
  onWhatsApp: () => void;
  onGPay: () => void;
}

function CartPanel({ open, onClose, items, onQtyChange, onRemove, onWhatsApp, onGPay }: CartPanelProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      {/* Panel */}
      <div
        className="cart-panel-enter fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-md overflow-hidden"
        style={{
          background: "oklch(var(--cream))",
          boxShadow: "-8px 0 40px rgba(15,61,46,0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "oklch(var(--gold) / 0.25)", background: "oklch(var(--forest))" }}
        >
          <div>
            <h2 className="font-serif text-2xl" style={{ color: "oklch(var(--cream))" }}>Your Cart</h2>
            <p className="font-sans text-xs tracking-widest mt-0.5" style={{ color: "oklch(var(--gold))" }}>
              {items.length === 0 ? "Empty" : `${items.reduce((s, i) => s + i.qty, 0)} items`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "oklch(var(--cream))", background: "oklch(var(--cream) / 0.1)" }}
          >
            ✕
          </button>
        </div>

        {/* Items — scrollable area */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 space-y-4" style={{ minHeight: 0 }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <span className="text-6xl">🛒</span>
              <p className="font-serif text-xl" style={{ color: "oklch(var(--forest))" }}>Your cart is empty</p>
              <p className="font-sans text-sm" style={{ color: "oklch(0.50 0.04 155)" }}>Add some premium soaps to get started</p>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-full font-sans text-sm tracking-widest"
                style={{ background: "oklch(var(--forest))", color: "oklch(var(--cream))" }}
              >
                BROWSE SOAPS
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 rounded-xl border"
                style={{ border: "1px solid oklch(var(--gold) / 0.18)", background: "oklch(0.98 0.008 90)" }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm leading-snug mb-1 truncate" style={{ color: "oklch(var(--forest))" }}>
                    {item.product.name}
                  </p>
                  <p className="font-sans text-xs mb-2" style={{ color: "oklch(var(--gold-deep))" }}>
                    ₹{item.product.price} × {item.qty} = <strong>₹{item.product.price * item.qty}</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center rounded-full border overflow-hidden"
                      style={{ borderColor: "oklch(var(--gold) / 0.35)" }}
                    >
                      <button
                        onClick={() => onQtyChange(item.product.id, Math.max(1, item.qty - 1))}
                        className="w-7 h-7 flex items-center justify-center font-semibold text-sm"
                        style={{ color: "oklch(var(--forest))" }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-medium" style={{ color: "oklch(var(--forest))" }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onQtyChange(item.product.id, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center font-semibold text-sm"
                        style={{ color: "oklch(var(--forest))" }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="ml-auto text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: "oklch(0.55 0.18 25)", background: "oklch(0.95 0.02 25)" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — sticky, never scrolls away */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 py-5 border-t" style={{ borderColor: "oklch(var(--gold) / 0.25)" }}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-sans tracking-widest text-sm" style={{ color: "oklch(0.40 0.04 155)" }}>TOTAL</span>
              <span className="font-serif text-3xl font-semibold" style={{ color: "oklch(var(--forest))" }}>
                ₹{total}
              </span>
            </div>
            <div className="space-y-3">
              <RippleButton
                onClick={onWhatsApp}
                className="w-full py-3.5 rounded-full font-sans text-sm tracking-widest font-medium flex items-center justify-center gap-2"
                style={{ background: "oklch(0.50 0.16 148)", color: "white" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                ORDER VIA WHATSAPP
              </RippleButton>
              <RippleButton
                onClick={onGPay}
                className="w-full py-3.5 rounded-full font-sans text-sm tracking-widest font-medium"
                style={{ background: "oklch(var(--gold))", color: "oklch(var(--forest))" }}
              >
                💳 PAY VIA GPAY & ORDER
              </RippleButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Order Modal (Flow A: WhatsApp Only) ──────────────────────────────────────

interface WhatsAppModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

function WhatsAppOrderModal({ open, onClose, items, total }: WhatsAppModalProps) {
  const [form, setForm] = useState<CustomerDetails>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  if (!open) return null;

  const validate = () => {
    const errs: Partial<CustomerDetails> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) errs.phone = "Enter valid 10-digit mobile";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const orderLines = items.map((i) => encodeURIComponent(`${i.product.name} – Qty: ${i.qty} – ₹${i.product.price * i.qty}`)).join("%0A");
    const customerMsg = encodeURIComponent(`🌿 Hello AMALA ORGANICS Team,\n\nThank you for your premium herbal soaps.\n\n*Customer Details:*\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\n*Order Summary:*\n`) + orderLines + encodeURIComponent(`\n\n*Total Amount: ₹${total}*\n\nKindly confirm my order. ✨`);
    window.open(`https://wa.me/918072008098?text=${customerMsg}`, "_blank");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose} style={{ animation: "fadeIn 0.2s ease" }}>
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "oklch(var(--cream))", boxShadow: "0 30px 80px rgba(15,61,46,0.3)", maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-7 py-6" style={{ background: "oklch(var(--forest))" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl" style={{ color: "oklch(var(--cream))" }}>Place Your Order</h2>
                <p className="font-sans text-xs tracking-widest mt-1" style={{ color: "oklch(var(--gold))" }}>VIA WHATSAPP</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(var(--cream) / 0.15)", color: "oklch(var(--cream))" }}>✕</button>
            </div>
          </div>

          {/* Form — scrollable */}
          <div className="overflow-y-auto overscroll-contain px-7 py-6 space-y-5" style={{ minHeight: 0 }}>
            {/* Order summary mini */}
            <div className="p-4 rounded-xl" style={{ background: "oklch(var(--sage))", border: "1px solid oklch(var(--gold) / 0.2)" }}>
              <p className="font-sans text-xs tracking-widest mb-2" style={{ color: "oklch(var(--gold-deep))" }}>ORDER SUMMARY</p>
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between font-sans text-sm py-0.5" style={{ color: "oklch(var(--forest))" }}>
                  <span className="truncate mr-2">{item.product.name} × {item.qty}</span>
                  <span className="shrink-0">₹{item.product.price * item.qty}</span>
                </div>
              ))}
              <hr className="gold-divider my-2" />
              <div className="flex justify-between font-serif text-lg font-semibold" style={{ color: "oklch(var(--forest))" }}>
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            <div>
              <label htmlFor="wa-name" className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>YOUR NAME *</label>
              <input
                id="wa-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none border transition-all"
                style={{
                  background: "white",
                  border: errors.name ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
              {errors.name && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="wa-phone" className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>PHONE NUMBER *</label>
              <input
                id="wa-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none border transition-all"
                style={{
                  background: "white",
                  border: errors.phone ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
              {errors.phone && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="wa-address" className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>DELIVERY ADDRESS *</label>
              <textarea
                id="wa-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Full delivery address"
                rows={3}
                className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none border transition-all resize-none"
                style={{
                  background: "white",
                  border: errors.address ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
              {errors.address && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.address}</p>}
            </div>

            <RippleButton
              onClick={handleSubmit}
              className="w-full py-4 rounded-full font-sans text-sm tracking-widest font-medium flex items-center justify-center gap-2"
              style={{ background: "oklch(0.50 0.16 148)", color: "white" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              SEND TO WHATSAPP
            </RippleButton>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Order Modal (Flow B: GPay + WhatsApp) ────────────────────────────────────

interface GPayModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

function GPayOrderModal({ open, onClose, items, total }: GPayModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CustomerDetails>({ name: "", phone: "", address: "", txnId: "" });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  if (!open) return null;

  const validateStep1 = () => {
    const errs: Partial<CustomerDetails> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) errs.phone = "Enter valid 10-digit mobile";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = () => {
    if (!form.txnId?.trim()) {
      setErrors((e) => ({ ...e, txnId: "Transaction ID is required" }));
      return;
    }
    const orderLines = items.map((i) => encodeURIComponent(`${i.product.name} – Qty: ${i.qty} – ₹${i.product.price * i.qty}`)).join("%0A");
    const gpayMsg = encodeURIComponent(`🌿 Hello AMALA ORGANICS Team,\n\nThank you for your premium herbal soaps.\n\n*Customer Details:*\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\n*Order Summary:*\n`) + orderLines + encodeURIComponent(`\n\n*Total Amount: ₹${total}*\n\n*Payment Details:*\nPayment Method: GPay\nTransaction ID: ${form.txnId ?? ""}\n\nKindly confirm my order. ✨`);
    window.open(`https://wa.me/918072008098?text=${gpayMsg}`, "_blank");
    onClose();
    setStep(1);
  };

  const handleClose = () => { onClose(); setStep(1); };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={handleClose} style={{ animation: "fadeIn 0.2s ease" }}>
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "oklch(var(--cream))", boxShadow: "0 30px 80px rgba(15,61,46,0.3)", maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-7 py-6" style={{ background: "oklch(var(--forest))" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl" style={{ color: "oklch(var(--cream))" }}>
                  {step === 1 ? "Your Details" : "Complete Payment"}
                </h2>
                <p className="font-sans text-xs tracking-widest mt-1" style={{ color: "oklch(var(--gold))" }}>
                  STEP {step} OF 2 — {step === 1 ? "CUSTOMER INFO" : "GPAY PAYMENT"}
                </p>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(var(--cream) / 0.15)", color: "oklch(var(--cream))" }}>✕</button>
            </div>
            {/* Step indicator */}
            <div className="flex gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className="h-1 flex-1 rounded-full transition-all duration-500" style={{ background: s <= step ? "oklch(var(--gold))" : "oklch(var(--cream) / 0.2)" }} />
              ))}
            </div>
          </div>

          {/* Form — scrollable */}
          <div className="overflow-y-auto overscroll-contain px-7 py-6 space-y-5" style={{ minHeight: 0 }}>
            {step === 1 ? (
              <>
                {/* Order summary mini */}
                <div className="p-4 rounded-xl" style={{ background: "oklch(var(--sage))", border: "1px solid oklch(var(--gold) / 0.2)" }}>
                  <p className="font-sans text-xs tracking-widest mb-2" style={{ color: "oklch(var(--gold-deep))" }}>ORDER SUMMARY</p>
                   {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between font-sans text-sm py-0.5" style={{ color: "oklch(var(--forest))" }}>
                      <span className="truncate mr-2">{item.product.name} × {item.qty}</span>
                      <span className="shrink-0">₹{item.product.price * item.qty}</span>
                    </div>
                  ))}
                  <hr className="gold-divider my-2" />
                  <div className="flex justify-between font-serif text-lg font-semibold" style={{ color: "oklch(var(--forest))" }}>
                    <span>Total</span><span>₹{total}</span>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>YOUR NAME *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
                    style={{ background: "white", border: errors.name ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>PHONE NUMBER *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
                    style={{ background: "white", border: errors.phone ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  />
                  {errors.phone && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.phone}</p>}
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>DELIVERY ADDRESS *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Full delivery address"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none resize-none"
                    style={{ background: "white", border: errors.address ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  />
                  {errors.address && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.address}</p>}
                </div>

                <RippleButton
                  onClick={handleStep1Next}
                  className="w-full py-4 rounded-full font-sans text-sm tracking-widest font-medium"
                  style={{ background: "oklch(var(--gold))", color: "oklch(var(--forest))" }}
                >
                  PROCEED TO PAYMENT →
                </RippleButton>
              </>
            ) : (
              <>
                {/* GPay Instructions */}
                <div
                  className="p-6 rounded-2xl text-center"
                  style={{ background: "oklch(var(--forest))", border: "1px solid oklch(var(--gold) / 0.3)" }}
                >
                  <p className="font-sans text-xs tracking-[0.2em] mb-3" style={{ color: "oklch(var(--gold))" }}>PAY USING GPAY</p>
                  <div className="text-5xl mb-3">📱</div>
                  <p className="font-sans text-sm mb-2" style={{ color: "oklch(var(--cream) / 0.75)" }}>
                    Send <strong style={{ color: "white" }}>₹{total}</strong> to:
                  </p>
                  <div
                    className="font-serif text-3xl font-semibold tracking-widest mb-2"
                    style={{ color: "oklch(var(--gold))" }}
                  >
                    8072008098
                  </div>
                  <p className="font-sans text-xs" style={{ color: "oklch(var(--cream) / 0.6)" }}>
                    Open Google Pay → Send Money → Enter this number
                  </p>
                </div>

                <p className="font-sans text-sm text-center" style={{ color: "oklch(0.40 0.04 155)" }}>
                  After payment, enter the Transaction ID from your GPay receipt below:
                </p>

                <div>
                  <label className="font-sans text-xs tracking-widest block mb-1.5" style={{ color: "oklch(0.40 0.04 155)" }}>GPAY TRANSACTION ID *</label>
                  <input
                    type="text"
                    value={form.txnId ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, txnId: e.target.value }))}
                    placeholder="e.g. UPI/2024xxxx123"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none"
                    style={{ background: "white", border: errors.txnId ? "1.5px solid oklch(0.577 0.245 27.325)" : "1.5px solid oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  />
                  {errors.txnId && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)" }}>{errors.txnId}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-full font-sans text-sm tracking-widest border"
                    style={{ borderColor: "oklch(var(--forest))", color: "oklch(var(--forest))", background: "transparent" }}
                  >
                    ← BACK
                  </button>
                  <RippleButton
                    onClick={handleSubmit}
                    className="flex-1 py-3.5 rounded-full font-sans text-sm tracking-widest font-medium flex items-center justify-center gap-2"
                    style={{ background: "oklch(0.50 0.16 148)", color: "white" }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    CONFIRM ORDER
                  </RippleButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: 1,
    name: "Priya Lakshmi",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "The Sandalwood soap is absolutely divine! My skin feels so soft and it smells luxurious. I've been using it for 3 weeks and my skin has visibly improved. Highly recommend AMALA ORGANICS!",
    product: "Sandalwood Natural Soap",
    avatar: "P",
  },
  {
    id: 2,
    name: "Kavitha Sundaram",
    location: "Coimbatore, Tamil Nadu",
    rating: 5,
    text: "Neem and Tulsi soap is perfect for my oily skin. No more breakouts! Completely natural and gentle. The quality is exceptional for the price. Will definitely order more.",
    product: "Neem and Tulsi Natural Soap",
    avatar: "K",
  },
  {
    id: 3,
    name: "Meena Rajendran",
    location: "Madurai, Tamil Nadu",
    rating: 5,
    text: "I ordered the Goat Milk soap for my sensitive skin and I'm amazed! No irritation, no dryness — just beautifully moisturized skin. The handmade quality is evident from the first use.",
    product: "Goat Milk Natural Soap",
    avatar: "M",
  },
  {
    id: 4,
    name: "Anitha Devi",
    location: "Tirunelveli, Tamil Nadu",
    rating: 5,
    text: "Charcoal & Sage soap is a game changer for deep cleansing. My pores look smaller and my skin feels fresh all day. Fast delivery to my city too — very happy customer!",
    product: "Charcoal & Sage Natural Soap",
    avatar: "A",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4"
          fill={i < count ? "oklch(var(--gold))" : "none"}
          stroke="oklch(var(--gold))"
          strokeWidth="1.5"
          style={{ fill: i < count ? "oklch(0.72 0.10 80)" : "none", stroke: "oklch(0.72 0.10 80)" }}
        >
          <path d="M10 1l2.39 4.85L18 6.72l-4 3.9.94 5.5L10 13.48l-4.94 2.64.94-5.5-4-3.9 5.61-.87z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewsSection() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      id="reviews"
      className="py-24 md:py-32"
      style={{ background: "oklch(var(--forest))" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className={`text-center mb-16 ${visible ? "scroll-visible" : "scroll-hidden"}`}>
          <span className="font-sans text-xs tracking-[0.3em] mb-4 block" style={{ color: "oklch(var(--gold))" }}>
            CUSTOMER LOVE
          </span>
          <h2
            className={`font-serif font-light text-5xl md:text-6xl gold-underline-animate inline-block ${visible ? "visible" : ""}`}
            style={{ color: "oklch(var(--cream))" }}
          >
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3 mt-8">
            <StarRating count={5} />
            <span className="font-sans text-sm" style={{ color: "oklch(var(--cream) / 0.75)" }}>
              4.9 / 5 · 200+ Happy Customers
            </span>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={review.id}
              className={`review-card rounded-2xl p-6 flex flex-col gap-4 ${visible ? "scroll-visible" : "scroll-hidden"}`}
              style={{
                background: "oklch(0.22 0.07 155)",
                border: "1px solid oklch(var(--gold) / 0.2)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              {/* Stars */}
              <StarRating count={review.rating} />

              {/* Quote */}
              <p
                className="font-sans text-sm leading-relaxed flex-1"
                style={{ color: "oklch(var(--cream) / 0.82)", lineHeight: "1.75" }}
              >
                "{review.text}"
              </p>

              {/* Product badge */}
              <span
                className="font-sans text-xs px-3 py-1 rounded-full self-start"
                style={{ background: "oklch(var(--gold) / 0.15)", color: "oklch(var(--gold))", border: "1px solid oklch(var(--gold) / 0.25)" }}
              >
                {review.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "oklch(var(--gold) / 0.15)" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-semibold shrink-0"
                  style={{ background: "oklch(var(--gold) / 0.2)", color: "oklch(var(--gold))" }}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="font-serif text-sm font-medium" style={{ color: "oklch(var(--cream))" }}>
                    {review.name}
                  </p>
                  <p className="font-sans text-xs" style={{ color: "oklch(var(--cream) / 0.5)" }}>
                    {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div
          className={`mt-16 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center ${visible ? "scroll-visible" : "scroll-hidden"}`}
          style={{ background: "oklch(0.22 0.07 155)", border: "1px solid oklch(var(--gold) / 0.2)", transitionDelay: "0.4s" }}
        >
          {[
            { icon: "🌿", label: "100% Natural", sub: "Zero chemicals" },
            { icon: "🤝", label: "Trusted Brand", sub: "Since 2020" },
            { icon: "🚚", label: "Fast Delivery", sub: "Tamil Nadu wide" },
            { icon: "💚", label: "Skin Tested", sub: "Dermatologist gentle" },
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2">
              <div className="text-3xl">{badge.icon}</div>
              <div className="font-serif text-base font-medium" style={{ color: "oklch(var(--gold))" }}>{badge.label}</div>
              <div className="font-sans text-xs" style={{ color: "oklch(var(--cream) / 0.55)" }}>{badge.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      id="footer"
      className="pt-1"
      style={{ background: "oklch(var(--forest))" }}
    >
      {/* Gold top border */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, oklch(var(--gold)), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl font-light tracking-widest mb-4" style={{ color: "oklch(var(--gold))" }}>
              AMALA<br />ORGANICS
            </h3>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "oklch(var(--cream) / 0.65)" }}>
              Pure luxury herbal soaps handcrafted with love, rooted in nature's ancient wisdom.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              {[
                { label: "Instagram", icon: "📷" },
                { label: "Facebook", icon: "📘" },
                { label: "YouTube", icon: "▶️" },
              ].map((social) => (
                <button
                  key={social.label}
                  title={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "oklch(var(--cream) / 0.1)", border: "1px solid oklch(var(--gold) / 0.3)" }}
                >
                  <span className="text-lg">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl mb-6" style={{ color: "oklch(var(--gold))" }}>Contact Us</h4>
            <div className="space-y-3 font-sans text-sm" style={{ color: "oklch(var(--cream) / 0.75)" }}>
              <div className="flex items-center gap-3">
                <span style={{ color: "oklch(var(--gold))" }}>📞</span>
                <div>
                  <p>8072008098</p>
                  <p>9626682799</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: "oklch(var(--gold))" }}>✉️</span>
                <a href="mailto:soaporganic69@gmail.com" className="hover:opacity-80 break-all">
                  soaporganic69@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: "oklch(var(--gold))" }}>📍</span>
                <p>Virudhunagar, Tamil Nadu</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-6" style={{ color: "oklch(var(--gold))" }}>Quick Links</h4>
            <nav className="space-y-3">
              {["Home", "About", "Products", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block font-sans text-sm transition-opacity duration-200 hover:opacity-80"
                  style={{ color: "oklch(var(--cream) / 0.7)" }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <hr className="gold-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs tracking-wider" style={{ color: "oklch(var(--cream) / 0.45)" }}>
            © 2026 AMALA ORGANICS · All Rights Reserved
          </p>
          <p className="font-sans text-xs" style={{ color: "oklch(var(--cream) / 0.35)" }}>
            Built with{" "}
            <span style={{ color: "oklch(var(--gold))" }}>♥</span>
            {" "}using{" "}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80" style={{ color: "oklch(var(--gold) / 0.8)" }}>
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating WhatsApp Button ─────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918072008098"
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp-pulse fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-luxury-lg transition-transform duration-200 hover:scale-110"
      style={{ background: "#25D366" }}
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setWidth(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div id="scroll-progress-bar" style={{ width: `${width}%` }} />;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [gpayModalOpen, setGpayModalOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const addToCart = useCallback((product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const updateQty = useCallback((productId: number, qty: number) => {
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, qty } : i));
  }, []);

  const removeItem = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleWhatsAppOrder = () => {
    setCartOpen(false);
    setWhatsAppModalOpen(true);
  };

  const handleGPayOrder = () => {
    setCartOpen(false);
    setGpayModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        <HeroSection />
        <AboutSection />
        <WhyChooseUs />
        <ProductsSection onAddToCart={addToCart} />
        <ReviewsSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onQtyChange={updateQty}
        onRemove={removeItem}
        onWhatsApp={handleWhatsAppOrder}
        onGPay={handleGPayOrder}
      />
      <WhatsAppOrderModal
        open={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        items={cart}
        total={cartTotal}
      />
      <GPayOrderModal
        open={gpayModalOpen}
        onClose={() => setGpayModalOpen(false)}
        items={cart}
        total={cartTotal}
      />
    </div>
  );
}
