import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, ArrowRightLeft, Bell,
  BusFront, CalendarDays, CheckCircle2, ChevronRight, Clock3,
  Compass, CreditCard, Headphones, Home, Info, MapPin,
  Pencil, Plus, Route, ShieldCheck, Sparkles,
  TicketCheck, UsersRound, Wallet, XCircle
} from "lucide-react";
import grouppyLogo from "../imports/Grouppy_Logo-removebg-preview.png";
import "./customer-booking.css";

type Tab = "home" | "requests" | "bookings" | "details" | "account" | "planner" | "tours";
type RideStatus = "collecting" | "quotes_received" | "selection_requested" | "awaiting_fee" | "confirmed" | "cancelled";
type FeeStatus = "unpaid" | "simulated";
type TripForm = {
  pickup: string; destination: string; departDate: string; returnDate: string;
  departureTime: string; passengers: number; notes: string;
};
type Quote = {
  id: string; agency: string; vehicle: string; seats: number;
  price: number; extraKm: number; extraHour: number; terms: string;
  ac: boolean; modelYear: string;
};
type Ride = TripForm & {
  id: string; status: RideStatus; quotes: Quote[];
  chosenQuoteId: string | null; feeStatus: FeeStatus;
  createdAt: string; updatedAt: string;
};

const STORE_KEY = "grouppy-customer-roundtrip-prototype-v1";
const BOOKING_FEE = 100;
const inr = (value: number) => "₹" + Number(value).toLocaleString("en-IN");
const nowDate = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
};
const daysAhead = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
};
const newForm = (): TripForm => ({
  pickup: "", destination: "", departDate: daysAhead(2), returnDate: daysAhead(3),
  departureTime: "07:00", passengers: 10, notes: ""
});
const loadRides = (): Ride[] => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((ride): ride is Ride =>
      Boolean(ride && typeof ride === "object" && typeof ride.id === "string" &&
        Array.isArray(ride.quotes) && typeof ride.status === "string")) : [];
  } catch {
    return [];
  }
};
const stage: Record<RideStatus, string> = {
  collecting: "Awaiting quotations", quotes_received: "Quotes received",
  selection_requested: "Agency confirmation pending", awaiting_fee: "Booking fee pending",
  confirmed: "Booking confirmed", cancelled: "Cancelled"
};
const badgeClass: Record<RideStatus, string> = {
  collecting: "amber", quotes_received: "green", selection_requested: "amber",
  awaiting_fee: "amber", confirmed: "green", cancelled: "rose"
};
// Examples demonstrate vehicle-capacity matching. Real models, availability and rates
// must be supplied by verified agency inventory from the shared booking API.
type SampleVehicle = { name: string; capacity: number; ac: boolean };
const SAMPLE_FLEET: SampleVehicle[] = [
  { name: "4-passenger car", capacity: 4, ac: true },
  { name: "6-passenger MPV", capacity: 6, ac: true },
  { name: "Compact group van", capacity: 7, ac: true },
  { name: "8-seat tourist van", capacity: 8, ac: true },
  { name: "Tata Winger-style van", capacity: 9, ac: true },
  { name: "Force Traveller-style minibus", capacity: 12, ac: false },
  { name: "12-seat AC Traveller", capacity: 13, ac: true },
  { name: "14-seat tourist Traveller", capacity: 14, ac: true },
  { name: "17-seat Tempo Traveller", capacity: 17, ac: true },
  { name: "18-seat Traveller", capacity: 18, ac: true },
  { name: "20-seat mini coach", capacity: 20, ac: true },
  { name: "21-seat mini coach", capacity: 21, ac: true },
  { name: "25-seat minibus", capacity: 25, ac: true },
  { name: "26-seat mini coach", capacity: 26, ac: true },
  { name: "30-seat tourist bus", capacity: 30, ac: true },
  { name: "32-seat tourist bus", capacity: 32, ac: true },
  { name: "35-seat tourist bus", capacity: 35, ac: true },
  { name: "40-seat coach", capacity: 40, ac: true },
  { name: "45-seat coach", capacity: 45, ac: true },
  { name: "50-seat coach", capacity: 50, ac: true },
  { name: "55-seat large coach", capacity: 55, ac: true },
  { name: "60-seat large coach", capacity: 60, ac: true }
];
function mockQuotes(passengers: number): Quote[] {
  // Demo only: no made-up agency is represented as genuine live inventory.
  const candidates = SAMPLE_FLEET.filter(vehicle => vehicle.capacity >= passengers);
  const sampleChoices = candidates.slice(0, 3);
  return sampleChoices.map((vehicle, index) => {
    const examplePrice = Math.round((4200 + vehicle.capacity * 340 + index * 850) / 100) * 100;
    return {
      id: "sample-" + index,
      agency: "Demo Agency " + (index + 1),
      vehicle: vehicle.name,
      seats: vehicle.capacity,
      price: examplePrice,
      extraKm: 17 + index * 2,
      extraHour: 250 + index * 50,
      terms: "Illustrative terms only. In the real flow, the agency supplies inclusions, tolls, driver allowance, permits, and cancellations.",
      ac: vehicle.ac,
      modelYear: "To be verified"
    };
  });
}
function Status({ status }: { status: RideStatus }) {
  return <span className={"gc-status gc-" + badgeClass[status]}>{stage[status]}</span>;
}
function SectionTitle({ children, caption }: { children: ReactNode; caption?: string }) {
  return <div className="gc-section-title"><h2>{children}</h2>{caption && <p>{caption}</p>}</div>;
}
function FormField({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return <label className={"gc-field" + (wide ? " gc-wide" : "")}>
    <span>{title}</span>{children}
  </label>;
}
export default function CustomerBookingApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [rides, setRides] = useState<Ride[]>(loadRides);
  const [form, setForm] = useState<TripForm>(newForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(rides)); } catch { /* non-persistent private browsing */ }
  }, [rides]);

  const chosenRide = rides.find(ride => ride.id === activeId);
  const selectedQuote = chosenRide?.quotes.find(quote => quote.id === chosenRide.chosenQuoteId);
  const updates = (id: string, update: (current: Ride) => Ride) => {
    setRides(previous => previous.map(ride => ride.id === id ? update(ride) : ride));
  };
  const go = (target: Tab) => {
    setError(""); setMessage(""); setTab(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openRide = (id: string) => { setActiveId(id); go("details"); };
  const resetForm = () => { setForm(newForm()); setEditingId(null); setError(""); };
  const editRide = (ride: Ride) => {
    setForm({
      pickup: ride.pickup, destination: ride.destination,
      departDate: ride.departDate, returnDate: ride.returnDate,
      departureTime: ride.departureTime, passengers: ride.passengers,
      notes: ride.notes
    });
    setEditingId(ride.id); go("home");
    setMessage("Editing your existing request. Changes may require fresh agency quotes; no second Grouppy booking fee is added.");
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setMessage("");
    const pickup = form.pickup.trim().replace(/\s+/g, " ");
    const destination = form.destination.trim().replace(/\s+/g, " ");
    if (pickup.length < 4 || destination.length < 4) {
      setError("Enter complete pickup and destination locations."); return;
    }
    if (pickup.toLocaleLowerCase() === destination.toLocaleLowerCase()) {
      setError("Pickup and destination must be different for a round trip."); return;
    }
    if (!form.departDate || !form.returnDate || !form.departureTime ||
      form.returnDate < form.departDate) {
      setError("Select valid departure and return dates."); return;
    }
    const departure = new Date(form.departDate + "T" + form.departureTime);
    if (Number.isNaN(departure.getTime()) || departure.getTime() - Date.now() < 12 * 60 * 60 * 1000) {
      setError("Grouppy currently requires at least 12 hours' advance notice."); return;
    }
    if (!Number.isInteger(form.passengers) || form.passengers < 1 || form.passengers > 99) {
      setError("Enter the total number of passengers, between 1 and 99. Vehicle capacity will be matched by agencies."); return;
    }
    const clean: TripForm = { ...form, pickup, destination };
    const date = new Date().toISOString();
    let id = editingId;
    if (editingId) {
      updates(editingId, ride => ({
        ...ride, ...clean, status: "collecting", quotes: [], chosenQuoteId: null, updatedAt: date
      }));
    } else {
      id = "GRP-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
      setRides(prev => [{ ...clean, id: id!, status: "collecting", quotes: [],
        chosenQuoteId: null, feeStatus: "unpaid", createdAt: date, updatedAt: date }, ...prev]);
    }
    setEditingId(null); resetForm(); setActiveId(id);
    go("details");
    setMessage("Demo request saved on this device. No real agencies have been contacted.");
  };
  const loadDemoQuotes = (ride: Ride) => {
    if (ride.status !== "collecting") return;
    const examples = mockQuotes(ride.passengers);
    if (examples.length === 0) {
      setMessage("No suitable vehicle exists in this small demo fleet. A live request would be checked against agency inventories and possibly coordinated for multiple vehicles.");
      return;
    }
    updates(ride.id, current => ({
      ...current, quotes: examples, status: "quotes_received",
      updatedAt: new Date().toISOString()
    }));
    setMessage(examples.length + " illustrative vehicle quote(s) loaded. No agencies received a request.");
  };
  const selectQuote = (ride: Ride, quote: Quote) => {
    if (ride.status !== "quotes_received") return;
    updates(ride.id, current => ({
      ...current, chosenQuoteId: quote.id, status: "selection_requested",
      updatedAt: new Date().toISOString()
    }));
    setMessage("Demo quote selected. The agency must confirm vehicle allocation.");
  };
  const simulateAgencyApproval = (ride: Ride) => {
    if (ride.status !== "selection_requested") return;
    updates(ride.id, current => ({
      ...current, status: current.feeStatus === "simulated" ? "confirmed" : "awaiting_fee", updatedAt: new Date().toISOString()
    }));
    setMessage(ride.feeStatus === "simulated" ? "SIMULATION: revised vehicle approved. Original ₹100 booking fee retained; no additional fee." : "SIMULATION: agency allocation approved. This is not a real vehicle confirmation.");
  };
  const simulateCustomerFee = (ride: Ride) => {
    if (ride.status !== "awaiting_fee") return;
    updates(ride.id, current => ({
      ...current, feeStatus: "simulated", status: "confirmed", updatedAt: new Date().toISOString()
    }));
    setMessage("SIMULATION ONLY: ₹100 marked paid. No money moved and no real booking was created.");
  };
  const cancelRide = (ride: Ride) => {
    if (ride.status === "cancelled") return;
    if (!window.confirm("Cancel this demonstration request? The ₹100 fee, if simulated, stays recorded for this request.")) return;
    updates(ride.id, current => ({ ...current, status: "cancelled", updatedAt: new Date().toISOString() }));
    setMessage("Demo request cancelled. No live agency was notified.");
  };
  const clearDemo = () => {
    if (!window.confirm("Delete ALL demo requests stored in this browser?")) return;
    setRides([]); setActiveId(null); go("home"); setMessage("Local demonstration requests deleted.");
  };
  const current = tab === "details" ? "requests" : tab;

  return (
    <div className="gc-app">
      <div className="gc-layout">
        <aside className="gc-sidebar">
          <button className="gc-brand gc-brand-desktop" onClick={() => go("home")} aria-label="Grouppy home">
            <img src={grouppyLogo} alt="" /><span><strong>GROUPPY</strong><small>RIDE TOGETHER. SAVE TOGETHER.</small></span>
          </button>
          <p className="gc-side-label">CUSTOMER APP</p>
          <nav aria-label="Main navigation">
            <button className={current === "home" ? "active" : ""} onClick={() => go("home")}><Home size={19} /> Home</button>
            <button className={current === "requests" ? "active" : ""} onClick={() => go("requests")}><Route size={19} /> My requests</button>
            <button className={current === "bookings" ? "active" : ""} onClick={() => go("bookings")}><TicketCheck size={19} /> My trips</button>
            <button className={current === "account" ? "active" : ""} onClick={() => go("account")}><Wallet size={19} /> Account</button>
          </nav>
          <div className="gc-sidebar-footer"><ShieldCheck size={18} /> Prototype mode<br />No real payments or bookings</div>
        </aside>

        <main className="gc-main">
          <div className="gc-desktop-top"><span>Grouppy · Customer experience</span><div className="gc-demo-indicator">● Demo environment</div></div>
          <div className="gc-mobile-header">
            <button onClick={() => go("home")} className="gc-mini-brand"><img src={grouppyLogo} alt="" /><b>grouppy</b></button>
            <span className="gc-demo-indicator">Demo</span>
          </div>
          <div className="gc-content">
            <div className="gc-dev-banner"><Info size={16} /><span>App prototype. Example quotations and bookings are simulated—not live agency availability or real prices.</span></div>
            {message && <div role="status" className="gc-notice"><CheckCircle2 size={16} /> {message}<button aria-label="Dismiss notice" onClick={() => setMessage("")}>×</button></div>}

            {tab === "home" && <>
              <section className="gc-hero">
                <div>
                  <div className="gc-overline"><span className="gc-gold-dot" /> GROUP TRAVEL MADE SIMPLE</div>
                  <h1>Where are we heading <em>together?</em></h1>
                  <p>Tell us your group size. Agencies propose vehicles that fit your passengers, route and luggage—no need to choose a seating category first.</p>
                  <div className="gc-hero-chips"><span><ShieldCheck size={14} /> Verified agencies at launch</span><span><BusFront size={14} /> Vans, Travellers and 30+ seat buses</span></div>
                </div>
                <div className="gc-route-art"><div className="gc-pin-one"><MapPin size={21} /></div><div className="gc-dashed-track" /><div className="gc-pin-two"><MapPin size={21} /></div><BusFront className="gc-hero-bus" size={78} strokeWidth={1.3} /></div>
              </section>
              <div className="gc-home-grid">
                <section className="gc-panel gc-form-panel">
                  <div className="gc-panel-heading"><div><span className="gc-mini-eyebrow">YOUR GROUP TRIP</span><h2>{editingId ? "Edit your request" : "Get agency quotes"}</h2></div><span className="gc-roundtrip"><ArrowRightLeft size={14} /> Round trip</span></div>
                  <form onSubmit={submit} className="gc-trip-form">
                    <div className="gc-field-grid">
                      <FormField title="Pickup location" wide><div className="gc-input-icon"><MapPin size={17} /><input required autoComplete="street-address" placeholder="Full address or landmark" value={form.pickup} onChange={event => setForm(prev => ({ ...prev, pickup: event.target.value }))} /></div></FormField>
                      <FormField title="Destination" wide><div className="gc-input-icon"><MapPin size={17} /><input required placeholder="City, area or landmark" value={form.destination} onChange={event => setForm(prev => ({ ...prev, destination: event.target.value }))} /></div></FormField>
                      <FormField title="Departure date"><div className="gc-input-icon"><CalendarDays size={17} /><input aria-label="Departure date" required type="date" min={nowDate()} value={form.departDate} onChange={event => setForm(prev => ({ ...prev, departDate: event.target.value, returnDate: event.target.value > prev.returnDate ? event.target.value : prev.returnDate }))} /></div></FormField>
                      <FormField title="Return date"><div className="gc-input-icon"><CalendarDays size={17} /><input aria-label="Return date" required type="date" min={form.departDate} value={form.returnDate} onChange={event => setForm(prev => ({ ...prev, returnDate: event.target.value }))} /></div></FormField>
                      <FormField title="Pickup time"><div className="gc-input-icon"><Clock3 size={17} /><input required aria-label="Pickup time" type="time" value={form.departureTime} onChange={event => setForm(prev => ({ ...prev, departureTime: event.target.value }))} /></div></FormField>
                      <FormField title="Number of passengers" wide>
                        <div className="gc-stepper gc-passengers-control">
                          <UsersRound size={19} />
                          <button type="button" aria-label="Remove passenger" onClick={() => setForm(prev => ({ ...prev, passengers: Math.max(1, prev.passengers - 1) }))}>−</button>
                          <input aria-label="Total passengers" required type="number" inputMode="numeric" min={1} max={99} value={form.passengers} onChange={event => setForm(prev => ({ ...prev, passengers: Number(event.target.value) }))} />
                          <button type="button" aria-label="Add passenger" onClick={() => setForm(prev => ({ ...prev, passengers: Math.min(99, prev.passengers + 1) }))}>+</button>
                        </div>
                        <span className="gc-matching-hint">Grouppy finds vehicles based on your group size. Agencies can offer vans, Traveller models, minibuses or 30-seat and larger buses, depending on availability.</span>
                      </FormField>
                      <FormField title="Notes for agencies (optional)" wide><textarea maxLength={600} placeholder="Luggage, stops, child seats, accessibility requirements…" value={form.notes} onChange={event => setForm(prev => ({ ...prev, notes: event.target.value }))} /></FormField>
                    </div>
                    {error && <div role="alert" className="gc-error"><XCircle size={16} />{error}</div>}
                    <button type="submit" className="gc-primary-btn gc-full-btn"><span>{editingId ? "Save changes & request fresh quotes" : "Request vehicle quotations"}</span><ArrowRight size={18} /></button>
                    {editingId && <button type="button" className="gc-link-btn" onClick={resetForm}>Discard changes</button>}
                    <p className="gc-form-disclaimer"><ShieldCheck size={14} /> No booking fee is due until an agency confirms your vehicle. Minimum 12-hour advance request.</p>
                  </form>
                </section>
                <aside className="gc-home-aside">
                  <section className="gc-aside-card"><div className="gc-aside-icon"><Sparkles size={22} /></div><h3>Plan a smarter getaway</h3><p>AI-assisted trip ideas, route suggestions and estimated group travel needs.</p><button onClick={() => go("planner")}>Explore AI Trip Planner <ChevronRight size={16} /></button></section>
                  <section className="gc-aside-card gc-tours-card"><div className="gc-aside-icon"><Compass size={22} /></div><h3>Curated group tours</h3><p>Pre-designed trips built for friends, families and teams.</p><button onClick={() => go("tours")}>Explore curated tours <ChevronRight size={16} /></button></section>
                  <section className="gc-how-card"><h3>How Grouppy works</h3><ol><li><span>1</span>Tell us where and when</li><li><span>2</span>Agencies quote suitable vehicles</li><li><span>3</span>Compare and select a quote</li><li><span>4</span>Confirm your booking for ₹100</li></ol><p>Customer and agency pay separate platform fees. Vehicle fare is additional.</p></section>
                </aside>
              </div>
            </>}

            {tab === "requests" && <>
              <div className="gc-page-head"><div><span className="gc-mini-eyebrow">YOUR INBOX</span><h1>My requests</h1><p>Track your enquiries and view quotations as they arrive.</p></div><button onClick={() => { resetForm(); go("home"); }} className="gc-primary-btn"><Plus size={17} /> New request</button></div>
              {rides.length === 0 ? <Empty title="No requests yet" subtitle="Create a group trip request to experience the quotation flow." onAction={() => go("home")} /> :
                <div className="gc-list">{rides.map(ride => <RideCard key={ride.id} ride={ride} onOpen={() => openRide(ride.id)} />)}</div>}
            </>}

            {tab === "bookings" && <>
              <div className="gc-page-head"><div><span className="gc-mini-eyebrow">YOUR JOURNEYS</span><h1>My trips</h1><p>Vehicle details, status and your booking history.</p></div></div>
              {rides.filter(ride => ride.chosenQuoteId).length === 0 ?
                <Empty title="No selected trips" subtitle="Once you choose an agency quote, your trip appears here." onAction={() => go("requests")} /> :
                <div className="gc-list">{rides.filter(ride => ride.chosenQuoteId).map(ride => <RideCard key={ride.id} ride={ride} onOpen={() => openRide(ride.id)} />)}</div>}
            </>}

            {tab === "details" && chosenRide && <>
              <button className="gc-back-link" onClick={() => go("requests")}><ArrowLeft size={17} /> All requests</button>
              <div className="gc-page-head gc-detail-head"><div><span className="gc-mini-eyebrow">REQUEST {chosenRide.id}</span><h1>{chosenRide.pickup} <ArrowRight size={22} /> {chosenRide.destination}</h1><p>Round trip • {chosenRide.passengers} passengers • Agency-matched vehicle</p></div><Status status={chosenRide.status} /></div>
              <div className="gc-details-grid">
                <div className="gc-detail-main">
                  <section className="gc-panel gc-detail-panel">
                    <SectionTitle caption="These stages will sync across all Grouppy platforms when the backend is connected.">Your booking journey</SectionTitle>
                    <div className="gc-progress">
                      {["Request submitted", "Agency quotations", "Vehicle allocation", "Booking fee", "Trip ready"].map((label, index) => {
                        const step = chosenRide.status === "collecting" ? 0 : chosenRide.status === "quotes_received" ? 1 : chosenRide.status === "selection_requested" ? 2 : chosenRide.status === "awaiting_fee" ? 3 : chosenRide.status === "confirmed" ? 4 : 0;
                        return <div key={label} className={index <= step && chosenRide.status !== "cancelled" ? "complete" : ""}><span>{index < step ? "✓" : index + 1}</span><b>{label}</b></div>;
                      })}
                    </div>
                    <div className="gc-trip-facts">
                      <div><small>Departure</small><strong>{chosenRide.departDate} · {chosenRide.departureTime}</strong></div>
                      <div><small>Return</small><strong>{chosenRide.returnDate}</strong></div>
                      <div><small>Route type</small><strong>Destination round trip</strong></div>
                      <div><small>Special requirements</small><strong>{chosenRide.notes || "None added"}</strong></div>
                    </div>
                    {chosenRide.status !== "cancelled" && <div className="gc-inline-actions"><button className="gc-outline-btn" onClick={() => editRide(chosenRide)}><Pencil size={16} /> Edit request</button><button className="gc-quiet-danger" onClick={() => cancelRide(chosenRide)}>Cancel request</button></div>}
                  </section>
                  {chosenRide.status === "collecting" && <section className="gc-panel gc-step-panel">
                    <div className="gc-feature-icon"><Clock3 size={22} /></div><h2>Waiting for agency quotations</h2><p>In the live version, Grouppy sends your passenger count and trip details to at least five eligible agencies near the pickup location. Each agency can offer any suitable available vehicle, including 30-seat or larger buses. This prototype does not contact anyone.</p>
                    <button className="gc-primary-btn" onClick={() => loadDemoQuotes(chosenRide)}>Load sample matching vehicles <ArrowRight size={17} /></button>
                  </section>}
                  {chosenRide.quotes.length > 0 && <section className="gc-quote-section">
                    <SectionTitle caption="Illustrative example prices only, not verified supplier quotations.">Compare vehicle quotations</SectionTitle>
                    <div className="gc-quotes">{[...chosenRide.quotes].sort((a, b) => a.price - b.price).map((quote, index) => <article key={quote.id} className={"gc-quote-card" + (chosenRide.chosenQuoteId === quote.id ? " gc-quote-selected" : "")}>
                      <div className="gc-quote-head"><span className={"gc-quote-label gc-label-" + index}>{index === 0 ? "LOWEST PRICE" : index === 1 ? "IDEAL BALANCE" : "PREMIUM OPTION"}</span><small>DEMO QUOTE</small></div>
                      <h3>{quote.vehicle}</h3><p className="gc-agency">{quote.agency} · {quote.seats} passenger seats · Model year {quote.modelYear.toLowerCase()}</p>
                      <div className="gc-quote-price"><strong>{inr(quote.price)}</strong><span>example whole-vehicle trip fare</span></div>
                      <div className="gc-quote-fees"><span>Extra km: <b>{inr(quote.extraKm)}</b></span><span>Extra hour: <b>{inr(quote.extraHour)}</b></span><span>{quote.ac ? "AC included" : "AC not included"}</span></div>
                      <p className="gc-quote-terms">{quote.terms}</p>
                      {chosenRide.chosenQuoteId === quote.id ? <div className="gc-selected-indicator"><CheckCircle2 size={17} /> Chosen quotation</div> :
                        chosenRide.status === "quotes_received" ? <button className="gc-outline-btn gc-full-btn" onClick={() => selectQuote(chosenRide, quote)}>Choose this vehicle <ArrowRight size={16} /></button> : null}
                    </article>)}</div>
                  </section>}
                  {chosenRide.status === "selection_requested" && <section className="gc-panel gc-step-panel">
                    <div className="gc-feature-icon"><BusFront size={22} /></div><h2>Waiting for agency confirmation</h2><p>You chose {selectedQuote?.vehicle}. The agency must secure the exact vehicle before the customer pays Grouppy's booking fee.</p>
                    <button className="gc-primary-btn" onClick={() => simulateAgencyApproval(chosenRide)}>Simulate agency approval <ArrowRight size={17} /></button>
                  </section>}
                  {chosenRide.status === "awaiting_fee" && <section className="gc-panel gc-step-panel">
                    <div className="gc-feature-icon"><CreditCard size={22} /></div><h2>Complete your booking</h2><p>Sample agency vehicle secured in this simulation. The Grouppy customer booking charge is {inr(BOOKING_FEE)}, separate from the agency's trip fare.</p>
                    <div className="gc-fee-line"><span>One-time Grouppy booking charge</span><strong>{inr(BOOKING_FEE)}</strong></div>
                    <p className="gc-muted-small">Your original ₹100 charge also covers subsequent edits to the same booking. Final refunds and cancellation terms require legal review.</p>
                    <button className="gc-primary-btn" onClick={() => simulateCustomerFee(chosenRide)}>Simulate ₹100 payment <ArrowRight size={17} /></button>
                  </section>}
                  {chosenRide.status === "confirmed" && <section className="gc-panel gc-step-panel">
                    <div className="gc-feature-icon"><CheckCircle2 size={22} /></div><h2>Demo booking confirmed</h2><p>Your simulated payment has been recorded locally. In the real product, the agency dispatches a request to available drivers and a driver must accept.</p>
                    <div className="gc-trip-facts"><div><small>Driver assignment</small><strong>Not assigned (prototype)</strong></div><div><small>Vehicle and driver details</small><strong>Planned 6 hours before pickup</strong></div><div><small>Customer booking charge</small><strong>{inr(BOOKING_FEE)} · simulated</strong></div><div><small>Booking status</small><strong>Prototype only</strong></div></div>
                  </section>}
                  {chosenRide.status === "cancelled" && <section className="gc-panel gc-step-panel"><XCircle size={25} /><h2>Request cancelled</h2><p>Only your local demonstration record was changed. Booking fees already marked simulated remain in the history; refund policy is not processed by this prototype.</p></section>}
                </div>
                <aside className="gc-detail-aside"><section className="gc-panel gc-summary"><h3>Trip summary</h3><div><span>Pickup</span><b>{chosenRide.pickup}</b></div><div><span>Destination</span><b>{chosenRide.destination}</b></div><div><span>Departure</span><b>{chosenRide.departDate} {chosenRide.departureTime}</b></div><div><span>Return</span><b>{chosenRide.returnDate}</b></div><div><span>Vehicle</span><b>{selectedQuote ? selectedQuote.vehicle + " · " + selectedQuote.seats + " seats" : "Matched to " + chosenRide.passengers + " passengers"}</b></div><div><span>Grouppy customer fee</span><b>{chosenRide.feeStatus === "simulated" ? "₹100 · simulated" : "₹100 · not charged"}</b></div><hr /><small>Vehicle fare is negotiated separately with the selected agency and is subject to verified terms.</small></section></aside>
              </div>
            </>}

            {tab === "account" && <section className="gc-account"><div className="gc-page-head"><div><span className="gc-mini-eyebrow">MY GROUPPY</span><h1>Account</h1><p>Customer settings and assistance.</p></div></div>
              <div className="gc-panel"><div className="gc-account-line"><div className="gc-account-icon"><ShieldCheck size={20} /></div><div><b>Demo mode</b><p>No account or OTP authentication is connected yet.</p></div></div><div className="gc-account-line"><div className="gc-account-icon"><Bell size={20} /></div><div><b>Trip notifications</b><p>WhatsApp and app updates will arrive after the shared backend is connected.</p></div></div><div className="gc-account-line"><div className="gc-account-icon"><Headphones size={20} /></div><div><b>Help and support</b><p>Cancellation and agency replacement support are planned for pilot launch.</p></div></div><button className="gc-outline-btn" onClick={() => setShowTips(previous => !previous)}>{showTips ? "Hide" : "View"} prototype limitations</button>{showTips && <p className="gc-muted-small">No live prices, agency matching, GPS, OTP, payment settlement, driver dispatch, notifications or cross-device synchronization. Local demo data exists only in this browser.</p>}<button className="gc-quiet-danger gc-clear-btn" onClick={clearDemo}>Clear demo trip data</button></div>
            </section>}

            {(tab === "planner" || tab === "tours") && <section className="gc-coming"><button onClick={() => go("home")} className="gc-back-link"><ArrowLeft size={17} /> Home</button><div className="gc-coming-card">{tab === "planner" ? <Sparkles size={36} /> : <Compass size={36} />}<span className="gc-mini-eyebrow">NEXT PHASE</span><h1>{tab === "planner" ? "AI Trip Planner" : "Curated Group Tours"}</h1><p>{tab === "planner" ? "Suggest group destinations, useful stops and vehicle types based on your plans." : "Discover ready-made group itineraries and request a suitable vehicle."} This section is planned and does not make live recommendations or bookings yet.</p><button className="gc-primary-btn" onClick={() => go("home")}>Request a round trip instead <ArrowRight size={17} /></button></div></section>}

            {tab === "details" && !chosenRide && <Empty title="Request not found" subtitle="Return to your requests." onAction={() => go("requests")} />}
          </div>
          <footer className="gc-footer"><span>GROUPPY © {new Date().getFullYear()}</span><span>Ride Together. Save Together. · Prototype</span></footer>
        </main>
      </div>
      <nav className="gc-bottom-nav" aria-label="Mobile navigation">
        {([
          ["home", Home, "Home"], ["requests", Route, "Requests"],
          ["bookings", TicketCheck, "Trips"], ["account", Wallet, "Account"]
        ] as const).map(([id, Icon, label]) =>
          <button key={id} onClick={() => go(id)} className={current === id ? "active" : ""}><Icon size={21} strokeWidth={current === id ? 2.5 : 1.8} /><span>{label}</span></button>)}
      </nav>
    </div>
  );
}
function RideCard({ ride, onOpen }: { ride: Ride; onOpen: () => void }) {
  return <button onClick={onOpen} className="gc-ride-card">
    <div className="gc-ride-top"><span className="gc-ride-id">{ride.id} · ROUND TRIP</span><Status status={ride.status} /></div>
    <div className="gc-ride-route"><span>{ride.pickup}</span><ArrowRight size={19} /><span>{ride.destination}</span></div>
    <div className="gc-ride-meta"><span><CalendarDays size={15} /> {ride.departDate}</span><span><UsersRound size={15} /> {ride.passengers} people</span><span><BusFront size={15} /> Vehicle matching</span></div>
    <div className="gc-ride-bottom"><span>{ride.quotes.length} {ride.quotes.length === 1 ? "quote" : "quotes"} · {ride.feeStatus === "simulated" ? "₹100 fee simulated" : "no fee paid"}</span><span>View details <ChevronRight size={17} /></span></div>
  </button>;
}
function Empty({ title, subtitle, onAction }: { title: string; subtitle: string; onAction: () => void }) {
  return <section className="gc-empty"><div><Route size={30} /></div><h2>{title}</h2><p>{subtitle}</p><button className="gc-primary-btn" onClick={onAction}>Continue <ArrowRight size={17} /></button></section>;
}
