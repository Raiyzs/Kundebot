# Ai-integ — Frilans AI-integrasjon

**Niche:** AI kundeservice-bot for norske småbedrifter
**Mål:** Gjentakande inntekt via setup-avgift + månedleg vedlikehaldsavgift

---

## Fase 1 — Bygg demo-produkt

Eit ferdig produkt du kan vise potensielle kunder. Ikkje perfekt — berre godt nok til å selje.

**Steg:**
- [x] 1.1 Enkel chatbot-server (Node/Express, Groq Llama 3.3 70B — gratis) ✓
- [x] 1.2 Widget embedbar på kva som helst nettside (vanilla JS, ingen deps) ✓
- [x] 1.3 Konfigurerbar via `business.config.json` (namn, tone, FAQ, fallback-epost) ✓
- [x] 1.4 Demo-side med Bootstrap (Tromsø Tannlege AS, live bot) ✓
- [ ] 1.5 Rate limiting + CORS per kunde (trengst før go-live)
- [ ] 1.6 Fallback-varsling: "send meg til ein person" → e-post til eigar
- [ ] 1.7 Deploy til Railway/Render — ekte URL, ikkje localhost

**Sikkerheit (avklart):**
- Innholdsfiltrering: Groq/Llama innebygd ✓
- API-nøkkel: aldri eksponert til klient ✓
- Rate limiting: må legges til før go-live
- CORS: må begrensast til kundens domene
- GDPR: meldingar via Groq (USA) — uproblematisk for FAQ-chat, bør nemnast til kunden

**Resultat:** Ein URL du kan sende til nokon og seie "sjå her, dette e kva du får"

---

## Fase 2 — Pris og pakkar

Enkelt — ikkje overtenk det.

- [ ] 2.1 Sett opp tre pakkar:
  - **Basis** — NOK 4 900 setup + NOK 790/mnd (standard FAQ-bot)
  - **Pro** — NOK 9 900 setup + NOK 1 490/mnd (tilpassa tone, booking, e-postvarsel)
  - **Custom** — pris på førespurnad (integrasjon mot deira system)
- [ ] 2.2 Lag eit enkelt tilbudsdokument (PDF-mal)
- [ ] 2.3 Bestem betalingsløysing (Vipps Netthandel, Stripe, eller faktura)

---

## Fase 3 — Landingsside

Ikkje fancy. Berre nok til å vere troverdig.

- [ ] 3.1 Éi side: kva det er, kva det kostar, kontaktskjema
- [ ] 3.2 Live demo-widget på sida
- [ ] 3.3 Eit par falske (eller ekte) testimonials når du har det
- [ ] 3.4 Deploy på Vercel eller Netlify (gratis)

---

## Fase 4 — Første kunde

Gjer det manuelt. Ikkje automasjon enno.

- [ ] 4.1 List opp 10 lokale Tromsø-bedrifter med dårleg eller ingen digital kundeservice
  - Tannlegar, frisørar, bilverkstad, reisebyråar, restaurantar
- [ ] 4.2 Send ein personleg melding til kvar (ikkje kopi-lim spam)
  - "Eg såg at de får mange av dei same spørsmåla på nettsida — eg har bygd noko som kan hjelpe"
- [ ] 4.3 Lever første kunde gratis eller til halv pris mot ein testimonial
- [ ] 4.4 Dokumenter alt → bruk som case study

---

## Fase 5 — Skalering

Når du har 2–3 kunder og vet kva som funker.

- [ ] 5.1 Automatiser onboarding (kunde fyller inn FAQ sjølv via dashboard)
- [ ] 5.2 Enkel admin-panel per kunde (endre svar, sjå samtalelogg)
- [ ] 5.3 Fleire kanalar — Messenger, Instagram DM, SMS (Twilio)
- [ ] 5.4 Fleirspråkleg (norsk + engelsk automatisk)
- [ ] 5.5 Søk mot eksterne plassar (Google Maps, finn.no-annonsar)

---

## Teknisk stack

| Del | Val |
|---|---|
| Backend | Node.js + Express |
| AI | Claude API (Haiku = billeg) → fallback Groq |
| Embed-widget | Vanilla JS, ingen dependencies |
| Hosting | Railway eller Render (gratis tier) |
| Database | SQLite (enkelt) → PostgreSQL ved behov |
| Betaling | Stripe eller faktura |

---

## Inntektsmål

| Kunder | Månedleg (Basis) |
|---|---|
| 3 | ~NOK 2 370 |
| 10 | ~NOK 7 900 |
| 20 | ~NOK 15 800 |
| 50 | ~NOK 39 500 |

Setup-avgift kjem på toppen kvar gong ein ny kunde signerer.

---

## Neste steg no

→ **Start Fase 1.1** — bygg chatbot-serveren
