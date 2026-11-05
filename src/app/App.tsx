import { useState, useEffect, useRef } from "react";
import {
  MapPin, Search, ChevronRight, Star, Clock, Users, Filter,
  ArrowLeft, Heart, Share2, Phone, MessageSquare, Shield,
  CheckCircle, QrCode, Navigation, AlertTriangle, Bell,
  Wallet, Settings, HelpCircle, ChevronDown, Plus, Minus,
  X, Menu, Home, List, User, Truck, BarChart2, Calendar,
  Edit3, Camera, Check, ArrowRight, Zap, TrendingUp,
  DollarSign, Package, AlertCircle, Eye, ThumbsUp,
  MoreVertical, RefreshCw, PlayCircle, StopCircle, Map,
  CreditCard, Smartphone, Banknote, Car, Bus, Wind,
  Wifi, Coffee, Volume2, Usb, ChevronUp, Layers,
  Activity, Award, LogOut, Send, Radio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import grouppyLogo from "@/imports/Grouppy_Logo-removebg-preview.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type AppMode = "customer";
type CustomerScreen =
  | "splash" | "login" | "otp" | "home" | "results" | "details"
  | "seats" | "passenger" | "payment" | "confirmed" | "trips" | "live" | "profile";
type AgencyScreen =
  | "dashboard" | "vehicles" | "addVehicle" | "requests" | "drivers" | "revenue" | "reviews" | "notifications" | "agencyProfile";
type DriverScreen =
  | "driverDash" | "todayTrips" | "navigation" | "verification" | "tripStatus" | "earnings" | "driverProfile";

type Screen = CustomerScreen;

// ─── Data ─────────────────────────────────────────────────────────────────────
const ROUTES = [
  { from: "Mumbai", to: "Pune", duration: "3h 20m", basePrice: 350 },
  { from: "Delhi", to: "Agra", duration: "3h 45m", basePrice: 320 },
  { from: "Bangalore", to: "Mysore", duration: "2h 50m", basePrice: 280 },
  { from: "Hyderabad", to: "Vijayawada", duration: "4h 15m", basePrice: 420 },
  { from: "Chennai", to: "Pondicherry", duration: "2h 30m", basePrice: 250 },
];

const VEHICLES = [
  {
    id: "v1",
    name: "Force Traveller 17+1",
    agency: "Sai Travels",
    agencyRating: 4.8,
    departure: "06:30",
    arrival: "09:50",
    duration: "3h 20m",
    seatsLeft: 5,
    price: 349,
    rating: 4.7,
    reviews: 284,
    type: "Tempo Traveller",
    ac: true,
    amenities: ["AC", "USB Charging", "Music"],
    image: "photo-1558618666-fcd25c85cd64",
    driverName: "Rajan Mishra",
    driverRating: 4.9,
    driverPhone: "+91 98765 43210",
    pickup: "Dadar Bus Stop, Mumbai",
    drop: "Shivajinagar, Pune",
    totalSeats: 17,
  },
  {
    id: "v2",
    name: "Tata Winger 13-Seater",
    agency: "Royal Tours",
    agencyRating: 4.5,
    departure: "07:00",
    arrival: "10:30",
    duration: "3h 30m",
    seatsLeft: 2,
    price: 299,
    rating: 4.4,
    reviews: 156,
    type: "Mini Van",
    ac: true,
    amenities: ["AC", "Music"],
    image: "photo-1544620347-c4fd4a3d5957",
    driverName: "Suresh Kumar",
    driverRating: 4.6,
    driverPhone: "+91 87654 32109",
    pickup: "Andheri West, Mumbai",
    drop: "Kothrud, Pune",
    totalSeats: 13,
  },
  {
    id: "v3",
    name: "Mahindra Supro 9-Seater",
    agency: "Deccan Drives",
    agencyRating: 4.3,
    departure: "08:15",
    arrival: "11:45",
    duration: "3h 30m",
    seatsLeft: 7,
    price: 249,
    rating: 4.2,
    reviews: 98,
    type: "Mini Van",
    ac: false,
    amenities: ["Music", "USB Charging"],
    image: "photo-1449965408869-eaa3f722e40d",
    driverName: "Anil Sharma",
    driverRating: 4.5,
    driverPhone: "+91 76543 21098",
    pickup: "Borivali Station, Mumbai",
    drop: "Wakad, Pune",
    totalSeats: 9,
  },
];

const POPULAR_ROUTES = [
  { from: "Mumbai", to: "Pune", price: 299, duration: "3h 20m" },
  { from: "Delhi", to: "Agra", price: 319, duration: "3h 45m" },
  { from: "Bangalore", to: "Mysore", price: 249, duration: "2h 50m" },
  { from: "Chennai", to: "Pondi", price: 229, duration: "2h 30m" },
];

const TRIPS = [
  { id: "GRP2847", route: "Mumbai → Pune", date: "Aug 5, 2026", time: "06:30 AM", status: "upcoming", vehicle: "Force Traveller", seat: "B3", price: 349 },
  { id: "GRP2612", route: "Delhi → Agra", date: "Jul 20, 2026", time: "07:00 AM", status: "completed", vehicle: "Tata Winger", seat: "A2", price: 299 },
  { id: "GRP2401", route: "Bangalore → Mysore", date: "Jul 10, 2026", time: "08:00 AM", status: "cancelled", vehicle: "Mahindra Supro", seat: "C1", price: 249 },
];

// ─── Color Palette ─────────────────────────────────────────────────────────────
const G = {
  primary: "#0B5D3B",
  primaryLight: "#E8F2EC",
  primaryDark: "#073D27",
  gold: "#C9A84C",
  goldLight: "#FBF3E0",
  white: "#FFFFFF",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#0D1B12",
  textMid: "#4A5568",
  textLight: "#6B7A83",
  border: "rgba(11,93,59,0.12)",
  danger: "#D4183D",
  success: "#16A34A",
  warning: "#EA8C00",
  muted: "#EEF1F4",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "gold" | "danger" | "success" | "muted" | "warning" }) {
  const map = {
    primary: "bg-secondary text-primary border border-primary/20",
    gold: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-600 border border-red-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    muted: "bg-muted text-muted-foreground border border-border",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", map[color])}>
      {children}
    </span>
  );
}

function Pill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-card text-textMid border border-border hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}

function StarRow({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={12} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-foreground">{rating}</span>
      {count && <span className="text-xs text-muted-foreground">({count})</span>}
    </span>
  );
}

