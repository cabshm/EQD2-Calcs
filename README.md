# Re-irradiation EQD2 Calculator with OAR Recovery — v2.1

Fixes:
- OAR data is embedded locally in `data.js`, so the app works even when opened directly from downloaded files.
- No dependency on `fetch()` for local testing.

Includes:
- OAR dropdown
- Time interval dropdown
- Suggested D0.1cc EQD2 limit
- Suggested recovery factor
- Manual override of limit and recovery
- Time-corrected EQD2 calculation
- Safety indicator comparing total EQD2 against the selected OAR D0.1cc limit
- Copy summary and PDF export

## Files
- index.html
- style.css
- data.js
- app.js
- README.md
