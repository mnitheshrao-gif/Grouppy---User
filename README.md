# GROUPPY — Customer Mobile App Prototype

**Work-in-progress development branch (5 November 2026).** This replaces the former individual-seat/shared-ride demo interface on this branch with the agreed **whole-vehicle, destination round-trip** model. The original main branch has not been changed.

## Getting started on a laptop

1. Clone this repository and check out `feature/customer-roundtrip-mobile-2026-11-05`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL shown by Vite, typically `http://localhost:5173`.

Run `npm run build` to compile the Vite bundle.

## User journey implemented

- Responsive customer home screen and 8 / 12 / 18-seater selection
- Full pickup and destination fields, departure and return dates, pickup time and group size
- Twelve-hour minimum notice validation for round-trip requests
- Request tracking with unique local demo IDs
- Three sample quotations showing **lowest / ideal / premium**, extra kilometre and extra-hour rates and terms
- Customer selects one quotation; agency confirmation is simulated separately
- Simulated ₹100 customer booking charge **only after** a simulated agency allocation
- Edits reuse the original simulated booking fee; changing terms requires fresh quotes and allocation approval
- Local trip history, cancellation, transparent status progression and planned driver updates
- AI Trip Planner and Curated Tours entry points clearly marked as later-phase features

## Strict prototype limitations

This frontend is not a production booking platform. Every example rate is **illustrative** and not a supplier quotation. Requests, bookings and payments are stored in browser localStorage; no booking exists in the real world. No connected payment gateway, authentication, map provider, real agency dispatch, driver acceptance, six-hour message scheduler, tax calculation or shared database. Do not use this for real customer data or actual financial transactions.

The prototype deliberately does not show fictitious live availability. After placing a request, press **Load 3 sample quotations** to exercise the demo flow. The planned production platform will invite at least five eligible agencies near pickup and display verified quotes only.

The booking-fee policy remains subject to applicable laws and legal review. If Grouppy or an operator fails to supply the service, refunds require separate handling from voluntary customer cancellation.

## Production architecture still required

1. Shared authenticated backend, Postgres schema and event log for requests/quotes/bookings.
2. Agency discovery and fan-out with response deadlines and capacity checks.
3. Server-enforced vehicle allocation and quote validity before accepting customer payment.
4. Real, idempotent payment and refund processing with legally reviewed fee terms.
5. GAPP agency booking notifications; explicit driver dispatch and acceptance.
6. Real customer update delivery six hours before pickup, backed by durable scheduled jobs.
7. Synchronized state across Grouppy Customer, GAPP, operations dashboard, web and WhatsApp.
8. Mobile-device testing, accessibility, error monitoring, audits and pilot security controls.

## Important design decision

This app is a responsive **React + Vite web application** that can be used on mobile browsers. It is not yet a packaged Android/iOS native binary or an app-store release. The main branch's older seat-sharing design remains available for reference.
