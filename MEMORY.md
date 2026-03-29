# Ai-integ — Memory

## Prosjekt
Frilans AI-integrasjon. Niche: kundeservice-bot for norske småbedrifter.
Working dir: `/var/home/kvoldnes/Ai-integ`
GitHub: `https://github.com/Raiyzs/Kundebot` (main branch)

## Fase-status
- **1.1** ✓ chatbot-server (Node/Express + Groq)
- **1.2** ✓ embed-widget (vanilla JS, 1 fil)
- **1.3** ✓ konfigurerbar via business.config.json
- **1.4** ✓ demo-side Bootstrap (Tromsø Tannlege AS)
- **1.5** ✓ rate limiting (30 req/10min) + CORS per allowed_origins i config
- **1.6** ✓ fallback e-postvarsel — trigger på "snakke med/kontakte/ring meg" → nodemailer → fallback_email
- **1.7** ✓ deploy Railway — live på `https://kundebot-production.up.railway.app`
- **Fase 1 FERDIG** — demo live, kan sendast til potensielle kunder

## Live URLs
- Demo: `https://kundebot-production.up.railway.app/demo`
- Health: `https://kundebot-production.up.railway.app/health`
- Chat API: `POST https://kundebot-production.up.railway.app/chat`

## Tekniske val og kvifor
- **Groq** (ikkje Anthropic) — gratis, Llama 3.3 70B, Kristian har allerede nøkkel
- **Vanilla JS widget** — ingen dependencies, embedast med éi `<script>`-linje
- **business.config.json** — éin fil per kunde, enkel å tilpasse
- **Bootstrap 5** — rask, ser profesjonell ut, ingen designarbeid nødvendig
- **Railway** — gratis tier, auto-deploy frå GitHub main branch

## Køyre lokalt
```bash
GROQ_API_KEY=din_nøkkel_her node /var/home/kvoldnes/Ai-integ/server.js
# Demo: http://127.0.0.1:3100/demo
```

## E-postvarsling (1.6)
- Krev env vars: `MAIL_USER` + `MAIL_PASS` (Gmail app-passord)
- Utan desse: fallback-deteksjon køyrer men ingen e-post sendast (stille feil)
- Ikkje satt opp i Railway enno — legg til når første kunde er klar

## Sikkerheit
- Groq/Llama innebygd innholdsfiltrering ✓
- API-nøkkel aldri eksponert til klient ✓
- Rate limiting: 30 req/10min per IP ✓
- CORS: `allowed_origins` i business.config.json ✓
- GDPR: meldingar går via Groq (USA) — OK for FAQ-chat, bør nemnast til kunden

## Prismodell (Fase 2, ikkje satt enno)
- Basis: NOK 4 900 setup + NOK 790/mnd
- Pro: NOK 9 900 setup + NOK 1 490/mnd
- Custom: pris på førespurnad

## Neste steg
→ Fase 2 — tilbudsdokument (PDF-mal) + betalingsløysing
→ Fase 3 — landingsside (éi side, live demo, kontaktskjema)
→ Fase 4 — kontakt første Tromsø-bedrift