function VehicleImage({ photoId, h = 180 }: { photoId: string; h?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-muted" style={{ height: h }}>
      <img
        src={`https://images.unsplash.com/${photoId}?w=600&h=${h * 2}&fit=crop&auto=format`}
        alt="Vehicle"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function BackHeader({ title, onBack, rightSlot }: { title: string; onBack: () => void; rightSlot?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <button onClick={onBack} className="p-2 rounded-xl bg-muted hover:bg-secondary transition-colors">
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <span className="font-semibold text-base text-foreground">{title}</span>
      <div className="w-9 flex justify-end">{rightSlot || <span />}</div>
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
function CustomerNav({ current, onNavigate }: { current: string; onNavigate: (s: CustomerScreen) => void }) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "trips", icon: List, label: "Trips" },
    { id: "live", icon: Navigation, label: "Live" },
    { id: "profile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="flex bg-card border-t border-border px-2 pt-2 pb-safe">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-1"
        >
          <div className={cn("p-1.5 rounded-xl transition-all", current === id ? "bg-secondary" : "")}>
            <Icon size={20} className={current === id ? "text-primary" : "text-muted-foreground"} />
          </div>
          <span className={cn("text-[10px] font-medium", current === id ? "text-primary" : "text-muted-foreground")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function AgencyNav({ current, onNavigate }: { current: string; onNavigate: (s: AgencyScreen) => void }) {
  const tabs = [
    { id: "dashboard", icon: BarChart2, label: "Dashboard" },
    { id: "vehicles", icon: Truck, label: "Vehicles" },
    { id: "requests", icon: Package, label: "Requests" },
    { id: "revenue", icon: TrendingUp, label: "Revenue" },
    { id: "agencyProfile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="flex bg-card border-t border-border px-1 pt-2 pb-safe">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => onNavigate(id)} className="flex-1 flex flex-col items-center gap-0.5 py-1">
          <div className={cn("p-1.5 rounded-xl transition-all", current === id ? "bg-secondary" : "")}>
            <Icon size={18} className={current === id ? "text-primary" : "text-muted-foreground"} />
          </div>
          <span className={cn("text-[10px] font-medium", current === id ? "text-primary" : "text-muted-foreground")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function DriverNav({ current, onNavigate }: { current: string; onNavigate: (s: DriverScreen) => void }) {
  const tabs = [
    { id: "driverDash", icon: Home, label: "Home" },
    { id: "todayTrips", icon: List, label: "Trips" },
    { id: "navigation", icon: Map, label: "Map" },
    { id: "earnings", icon: DollarSign, label: "Earnings" },
    { id: "driverProfile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="flex bg-card border-t border-border px-1 pt-2 pb-safe">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => onNavigate(id)} className="flex-1 flex flex-col items-center gap-0.5 py-1">
          <div className={cn("p-1.5 rounded-xl transition-all", current === id ? "bg-secondary" : "")}>
            <Icon size={18} className={current === id ? "text-primary" : "text-muted-foreground"} />
          </div>
          <span className={cn("text-[10px] font-medium", current === id ? "text-primary" : "text-muted-foreground")}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

// 1. SPLASH
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: `linear-gradient(160deg, ${G.primaryDark} 0%, ${G.primary} 60%, #0D7A4F 100%)` }}>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="flex flex-col items-center gap-5">
        <img src={grouppyLogo} alt="Grouppy logo" className="h-50 w-auto object-contain mx-auto" />
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grouppy</h1>
          <p className="text-white/70 text-base mt-1 font-medium tracking-wide">Travel Together. Pay Less.</p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="absolute bottom-16 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
        <p className="text-white/40 text-xs font-medium">India's Shared Ride Marketplace</p>
      </motion.div>
    </div>
  );
}

// 2. LOGIN
function LoginScreen({ onDone }: { onDone: () => void }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="flex flex-col h-full" style={{ background: `linear-gradient(170deg, ${G.primaryDark} 0%, ${G.primary} 45%, #F7F8FA 45%)` }}>
      <div className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <img src={grouppyLogo} alt="Grouppy logo" className="h-50 w-auto object-contain mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome!</h2>
          <p className="text-white/60 text-sm mt-1">India's shared travel community</p>
        </motion.div>
      </div>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="bg-card rounded-t-3xl px-6 pt-8 pb-8 flex flex-col gap-5 shadow-2xl">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Enter Phone Number</h3>
          <p className="text-muted-foreground text-sm">We'll send a verification code</p>
        </div>
        <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5 border border-border">
          <span className="text-sm font-semibold text-foreground">🇮🇳 +91</span>
          <div className="w-px h-5 bg-border" />
          <input
            type="tel"
            placeholder="98765 43210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
        >
          Send OTP
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button className="w-full py-3.5 rounded-2xl border border-border bg-card flex items-center justify-center gap-3 font-semibold text-foreground text-sm hover:bg-muted transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <span className="text-primary font-semibold">Terms</span> &{" "}
          <span className="text-primary font-semibold">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}

// 3. OTP
function OtpScreen({ onDone }: { onDone: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v;
    setOtp(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
    if (next.every(d => d !== "")) setTimeout(onDone, 400);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-3 flex items-center">
        <button className="p-2 rounded-xl bg-muted"><ArrowLeft size={18} /></button>
      </div>
      <div className="flex-1 px-6 pt-8 flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Smartphone size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Verify OTP</h2>
          <p className="text-muted-foreground text-sm mt-1">Sent to <span className="text-foreground font-semibold">+91 98765 43210</span></p>
        </motion.div>
        <div className="flex gap-3 justify-between">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="tel"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              className="w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 bg-card text-foreground outline-none transition-all"
              style={{ borderColor: d ? G.primary : G.border }}
            />
          ))}
        </div>
        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl text-white font-bold text-base"
          style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
        >
          Verify & Continue
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Didn't receive? <span className="text-primary font-semibold">Resend in 00:42</span>
        </p>
      </div>
    </div>
  );
}

// 4. HOME
function HomeScreen() {
  const [localHire, setLocalHire] = useState(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [hours, setHours] = useState("6");
  const [passengers, setPassengers] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const route = localHire
    ? `Local hire from ${pickup.trim()}`
    : `${pickup.trim()} → ${destination.trim()} → ${pickup.trim()}`;
  const fieldClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm";
  const buttonClass = "w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <header className="bg-primary px-5 py-6 text-white">
        <p className="text-sm font-medium">Grouppy</p>
        <h1 className="mt-1 text-2xl font-bold">Plan a group trip</h1>
      </header>
      {reviewing ? (
        <section className="m-4 space-y-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-lg font-bold">Review your trip request</h2>
          <p className="break-words text-sm font-medium">{route}</p>
          <p className="text-sm">{departure.replace("T", " ")} · {hours} hours</p>
          <p className="text-sm">{passengers} {Number(passengers) === 1 ? "passenger" : "passengers"}</p>
          <p className="text-sm">Agencies can quote available vehicles with enough seats for your group.</p>
          <p className="text-sm text-muted-foreground">Preview only. Your request has yet to be sent to agencies.</p>
          <button className={buttonClass} onClick={() => setReviewing(false)}>Edit trip</button>
        </section>
      ) : (
        <form
          className="m-4 space-y-4 rounded-2xl border border-border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (pickup.trim() && (localHire || destination.trim())) setReviewing(true);
          }}
        >
          <label className="block space-y-1 text-sm font-semibold">
            <span>Trip type</span>
            <select className={fieldClass} value={localHire ? "local" : "round"} onChange={(event) => setLocalHire(event.target.value === "local")}>
              <option value="round">Destination round trip</option>
              <option value="local">Local hire</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            <span>Pickup address</span>
            <input className={fieldClass} required pattern=".*\S.*" value={pickup} onChange={(event) => setPickup(event.target.value)} />
          </label>
          {!localHire && (
            <label className="block space-y-1 text-sm font-semibold">
              <span>Destination address</span>
              <input className={fieldClass} required pattern=".*\S.*" value={destination} onChange={(event) => setDestination(event.target.value)} />
            </label>
          )}
          <label className="block space-y-1 text-sm font-semibold">
            <span>Pickup date and time</span>
            <input className={fieldClass} type="datetime-local" required value={departure} onChange={(event) => setDeparture(event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            <span>Trip duration in hours</span>
            <input className={fieldClass} type="number" min="6" step="1" required value={hours} onChange={(event) => setHours(event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm font-semibold">
            <span>How many people are travelling?</span>
            <input className={fieldClass} type="number" inputMode="numeric" min="1" step="1" required value={passengers} onChange={(event) => setPassengers(event.target.value)} />
          </label>
          <p className="text-xs text-muted-foreground">Vehicle options depend on your group size. Extra time or kilometres may cost more.</p>
          <button className={buttonClass} type="submit">Review trip request</button>
        </form>
      )}
    </div>
  );
}

// 5. SEARCH RESULTS
function ResultsScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const filters = ["All", "AC Only", "< ₹300", "Top Rated", "Morning"];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate("home")} className="p-2 rounded-xl bg-muted">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Mumbai</span>
              <ArrowRight size={14} className="text-muted-foreground" />
              <span className="font-bold text-foreground">Pune</span>
            </div>
            <p className="text-xs text-muted-foreground">Mon, Aug 5 · 1 Passenger</p>
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="p-2 rounded-xl bg-secondary border border-primary/20">
            <Filter size={16} className="text-primary" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map(f => (
            <Pill key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-card border-b border-border overflow-hidden">
            <div className="px-4 py-3 grid grid-cols-2 gap-3">
              {[["Vehicle Type", "Tempo / Van / Mini Bus"], ["Departure", "Morning / Evening"], ["AC", "AC / Non AC"], ["Rating", "4+ / 4.5+"]].map(([k, v]) => (
                <div key={k} className="bg-muted rounded-xl px-3 py-2">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="text-sm font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground font-medium">{VEHICLES.length} rides found for your route</p>
        {VEHICLES.map((v, i) => (
          <motion.button
            key={v.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            onClick={() => onNavigate("details")}
            className="bg-card rounded-3xl border border-border overflow-hidden text-left hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <VehicleImage photoId={v.image} h={140} />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-foreground text-base">{v.name}</h4>
                    {v.ac && <Badge color="primary"><Wind size={10} /> AC</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{v.agency}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-extrabold text-lg">₹{v.price}</p>
                  <p className="text-xs text-muted-foreground">per seat</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-3 border-y border-border my-2">
                <div className="text-center">
                  <p className="font-bold text-foreground text-base">{v.departure}</p>
                  <p className="text-xs text-muted-foreground">Departs</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs text-muted-foreground">{v.duration}</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="flex-1 h-px bg-border" />
                    <Bus size={12} className="text-primary" />
                    <div className="flex-1 h-px bg-border" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground text-base">{v.arrival}</p>
                  <p className="text-xs text-muted-foreground">Arrives</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StarRow rating={v.rating} count={v.reviews} />
                <div className="flex items-center gap-1">
                  <span className={cn("text-xs font-bold", v.seatsLeft <= 3 ? "text-red-500" : "text-green-600")}>
                    {v.seatsLeft} seats left
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// 6. VEHICLE DETAILS
function DetailsScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const v = VEHICLES[0];
  const [tab, setTab] = useState<"overview" | "amenities" | "reviews">("overview");

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="overflow-y-auto flex-1">
        {/* Hero Image */}
        <div className="relative h-56">
          <img src={`https://images.unsplash.com/${v.image}?w=600&h=400&fit=crop&auto=format`} alt={v.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button onClick={() => onNavigate("results")} className="absolute top-4 left-4 p-2 rounded-xl bg-black/30 backdrop-blur-sm">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 rounded-xl bg-black/30 backdrop-blur-sm"><Heart size={18} className="text-white" /></button>
            <button className="p-2 rounded-xl bg-black/30 backdrop-blur-sm"><Share2 size={18} className="text-white" /></button>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2">
              <Badge color="primary">{v.type}</Badge>
              {v.ac && <Badge color="gold">AC</Badge>}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{v.name}</h2>
              <p className="text-sm text-muted-foreground">{v.agency}</p>
              <div className="flex items-center gap-3 mt-1">
                <StarRow rating={v.rating} count={v.reviews} />
                <span className="text-xs text-muted-foreground">{v.seatsLeft} seats available</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary">₹{v.price}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </div>

          {/* Route */}
          <div className="bg-secondary rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{v.departure}</p>
                <p className="text-xs text-muted-foreground font-medium">Mumbai</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-semibold text-primary bg-white px-2 py-0.5 rounded-full">{v.duration}</p>
                <div className="w-full flex items-center">
                  <div className="flex-1 h-0.5 bg-primary/30" />
                  <Bus size={14} className="text-primary mx-1" />
                  <div className="flex-1 h-0.5 bg-primary/30" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{v.arrival}</p>
                <p className="text-xs text-muted-foreground font-medium">Pune</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-2xl">
            {(["overview", "amenities", "reviews"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all", tab === t ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>{t}</button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="flex flex-col gap-3">
              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{v.driverName}</p>
                  <p className="text-xs text-muted-foreground">Driver · <StarRow rating={v.driverRating} /> · 5+ yrs exp</p>
                </div>
                <button className="p-2.5 rounded-xl bg-secondary"><Phone size={16} className="text-primary" /></button>
              </div>
              {[
                { icon: MapPin, label: "Pickup", value: v.pickup },
                { icon: MapPin, label: "Drop", value: v.drop },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label} Point</p>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "amenities" && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Wind, label: "Air Conditioning" },
                { icon: Usb, label: "USB Charging" },
                { icon: Volume2, label: "Music System" },
                { icon: Wifi, label: "WiFi (select)" },
                { icon: Coffee, label: "Rest Stops" },
                { icon: Shield, label: "GPS Tracking" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-card rounded-2xl border border-border p-3 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground text-center">{label}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="flex flex-col gap-3">
              {[
                { name: "Amit Patel", rating: 5, comment: "Excellent service! Driver was punctual and the vehicle was very clean.", date: "Jul 28" },
                { name: "Sneha Iyer", rating: 4, comment: "Good ride overall. AC was perfectly cold. Will book again.", date: "Jul 20" },
                { name: "Rahul Verma", rating: 5, comment: "Best way to travel Mumbai-Pune. Saved ₹200 vs other options!", date: "Jul 15" },
              ].map((r, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{r.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <StarRow rating={r.rating} />
                    </div>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 bg-card border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">{v.seatsLeft} seats available</p>
            <p className="text-xl font-extrabold text-primary">₹{v.price} <span className="text-sm text-muted-foreground font-normal">/seat</span></p>
          </div>
          <button
            onClick={() => onNavigate("seats")}
            className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. SEAT SELECTION
function SeatsScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const bookedSeats = [1, 4, 8, 11, 14];
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    if (bookedSeats.includes(id)) return;
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 2 ? [...prev, id] : prev);
  };

  const rows = [
    { label: "A", seats: [1, 2, 3, null, 4] },
    { label: "B", seats: [5, 6, 7, null, 8] },
    { label: "C", seats: [9, 10, 11, null, 12] },
    { label: "D", seats: [13, 14, 15, null, 16] },
    { label: "E", seats: [17, null, null, null, null] },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <BackHeader title="Select Seats" onBack={() => onNavigate("details")} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mb-5">
          {[
            { color: "bg-muted border border-border", label: "Available" },
            { color: "bg-primary", label: "Selected" },
            { color: "bg-border border border-border", label: "Booked" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("w-5 h-5 rounded-md", color)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Vehicle front indicator */}
        <div className="flex justify-center mb-4">
          <div className="px-6 py-2 bg-secondary rounded-full border border-primary/20">
            <div className="flex items-center gap-2">
              <Car size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">DRIVER FRONT</span>
            </div>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="bg-card rounded-3xl border border-border p-4 flex flex-col gap-3">
          {rows.map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4 font-bold">{row.label}</span>
              <div className="flex-1 flex gap-2">
                {row.seats.map((seat, j) =>
                  seat === null ? (
                    <div key={j} className="flex-1" />
                  ) : (
                    <motion.button
                      key={seat}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggle(seat)}
                      className={cn(
                        "flex-1 aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                        bookedSeats.includes(seat)
                          ? "bg-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                          : selected.includes(seat)
                          ? "text-white shadow-md"
                          : "bg-muted border border-border text-muted-foreground hover:border-primary/40"
                      )}
                      style={selected.includes(seat) ? { background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` } : {}}
                    >
                      {seat}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {selected.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-secondary rounded-2xl border border-primary/20 p-4">
            <p className="text-sm font-semibold text-primary">Selected: Seat {selected.join(", ")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">₹{VEHICLES[0].price * selected.length} total for {selected.length} seat{selected.length > 1 ? "s" : ""}</p>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-4 bg-card border-t border-border">
        <button
          onClick={() => selected.length > 0 && onNavigate("passenger")}
          className={cn("w-full py-4 rounded-2xl text-white font-bold text-sm transition-all", selected.length === 0 ? "opacity-40" : "active:scale-95")}
          style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
        >
          {selected.length > 0 ? `Continue — ₹${VEHICLES[0].price * selected.length}` : "Select at least 1 seat"}
        </button>
      </div>
    </div>
  );
}

// 8. PASSENGER DETAILS
function PassengerScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const [name, setName] = useState("Priya Sharma");
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState("Female");
  const [phone, setPhone] = useState("98765 43210");

  return (
    <div className="flex flex-col h-full bg-background">
      <BackHeader title="Passenger Details" onBack={() => onNavigate("seats")} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4">
        <div className="bg-secondary rounded-2xl p-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-primary" />
          <p className="text-xs text-primary font-medium">Details required as per Govt. norms for shared transport.</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-4 flex flex-col gap-4">
          <h3 className="font-bold text-foreground">Passenger 1 — Seat B3</h3>
          {[
            { label: "Full Name", value: name, setter: setName, type: "text", placeholder: "As per ID proof" },
            { label: "Age", value: age, setter: setAge, type: "tel", placeholder: "Enter age" },
            { label: "Phone Number", value: phone, setter: setPhone, type: "tel", placeholder: "10-digit mobile" },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</label>
              <input
                type={type}
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-muted rounded-2xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground border border-border outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn("flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-all", gender === g ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border")}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground text-sm">Fare Summary</h3>
          </div>
          {[
            ["Base Fare × 1 seat", "₹349"],
            ["Convenience Fee", "₹18"],
            ["GST (5%)", "₹18"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">{k}</span>
              <span className="text-sm font-semibold text-foreground">{v}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-1 flex items-center justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-extrabold text-primary text-lg">₹385</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 bg-card border-t border-border">
        <button
          onClick={() => onNavigate("payment")}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm active:scale-95"
          style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
        >
          Proceed to Payment — ₹385
        </button>
      </div>
    </div>
  );
}

// 9. PAYMENT
function PaymentScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("priya@paytm");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onNavigate("confirmed"); }, 1800);
  };

  const methods = [
    { id: "upi", icon: Smartphone, label: "UPI", sub: "PhonePe / GPay / Paytm" },
    { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
    { id: "wallet", icon: Wallet, label: "Grouppy Wallet", sub: "Balance: ₹750" },
    { id: "netbanking", icon: Banknote, label: "Net Banking", sub: "All major banks" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <BackHeader title="Payment" onBack={() => onNavigate("passenger")} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4">
        {/* Amount */}
        <div className="bg-card rounded-3xl border border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Amount to Pay</p>
            <p className="text-2xl font-extrabold text-primary">₹385</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Mumbai → Pune</p>
            <p className="text-xs text-foreground font-semibold">Aug 5 · 06:30 AM · Seat B3</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-2">
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn("bg-card rounded-2xl border p-4 flex items-center gap-3 transition-all", method === m.id ? "border-primary shadow-sm" : "border-border")}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", method === m.id ? "bg-secondary" : "bg-muted")}>
                <m.icon size={18} className={method === m.id ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </div>
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", method === m.id ? "border-primary" : "border-border")}>
                {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>

        {method === "upi" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">UPI ID</label>
            <input
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="w-full bg-muted rounded-2xl px-4 py-3 text-sm font-medium text-foreground border border-border outline-none focus:border-primary transition-colors"
            />
          </motion.div>
        )}

        <div className="bg-secondary rounded-2xl p-3 flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <p className="text-xs text-primary font-medium">Secured by 256-bit SSL encryption. Payments processed by Razorpay.</p>
        </div>
      </div>

      <div className="px-4 py-4 bg-card border-t border-border">
        <motion.button
          onClick={handlePay}
          disabled={processing}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
        >
          {processing ? (
            <><RefreshCw size={16} className="animate-spin" /> Processing Payment...</>
          ) : (
            <><Shield size={16} /> Pay Securely — ₹385</>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// 10. BOOKING CONFIRMED
function ConfirmedScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto">
        {/* Success Hero */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6" style={{ background: `linear-gradient(160deg, ${G.primaryDark} 0%, ${G.primary} 100%)` }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4"
          >
            <CheckCircle size={44} className="text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
            <h2 className="text-2xl font-extrabold text-white">Booking Confirmed!</h2>
            <p className="text-white/70 text-sm mt-1">Have a great trip, Priya 🎉</p>
            <div className="mt-3 bg-white/15 backdrop-blur-sm px-5 py-2 rounded-2xl">
              <p className="text-white/60 text-xs">Booking ID</p>
              <p className="text-white font-extrabold text-base tracking-wider">GRP-2847-MUM</p>
            </div>
          </motion.div>
        </div>

        <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
          {/* QR Code */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-3xl border border-border p-5 flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
              <QrCode size={60} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Show this QR at pickup</p>
          </motion.div>

          {/* Trip Details */}
          <div className="bg-card rounded-3xl border border-border p-4 flex flex-col gap-3">
            <h3 className="font-bold text-foreground text-sm">Trip Details</h3>
            {[
              { label: "Route", value: "Mumbai → Pune" },
              { label: "Date & Time", value: "Mon, Aug 5 · 06:30 AM" },
              { label: "Vehicle", value: "Force Traveller 17+1" },
              { label: "Seat", value: "B3" },
              { label: "Pickup", value: "Dadar Bus Stop, Mumbai" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>

          {/* Driver Card */}
          <div className="bg-card rounded-3xl border border-border p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <User size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">Rajan Mishra</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRow rating={4.9} />
                <span className="text-xs text-muted-foreground">· MH-12 AB 1234</span>
              </div>
            </div>
            <button className="p-2.5 rounded-xl bg-secondary"><Phone size={16} className="text-primary" /></button>
          </div>

          {/* Navigate Button */}
          <button className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-secondary text-primary border border-primary/20">
            <Navigation size={16} />
            Navigate to Pickup Point
          </button>
        </div>
      </div>

      <div className="px-4 py-4 bg-card border-t border-border flex gap-3">
        <button onClick={() => onNavigate("trips")} className="flex-1 py-3.5 rounded-2xl border border-border text-sm font-bold text-foreground">View My Trips</button>
        <button onClick={() => onNavigate("home")} className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}>Back to Home</button>
      </div>
    </div>
  );
}

// 11. MY TRIPS
function TripsScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const filtered = TRIPS.filter(t => t.status === tab);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card border-b border-border px-4 pt-4 pb-0">
        <h2 className="text-xl font-bold text-foreground mb-3">My Trips</h2>
        <div className="flex gap-0 border-b border-border">
          {(["upcoming", "completed", "cancelled"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <Bus size={28} className="text-primary opacity-50" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">No {tab} trips</p>
            <button onClick={() => onNavigate("home")} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">Book a Trip</button>
          </div>
        ) : filtered.map((trip, i) => (
          <motion.div key={trip.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card rounded-3xl border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground text-base">{trip.route}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{trip.date} · {trip.time}</p>
              </div>
              <Badge color={trip.status === "upcoming" ? "primary" : trip.status === "completed" ? "success" : "danger"}>
                {trip.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <div className="flex-1 flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">{trip.vehicle} · Seat {trip.seat}</p>
                <p className="font-bold text-primary">₹{trip.price}</p>
              </div>
              {trip.status === "upcoming" && (
                <button onClick={() => onNavigate("live")} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">Track Live</button>
              )}
              {trip.status === "completed" && (
                <button className="px-4 py-2 rounded-xl bg-secondary text-primary text-xs font-bold border border-primary/20">Rate Trip</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 12. LIVE TRIP
function LiveScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const [showSOS, setShowSOS] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background">
      <BackHeader title="Live Trip" onBack={() => onNavigate("trips")} rightSlot={
        <button className="p-2 rounded-xl bg-muted"><Share2 size={16} /></button>
      } />

      {/* Map */}
      <div className="relative h-56 bg-muted overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop&auto=format" alt="Map" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary shadow-xl flex items-center justify-center border-4 border-white">
            <Bus size={20} className="text-white" />
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <div className="bg-card rounded-2xl px-4 py-2 shadow-lg border border-border">
            <p className="text-xs font-bold text-primary">En Route — 47 km remaining</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {/* Status Card */}
        <div className="bg-card rounded-3xl border border-primary/20 p-4 bg-secondary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Estimated Arrival</p>
              <p className="text-2xl font-extrabold text-primary">09:50 AM</p>
              <p className="text-xs text-muted-foreground">On time · 1h 20m remaining</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-1">
                <Activity size={20} className="text-white" />
              </div>
              <p className="text-xs text-primary font-bold">LIVE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
            </div>
            <span className="text-xs font-bold text-primary">60%</span>
          </div>
        </div>

        {/* Driver */}
        <div className="bg-card rounded-3xl border border-border p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <User size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Rajan Mishra</p>
            <p className="text-xs text-muted-foreground">Force Traveller · MH-12 AB 1234</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl bg-secondary"><Phone size={16} className="text-primary" /></button>
            <button className="p-2.5 rounded-xl bg-secondary"><MessageSquare size={16} className="text-primary" /></button>
          </div>
        </div>

        {/* Next Stop */}
        <div className="bg-card rounded-3xl border border-border p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Next Stop</p>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-amber-500" />
            <p className="font-semibold text-foreground">Khopoli Rest Area</p>
            <span className="ml-auto text-xs text-muted-foreground">15 min</span>
          </div>
        </div>

        {/* SOS Button */}
        <motion.button
          onClick={() => setShowSOS(true)}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
          style={{ background: `linear-gradient(135deg, #D4183D, #9B0F2B)` }}
        >
          <AlertTriangle size={18} />
          SOS Emergency
        </motion.button>

        <AnimatePresence>
          {showSOS && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">
              <div className="bg-card rounded-3xl p-6 w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    <h3 className="font-bold text-foreground">Emergency SOS</h3>
                  </div>
                  <button onClick={() => setShowSOS(false)} className="p-1.5 rounded-xl bg-muted"><X size={16} /></button>
                </div>
                <p className="text-sm text-muted-foreground">Alert will be sent to Grouppy safety team, your emergency contact, and local police.</p>
                <button className="w-full py-4 rounded-2xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #D4183D, #9B0F2B)" }}>Confirm SOS Alert</button>
                <button onClick={() => setShowSOS(false)} className="w-full py-3 rounded-2xl border border-border text-sm font-semibold text-muted-foreground">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 13. PROFILE
function ProfileScreen({ onNavigate }: { onNavigate: (s: CustomerScreen) => void }) {
  const items = [
    { icon: Wallet, label: "Grouppy Wallet", sub: "Balance: ₹750", color: G.gold },
    { icon: Users, label: "Saved Passengers", sub: "3 saved profiles" },
    { icon: CreditCard, label: "Payment Methods", sub: "UPI, Card added" },
    { icon: Bell, label: "Notifications", sub: "All alerts enabled" },
    { icon: Shield, label: "Safety Settings", sub: "SOS contacts set" },
    { icon: HelpCircle, label: "Help & Support", sub: "24/7 chat support" },
    { icon: Settings, label: "Settings", sub: "Language, preferences" },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-6" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl font-extrabold">PS</span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-extrabold text-xl">Priya Sharma</h2>
            <p className="text-white/70 text-sm">+91 98765 43210</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color="gold"><Award size={10} /> Gold Member</Badge>
              <span className="text-white/50 text-xs">12 trips</span>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-white/10"><Edit3 size={16} className="text-white" /></button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-3">
        {/* Wallet Quick */}
        <div className="bg-card rounded-3xl border border-border p-4 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${G.goldLight}, #FFF)` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: G.gold }}>
            <Wallet size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Grouppy Wallet</p>
            <p className="font-extrabold text-foreground text-lg">₹750</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: G.gold }}>Add Money</button>
        </div>

        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          {items.map(({ icon: Icon, label, sub, color }, i) => (
            <button key={label} className={cn("w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors text-left", i > 0 ? "border-t border-border" : "")}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Icon size={18} style={{ color: color || G.primary }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2">
          <LogOut size={16} />
          Sign Out
        </button>
        <p className="text-center text-xs text-muted-foreground">Grouppy v2.4.1 · India's Shared Ride Platform</p>
      </div>
    </div>
  );
}

// ─── AGENCY SCREENS ────────────────────────────────────────────────────────────

function AgencyDashboard({ onNavigate }: { onNavigate: (s: AgencyScreen) => void }) {
  const stats = [
    { label: "Today's Bookings", value: "24", icon: Package, delta: "+8%" },
    { label: "Revenue Today", value: "₹8,640", icon: TrendingUp, delta: "+12%" },
    { label: "Pending Requests", value: "6", icon: AlertCircle, delta: "2 urgent" },
    { label: "Active Vehicles", value: "4", icon: Truck, delta: "1 en route" },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-5 pb-4" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs">Agency Dashboard</p>
            <h2 className="text-white text-xl font-bold">Sai Travels</h2>
          </div>
          <button className="relative p-2 rounded-xl bg-white/10">
            <Bell size={18} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon: Icon, delta }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className="text-white/70" />
                <span className="text-xs text-white/60 font-medium">{delta}</span>
              </div>
              <p className="text-white text-lg font-extrabold">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 flex flex-col gap-4">
        {/* Today's Schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Today's Trips</h3>
            <button className="text-primary text-xs font-semibold">See all</button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { route: "Mumbai → Pune", time: "06:30 AM", seats: "17/17", driver: "Rajan Mishra", status: "completed" },
              { route: "Mumbai → Nashik", time: "10:00 AM", seats: "12/17", driver: "Vijay Patil", status: "ongoing" },
              { route: "Mumbai → Pune", time: "02:00 PM", seats: "5/17", driver: "Suresh Kumar", status: "upcoming" },
            ].map((t, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-3.5 flex items-center gap-3">
                <div className={cn("w-2 h-10 rounded-full", t.status === "completed" ? "bg-green-400" : t.status === "ongoing" ? "bg-primary" : "bg-amber-400")} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{t.route}</p>
                  <p className="text-xs text-muted-foreground">{t.time} · {t.driver}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{t.seats}</p>
                  <Badge color={t.status === "completed" ? "success" : t.status === "ongoing" ? "primary" : "warning"}>{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Add Vehicle", icon: Plus, action: "vehicles" as AgencyScreen },
            { label: "View Requests", icon: Package, action: "requests" as AgencyScreen },
            { label: "Assign Driver", icon: User, action: "drivers" as AgencyScreen },
            { label: "Revenue Report", icon: BarChart2, action: "revenue" as AgencyScreen },
          ].map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={() => onNavigate(action)} className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
              <span className="text-xs font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VehiclesScreen({ onNavigate }: { onNavigate: (s: AgencyScreen) => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card border-b border-border px-4 pt-4 pb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Vehicles</h2>
        <button onClick={() => onNavigate("addVehicle")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold">
          <Plus size={14} /> Add Vehicle
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {[
          { name: "Force Traveller 17+1", reg: "MH-12 AB 1234", seats: 17, status: "active", trips: 284, rating: 4.7, image: "photo-1558618666-fcd25c85cd64" },
          { name: "Tata Winger 13-Seat", reg: "MH-12 CD 5678", seats: 13, status: "maintenance", trips: 156, rating: 4.4, image: "photo-1544620347-c4fd4a3d5957" },
          { name: "Mahindra Supro 9-Seat", reg: "MH-12 EF 9012", seats: 9, status: "idle", trips: 98, rating: 4.2, image: "photo-1449965408869-eaa3f722e40d" },
        ].map((v, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="h-28 relative">
              <img src={`https://images.unsplash.com/${v.image}?w=600&h=200&fit=crop&auto=format`} alt={v.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <Badge color={v.status === "active" ? "success" : v.status === "maintenance" ? "warning" : "muted"}>{v.status}</Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.reg} · {v.seats} seats</p>
                </div>
                <button className="p-2 rounded-xl bg-muted"><Edit3 size={14} className="text-muted-foreground" /></button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold">{v.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">{v.trips} trips</span>
                <button className="ml-auto px-3 py-1.5 rounded-xl bg-secondary text-primary text-xs font-bold border border-primary/20">Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingRequestsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending");
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card border-b border-border px-4 pt-4 pb-0">
        <h2 className="text-xl font-bold text-foreground mb-3">Booking Requests</h2>
        <div className="flex border-b border-border">
          {(["pending", "accepted", "rejected"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={cn("flex-1 pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px", activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {activeTab === "pending" && [
          { id: "REQ-001", name: "Ankit Malhotra", route: "Mumbai → Pune", date: "Aug 5", seats: 3, amount: "₹1,047", time: "2 min ago" },
          { id: "REQ-002", name: "Divya Nair", route: "Mumbai → Nashik", date: "Aug 6", seats: 1, amount: "₹399", time: "15 min ago" },
          { id: "REQ-003", name: "Karan Mehta", route: "Mumbai → Pune", date: "Aug 7", seats: 2, amount: "₹698", time: "1h ago" },
        ].map((req, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{req.name}</p>
                <p className="text-xs text-muted-foreground">{req.id} · {req.time}</p>
              </div>
              <span className="font-extrabold text-primary">{req.amount}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin size={11} className="text-primary" />{req.route}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{req.date}</span>
              <span className="flex items-center gap-1"><Users size={11} />{req.seats} seats</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-secondary border border-primary/20 text-primary font-bold text-xs">Accept</button>
              <button className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold text-xs">Reject</button>
              <button className="flex-1 py-2.5 rounded-xl border border-amber-200 text-amber-700 font-bold text-xs bg-amber-50">Counter</button>
            </div>
          </div>
        ))}
        {activeTab !== "pending" && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <Package size={24} className="text-primary opacity-50" />
            </div>
            <p className="text-muted-foreground text-sm">No {activeTab} requests</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueScreen() {
  const months = ["Apr", "May", "Jun", "Jul", "Aug"];
  const values = [42000, 58000, 51000, 72000, 38000];
  const max = Math.max(...values);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
        <h2 className="text-xl font-bold text-foreground">Revenue Analytics</h2>
      </div>
      <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "This Month", value: "₹2,16,450", delta: "+18%", color: G.primary },
            { label: "This Week", value: "₹52,800", delta: "+11%", color: G.gold },
            { label: "Total Bookings", value: "1,284", delta: "+24%", color: G.primary },
            { label: "Avg Seat Rate", value: "₹312", delta: "+5%", color: G.gold },
          ].map(({ label, value, delta, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-lg font-extrabold text-foreground">{value}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color }}>{delta} vs last period</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-3xl border border-border p-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Monthly Revenue</h3>
          <div className="flex items-end gap-3 h-28">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(values[i] / max) * 100}%` }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 100 }}
                  className="w-full rounded-t-xl"
                  style={{ background: i === 3 ? `linear-gradient(180deg, ${G.primary}, ${G.primaryDark})` : G.muted, minHeight: 4 }}
                />
                <span className="text-xs text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-card rounded-3xl border border-border p-4">
          <h3 className="font-bold text-foreground text-sm mb-3">Top Revenue Routes</h3>
          {[
            { route: "Mumbai → Pune", revenue: "₹84,200", share: 39, trips: 241 },
            { route: "Mumbai → Nashik", revenue: "₹51,600", share: 24, trips: 142 },
            { route: "Pune → Mumbai", revenue: "₹38,400", share: 18, trips: 110 },
          ].map((r, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{r.route}</span>
                <span className="text-sm font-bold text-primary">{r.revenue}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${r.share}%` }} transition={{ delay: 0.2 + i * 0.1 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${G.primary}, #1A8A5A)` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{r.trips} trips · {r.share}% of revenue</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgencyProfileScreen() {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-6 pb-6" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl font-extrabold">ST</span>
          </div>
          <div>
            <h2 className="text-white font-extrabold text-xl">Sai Travels</h2>
            <p className="text-white/70 text-sm">Agency ID: AGN-0042</p>
            <div className="flex items-center gap-1 mt-0.5">
              <StarRow rating={4.8} count={284} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[["17", "Vehicles"], ["4", "Drivers"], ["1,284", "Trips"]].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-white font-extrabold text-lg">{v}</p>
              <p className="text-white/60 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 pb-6 flex flex-col gap-3">
        {[
          { icon: Truck, label: "Fleet Management", sub: "3 active, 1 maintenance" },
          { icon: Users, label: "Driver Roster", sub: "4 verified drivers" },
          { icon: Calendar, label: "Availability Calendar", sub: "Set off-days & schedules" },
          { icon: Award, label: "Agency Verification", sub: "Govt certified ✓" },
          { icon: Bell, label: "Notifications", sub: "Booking alerts enabled" },
          { icon: Settings, label: "Settings", sub: "Commission, pricing" },
          { icon: HelpCircle, label: "Support", sub: "Agency helpdesk" },
        ].map(({ icon: Icon, label, sub }, i) => (
          <button key={label} className={cn("w-full flex items-center gap-3 bg-card px-4 py-3.5 hover:bg-muted transition-colors text-left rounded-2xl border border-border", i === 0 ? "mt-0" : "")}>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── DRIVER SCREENS ────────────────────────────────────────────────────────────

function DriverDashboard({ onNavigate }: { onNavigate: (s: DriverScreen) => void }) {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-5 pb-5" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/60 text-xs">Driver App</p>
            <h2 className="text-white text-xl font-bold">Rajan Mishra</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-400/20 px-3 py-1.5 rounded-full border border-green-400/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs font-bold">Online</span>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-3xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/70 text-sm font-medium">Today's Summary</p>
            <span className="text-white/50 text-xs">Jul 30, 2026</span>
          </div>
          <div className="flex gap-4">
            {[["3", "Trips"], ["₹2,840", "Earned"], ["4.9★", "Rating"]].map(([v, l]) => (
              <div key={l} className="flex-1 text-center">
                <p className="text-white font-extrabold text-xl">{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 flex flex-col gap-4">
        {/* Next Trip */}
        <div className="bg-card rounded-3xl border border-primary/20 p-4 bg-secondary">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Next Trip · 02:00 PM</span>
          </div>
          <p className="font-bold text-foreground text-base mb-1">Mumbai → Pune</p>
          <p className="text-sm text-muted-foreground mb-3">5 passengers confirmed · Force Traveller</p>
          <button onClick={() => onNavigate("navigation")} className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}>
            <Navigation size={16} /> Start Navigation
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "This Week", value: "₹12,400", sub: "18 trips", icon: DollarSign },
            { label: "Acceptance Rate", value: "96%", sub: "last 30 days", icon: CheckCircle },
            { label: "On-time Rate", value: "98%", sub: "excellent", icon: Clock },
            { label: "Overall Rating", value: "4.9/5", sub: "284 reviews", icon: Star },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="font-extrabold text-foreground text-base">{value}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TodayTripsScreen({ onNavigate }: { onNavigate: (s: DriverScreen) => void }) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
        <h2 className="text-xl font-bold text-foreground">Today's Trips</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Wednesday, Jul 30</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        {[
          { route: "Mumbai → Pune", time: "06:30 AM", passengers: 17, status: "completed", earnings: "₹980" },
          { route: "Pune → Mumbai", time: "11:00 AM", passengers: 14, status: "completed", earnings: "₹840" },
          { route: "Mumbai → Pune", time: "02:00 PM", passengers: 5, status: "upcoming", earnings: "₹--" },
        ].map((t, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{t.route}</p>
                <p className="text-xs text-muted-foreground">{t.time} · {t.passengers} passengers</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-primary">{t.earnings}</p>
                <Badge color={t.status === "completed" ? "success" : "warning"}>{t.status}</Badge>
              </div>
            </div>
            {t.status === "upcoming" && (
              <div className="flex gap-2">
                <button onClick={() => onNavigate("verification")} className="flex-1 py-2.5 rounded-xl bg-secondary text-primary text-xs font-bold border border-primary/20">Verify Passengers</button>
                <button onClick={() => onNavigate("navigation")} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">Navigate</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavigationScreen({ onNavigate }: { onNavigate: (s: DriverScreen) => void }) {
  const [tripStarted, setTripStarted] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Map View */}
      <div className="relative flex-1">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=800&fit=crop&auto=format" alt="Navigation map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Top Nav Bar */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-4">
          <div className="bg-card rounded-2xl p-3 shadow-xl flex items-center gap-3">
            <button onClick={() => onNavigate("driverDash")} className="p-1.5 rounded-xl bg-muted"><ArrowLeft size={16} /></button>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Destination</p>
              <p className="font-bold text-foreground text-sm">Shivajinagar, Pune</p>
            </div>
            <div className="bg-secondary px-3 py-1.5 rounded-xl">
              <p className="text-xs font-bold text-primary">3h 20m</p>
            </div>
          </div>
        </div>

        {/* Vehicle Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-14 h-14 rounded-full bg-primary shadow-2xl flex items-center justify-center border-4 border-white">
            <Truck size={22} className="text-white" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-primary" />
        </div>

        {/* Bottom Panel */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="bg-card rounded-3xl p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Next Pickup</p>
                <p className="font-bold text-foreground">Dadar Bus Stop</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-bold text-primary">2.4 km</p>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">5 passengers waiting</span>
              </div>
              <button onClick={() => onNavigate("verification")} className="text-xs font-bold text-primary">View</button>
            </div>
            <button
              onClick={() => setTripStarted(!tripStarted)}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: tripStarted ? "linear-gradient(135deg, #D4183D, #9B0F2B)" : `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}
            >
              {tripStarted ? <><StopCircle size={16} /> End Trip</> : <><PlayCircle size={16} /> Start Trip</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassengerVerificationScreen({ onNavigate }: { onNavigate: (s: DriverScreen) => void }) {
  const passengers = [
    { name: "Priya Sharma", seat: "B3", phone: "+91 98765 43210", verified: true },
    { name: "Ankit Malhotra", seat: "A1", phone: "+91 87654 32109", verified: false },
    { name: "Sneha Iyer", seat: "C2", phone: "+91 76543 21098", verified: false },
    { name: "Rahul Verma", seat: "D4", phone: "+91 65432 10987", verified: true },
    { name: "Kavita Singh", seat: "A3", phone: "+91 54321 09876", verified: false },
  ];
  const [verified, setVerified] = useState(passengers.map(p => p.verified));

  return (
    <div className="flex flex-col h-full bg-background">
      <BackHeader title="Passenger Verification" onBack={() => onNavigate("todayTrips")} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        <div className="bg-secondary rounded-2xl p-3 flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <p className="text-xs text-primary font-medium">Verify each passenger by scanning their QR code or checking booking ID.</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Passengers ({passengers.length})</span>
          <span className="text-xs text-muted-foreground">{verified.filter(Boolean).length} verified</span>
        </div>
        {passengers.map((p, i) => (
          <div key={i} className={cn("bg-card rounded-2xl border p-4 flex items-center gap-3", verified[i] ? "border-green-200 bg-green-50/50" : "border-border")}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", verified[i] ? "bg-green-100" : "bg-secondary")}>
              <span className={cn("font-bold text-sm", verified[i] ? "text-green-700" : "text-primary")}>{p.name[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">Seat {p.seat} · {p.phone}</p>
            </div>
            <button
              onClick={() => { const n = [...verified]; n[i] = !n[i]; setVerified(n); }}
              className={cn("p-2 rounded-xl transition-all", verified[i] ? "bg-green-500 text-white" : "bg-muted text-muted-foreground")}
            >
              <Check size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 py-4 bg-card border-t border-border">
        <button onClick={() => onNavigate("navigation")} className="w-full py-4 rounded-2xl text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}>
          Start Trip ({verified.filter(Boolean).length}/{passengers.length} verified)
        </button>
      </div>
    </div>
  );
}

function DriverEarningsScreen() {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-5 pb-5" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <h2 className="text-xl font-bold text-white mb-4">My Earnings</h2>
        <div className="bg-white/10 rounded-3xl p-4 border border-white/10 text-center">
          <p className="text-white/60 text-sm">Total Earned (Jul)</p>
          <p className="text-white text-3xl font-extrabold mt-1">₹38,240</p>
          <p className="text-green-300 text-xs font-semibold mt-1">↑ 14% vs last month</p>
        </div>
      </div>
      <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Today", value: "₹2,840", sub: "3 trips" },
            { label: "This Week", value: "₹12,400", sub: "18 trips" },
            { label: "Bonus Earned", value: "₹1,200", sub: "On-time bonus" },
            { label: "Avg per Trip", value: "₹756", sub: "This month" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-extrabold text-foreground text-lg">{value}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground text-sm">Recent Payouts</h3>
            <button className="text-primary text-xs font-semibold">Withdraw</button>
          </div>
          {[
            { date: "Jul 28", amount: "₹4,200", trips: 5, status: "credited" },
            { date: "Jul 21", amount: "₹3,800", trips: 4, status: "credited" },
            { date: "Jul 14", amount: "₹5,100", trips: 6, status: "credited" },
          ].map((p, i) => (
            <div key={i} className={cn("flex items-center gap-3 py-3", i < 2 ? "border-b border-border" : "")}>
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <DollarSign size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">₹{p.amount.replace("₹", "")} payout</p>
                <p className="text-xs text-muted-foreground">{p.date} · {p.trips} trips</p>
              </div>
              <Badge color="success">{p.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DriverProfileScreen() {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="px-4 pt-6 pb-6" style={{ background: `linear-gradient(160deg, ${G.primaryDark}, ${G.primary})` }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl font-extrabold">RM</span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-extrabold text-xl">Rajan Mishra</h2>
            <p className="text-white/70 text-sm">+91 98765 43210</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRow rating={4.9} count={284} />
              <span className="text-white/50 text-xs">· 5 yrs exp</span>
            </div>
          </div>
          <Badge color="gold"><Award size={10} /> Top Driver</Badge>
        </div>
      </div>
      <div className="px-4 pt-4 pb-6 flex flex-col gap-3">
        {[
          { icon: Car, label: "My Vehicle", sub: "Force Traveller · MH-12 AB 1234" },
          { icon: Award, label: "Certificates", sub: "License, PUC, Fitness valid" },
          { icon: Star, label: "My Ratings", sub: "4.9★ · 284 reviews" },
          { icon: Activity, label: "Trip History", sub: "624 trips completed" },
          { icon: Bell, label: "Notifications", sub: "Trip alerts enabled" },
          { icon: HelpCircle, label: "Help & Support", sub: "Driver helpdesk" },
          { icon: Settings, label: "Settings", sub: "Language, preferences" },
        ].map(({ icon: Icon, label, sub }, i) => (
          <button key={label} className="w-full flex items-center gap-3 bg-card px-4 py-3.5 text-left rounded-2xl border border-border hover:bg-muted transition-colors">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
        <button className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── MODE SWITCHER ─────────────────────────────────────────────────────────────
function ModeSwitcher({ mode, onSwitch }: { mode: AppMode; onSwitch: (m: AppMode) => void }) {
  const modes: { id: AppMode; label: string; color: string }[] = [
    { id: "customer", label: "Customer", color: G.primary },
    { id: "agency", label: "Agency", color: G.primaryDark },
    { id: "driver", label: "Driver", color: "#1A5276" },
  ];
  return (
    <div className="flex bg-muted rounded-2xl p-1 mx-4 my-2">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => onSwitch(m.id)}
          className={cn("flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize", mode === m.id ? "bg-card shadow-sm" : "text-muted-foreground")}
          style={mode === m.id ? { color: m.color } : {}}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("customer");

  // Customer flow
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>("home");
  // Agency flow
  const [agencyScreen, setAgencyScreen] = useState<AgencyScreen>("dashboard");
  // Driver flow
  const [driverScreen, setDriverScreen] = useState<DriverScreen>("driverDash");

  const switchMode = (m: AppMode) => {
    setAppMode(m);
    if (m === "customer" && customerScreen === "splash") setCustomerScreen("home");
  };

  const navScreens: CustomerScreen[] = ["home", "trips", "live", "profile"];
  const agencyNavScreens: AgencyScreen[] = ["dashboard", "vehicles", "requests", "revenue", "agencyProfile"];
  const driverNavScreens: DriverScreen[] = ["driverDash", "todayTrips", "navigation", "earnings", "driverProfile"];

  const showCustomerNav = navScreens.includes(customerScreen);
  const showAgencyNav = agencyNavScreens.includes(agencyScreen);
  const showDriverNav = driverNavScreens.includes(driverScreen);

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "linear-gradient(135deg, #0D3B26 0%, #1A6B47 50%, #0D3B26 100%)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Phone Frame */}
      <div className="relative w-full max-w-[390px] mx-auto" style={{ height: "min(844px, 100dvh)" }}>
        {/* Phone shell */}
        <div className="absolute inset-0 rounded-[48px] bg-gray-900 shadow-2xl" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)" }} />

        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[46px] overflow-hidden bg-background flex flex-col">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 shrink-0 z-10" style={{ background: appMode === "customer" && !["home", "results", "details", "trips", "live", "profile", "splash", "login", "otp"].includes(customerScreen) ? G.background : customerScreen === "home" || agencyScreen === "dashboard" || driverScreen === "driverDash" ? G.primaryDark : "transparent" }}>
            <span className="text-xs font-bold text-white/80">9:41</span>
            <div className="flex items-center gap-1">
              <Radio size={11} className="text-white/80" />
              <Wifi size={11} className="text-white/80" />
              <div className="w-5 h-2.5 border border-white/60 rounded-sm flex items-center px-0.5">
                <div className="h-1.5 bg-white/80 rounded-sm flex-1 mr-0.5" />
                <div className="h-1.5 w-0.5 bg-white/40 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Mode Switcher (hidden during immersive screens) */}
          {!["splash", "login", "otp"].includes(customerScreen) && (
            <div className="shrink-0 bg-card border-b border-border">
              <ModeSwitcher mode={appMode} onSwitch={switchMode} />
            </div>
          )}

          {/* Screen Content */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {appMode === "customer" && (
                <motion.div key={`customer-${customerScreen}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {customerScreen === "splash" && <SplashScreen onDone={() => setCustomerScreen("login")} />}
                  {customerScreen === "login" && <LoginScreen onDone={() => setCustomerScreen("otp")} />}
                  {customerScreen === "otp" && <OtpScreen onDone={() => setCustomerScreen("home")} />}
                  {customerScreen === "home" && <HomeScreen />}
                  {customerScreen === "results" && <ResultsScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "details" && <DetailsScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "seats" && <SeatsScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "passenger" && <PassengerScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "payment" && <PaymentScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "confirmed" && <ConfirmedScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "trips" && <TripsScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "live" && <LiveScreen onNavigate={setCustomerScreen} />}
                  {customerScreen === "profile" && <ProfileScreen onNavigate={setCustomerScreen} />}
                </motion.div>
              )}

              {appMode === "agency" && (
                <motion.div key={`agency-${agencyScreen}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {agencyScreen === "dashboard" && <AgencyDashboard onNavigate={setAgencyScreen} />}
                  {agencyScreen === "vehicles" && <VehiclesScreen onNavigate={setAgencyScreen} />}
                  {agencyScreen === "addVehicle" && (
                    <div className="flex flex-col h-full bg-background">
                      <BackHeader title="Add Vehicle" onBack={() => setAgencyScreen("vehicles")} />
                      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4">
                        <div className="h-36 bg-muted rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2">
                          <Camera size={24} className="text-muted-foreground" />
                          <p className="text-sm text-muted-foreground font-medium">Upload Vehicle Photos</p>
                          <p className="text-xs text-muted-foreground">Min 3 photos required</p>
                        </div>
                        {[["Vehicle Name", "Force Traveller 17+1"], ["Registration No.", "MH-12 XX XXXX"], ["Seating Capacity", "17"], ["Vehicle Type", "Tempo Traveller"]].map(([l, p]) => (
                          <div key={l}>
                            <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{l}</label>
                            <input placeholder={p} className="w-full bg-muted rounded-2xl px-4 py-3 text-sm text-foreground border border-border outline-none focus:border-primary transition-colors" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-2 block">Amenities</label>
                          <div className="flex flex-wrap gap-2">
                            {["AC", "USB Charging", "Music System", "WiFi", "GPS Tracking"].map(a => (
                              <button key={a} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border hover:border-primary/40 transition-colors">{a}</button>
                            ))}
                          </div>
                        </div>
                        <button className="w-full py-4 rounded-2xl text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})` }}>Add Vehicle</button>
                      </div>
                    </div>
                  )}
                  {agencyScreen === "requests" && <BookingRequestsScreen />}
                  {agencyScreen === "drivers" && (
                    <div className="flex flex-col h-full bg-background">
                      <div className="bg-card border-b border-border px-4 pt-4 pb-3 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">Driver Roster</h2>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold"><Plus size={14} /> Add Driver</button>
                      </div>
                      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
                        {[
                          { name: "Rajan Mishra", phone: "+91 98765 43210", rating: 4.9, trips: 284, status: "active", vehicle: "MH-12 AB 1234" },
                          { name: "Vijay Patil", phone: "+91 87654 32109", rating: 4.6, trips: 156, status: "on-trip", vehicle: "MH-12 CD 5678" },
                          { name: "Anil Sharma", phone: "+91 76543 21098", rating: 4.5, trips: 98, status: "offline", vehicle: "MH-12 EF 9012" },
                          { name: "Deepak Yadav", phone: "+91 65432 10987", rating: 4.3, trips: 67, status: "available", vehicle: "Unassigned" },
                        ].map((d, i) => (
                          <div key={i} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                              <span className="text-primary font-extrabold">{d.name[0]}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-foreground">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.vehicle}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StarRow rating={d.rating} />
                                <span className="text-xs text-muted-foreground">{d.trips} trips</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge color={d.status === "active" || d.status === "available" ? "success" : d.status === "on-trip" ? "primary" : "muted"}>{d.status}</Badge>
                              <button className="p-1.5 rounded-xl bg-muted"><Phone size={13} className="text-primary" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {agencyScreen === "revenue" && <RevenueScreen />}
                  {agencyScreen === "reviews" && (
                    <div className="flex flex-col h-full bg-background">
                      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
                        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="text-center">
                            <p className="text-3xl font-extrabold text-foreground">4.8</p>
                            <StarRow rating={4.8} count={284} />
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            {[5,4,3,2,1].map(s => (
                              <div key={s} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-3">{s}</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-amber-400" style={{ width: s === 5 ? "75%" : s === 4 ? "18%" : s === 3 ? "5%" : "1%" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
                        {[
                          { name: "Priya Sharma", rating: 5, comment: "Excellent service! Punctual and comfortable ride.", date: "Jul 28", route: "Mumbai → Pune" },
                          { name: "Ankit Malhotra", rating: 4, comment: "Good trip overall, AC was perfect.", date: "Jul 25", route: "Mumbai → Nashik" },
                          { name: "Kavita Singh", rating: 5, comment: "Will definitely use Grouppy again!", date: "Jul 20", route: "Mumbai → Pune" },
                        ].map((r, i) => (
                          <div key={i} className="bg-card rounded-2xl border border-border p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">{r.name[0]}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-foreground">{r.name}</p>
                                <div className="flex items-center gap-2"><StarRow rating={r.rating} /><span className="text-xs text-muted-foreground">{r.route}</span></div>
                              </div>
                              <span className="text-xs text-muted-foreground">{r.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{r.comment}</p>
                            <button className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold"><ThumbsUp size={12} /> Thank You</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {agencyScreen === "notifications" && (
                    <div className="flex flex-col h-full bg-background">
                      <div className="bg-card border-b border-border px-4 pt-4 pb-3">
                        <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                      </div>
                      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-2">
                        {[
                          { icon: Package, title: "New Booking Request", sub: "Ankit Malhotra · 3 seats · Mumbai→Pune · Aug 5", time: "2m ago", unread: true },
                          { icon: CheckCircle, title: "Booking Confirmed", sub: "GRP-2847 payment received ₹1,047", time: "15m ago", unread: true },
                          { icon: AlertCircle, title: "Driver Check-in Reminder", sub: "Rajan Mishra trip at 06:30 AM tomorrow", time: "1h ago", unread: false },
                          { icon: TrendingUp, title: "Weekly Revenue Report", sub: "₹52,800 earned this week — up 11%", time: "2h ago", unread: false },
                        ].map((n, i) => (
                          <div key={i} className={cn("bg-card rounded-2xl border p-4 flex items-start gap-3", n.unread ? "border-primary/20" : "border-border")}>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", n.unread ? "bg-secondary" : "bg-muted")}>
                              <n.icon size={18} className={n.unread ? "text-primary" : "text-muted-foreground"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-semibold", n.unread ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.sub}</p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {agencyScreen === "agencyProfile" && <AgencyProfileScreen />}
                </motion.div>
              )}

              {appMode === "driver" && (
                <motion.div key={`driver-${driverScreen}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {driverScreen === "driverDash" && <DriverDashboard onNavigate={setDriverScreen} />}
                  {driverScreen === "todayTrips" && <TodayTripsScreen onNavigate={setDriverScreen} />}
                  {driverScreen === "navigation" && <NavigationScreen onNavigate={setDriverScreen} />}
                  {driverScreen === "verification" && <PassengerVerificationScreen onNavigate={setDriverScreen} />}
                  {driverScreen === "tripStatus" && (
                    <div className="flex flex-col h-full bg-background px-4 pt-4 pb-4 gap-4">
                      <BackHeader title="Trip Status" onBack={() => setDriverScreen("todayTrips")} />
                      <div className="bg-secondary rounded-3xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Current Trip</p>
                            <p className="font-bold text-foreground text-lg">Mumbai → Pune</p>
                          </div>
                          <Badge color="primary">In Progress</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "42%" }} />
                          </div>
                          <span className="text-xs font-bold text-primary">42%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">ETA: 09:50 AM · 47 km remaining</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[["Passengers", "5/5"], ["Speed", "72 km/h"], ["Fuel", "68%"], ["Next Stop", "Khopoli"]].map(([l, v]) => (
                          <div key={l} className="bg-card rounded-2xl border border-border p-3.5">
                            <p className="text-xs text-muted-foreground">{l}</p>
                            <p className="font-bold text-foreground text-base">{v}</p>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #D4183D, #9B0F2B)" }}>
                        <AlertTriangle size={16} /> Emergency SOS
                      </button>
                    </div>
                  )}
                  {driverScreen === "earnings" && <DriverEarningsScreen />}
                  {driverScreen === "driverProfile" && <DriverProfileScreen />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          {appMode === "customer" && showCustomerNav && (
            <div className="shrink-0">
              <CustomerNav current={customerScreen} onNavigate={setCustomerScreen} />
            </div>
          )}
          {appMode === "agency" && showAgencyNav && (
            <div className="shrink-0">
              <AgencyNav current={agencyScreen} onNavigate={setAgencyScreen} />
            </div>
          )}
          {appMode === "driver" && showDriverNav && (
            <div className="shrink-0">
              <DriverNav current={driverScreen} onNavigate={setDriverScreen} />
            </div>
          )}

          {/* Home Indicator */}
          <div className="h-5 flex items-center justify-center bg-card shrink-0">
            <div className="w-28 h-1 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium hidden md:block">
        Switch between Customer · Agency · Driver at the top
      </div>
    </div>
  );
}
