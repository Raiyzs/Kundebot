# Ai-integ — Memory

## Prosjekt
Frilans AI-integrasjon. Niche: kundeservice-bot for norske småbedrifter.
Working dir: `/var/home/kvoldnes/Ai-integ`

## Fase-status
- **1.1** ✓ chatbot-server (Node/Express + Groq)
- **1.2** ✓ embed-widget (vanilla JS, 1 fil)
- **1.3** ✓ konfigurerbar via business.config.json
- **1.4** ✓ demo-side Bootstrap (Tromsø Tannlege AS)
- **1.5** — rate limiting + CORS (neste)
- **1.6** — fallback e-postvarsel til eigar
- **1.7** — deploy Railway/Render

## Tekniske val og kvifor
- **Groq** (ikkje Anthropic) — gratis, Llama 3.3 70B, Kristian har allerede nøkkel
- **Vanilla JS widget** — ingen dependencies, embedast med éi `<script>`-linje
- **business.config.json** — éin fil per kunde, enkel å tilpasse
- **Bootstrap 5** — rask, ser profesjonell ut, ingen designarbeid nødvendig
- **Railway/Render** — gratis tier for deploy, enkel setup

## Køyre lokalt
```bash
GROQ_API_KEY=din_nøkkel_her node /var/home/kvoldnes/Ai-integ/server.js
# Demo: http://127.0.0.1:3100/demo
```

## Sikkerheit
- Groq/Llama har innebygd innholdsfiltrering ✓
- API-nøkkel aldri eksponert til klient ✓
- Mangler: rate limiting, CORS-begrensning per kunde
- GDPR: meldingar går via Groq (USA) — OK for FAQ-chat, bør nemnast til kunden

## Kristians situasjon
- Treng inntekt — dette e eit inntektsprosjekt
- Usikker på business/sal — treng guidning gjennom kvart steg
- Sterke tekniske skills: Node, Python, AI-integrasjon
- Basert i Tromsø — lokalt marked som første målgruppe

## Prismodell (Fase 2, ikkje satt enno)
- Basis: NOK 4 900 setup + NOK 790/mnd
- Pro: NOK 9 900 setup + NOK 1 490/mnd
- Custom: pris på førespurnad

## Neste steg
→ Fase 1.5 — rate limiting + CORS
→ Fase 1.6 — fallback e-postvarsel
→ Fase 1.7 — deploy til Railway/Render
→ Fase 2 — pris og pakkar
→ Fase 3 — landingsside
→ Fase 4 — kontakt første Tromsø-bedrift
