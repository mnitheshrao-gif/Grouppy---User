# Customer app implementation — 7 November 2026

Approved palette: black, white, neutral grey; soft purple and soft green accents; original Grouppy logo.

Implemented: login entry UI with explicit unconnected OTP notice; destination/local hire forms; AI website catalogue and budget preference; curated website tours; 8–30 group slider; Flex 8–12 / Plus 13–18 / Max 19–30 capacity selection with upgrade; trip review; local draft create/edit/cancel; My Trips; editable local profile.

Validation: production Vite build passed. Browser checked navigation, required-input validation, 13-person Plus selection / disabled Flex, destination review, draft saving and persistence after reload.

Not production connected: SMS OTP, map/geocoding/current-location, booking APIs, agency quotes, payments, driver notifications. No requests leave this prototype and no fake confirmations are displayed. AI catalogue is static website data; budget does not filter it. Source website catalogue copied from reference commit ad68c34d5c023e266c51fb5dc4315d476b93b8b3; embedded historical estimate/price properties are not displayed or used as quotes.

Next: connect verified shared backend/auth; replace generic vehicle icons with approved individual illustrations; connect real map/place autocomplete; verify complete flows on mobile; package for mobile distribution after backend testing.

Run npm install then npm run dev. Build with npm run build.
