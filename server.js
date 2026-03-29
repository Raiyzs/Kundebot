const express   = require('express');
const cors      = require('cors');
const OpenAI    = require('openai');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();

// CORS — berre tillat domener frå config
app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (server-to-server, curl, etc.)
    if (!origin) return cb(null, true);
    const allowed = loadConfig().allowed_origins || [];
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} ikkje tillatt`));
  }
}));

// Rate limiting — maks 30 førespurnader per 10 min per IP
app.use('/chat', rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'For mange meldingar. Prøv igjen om litt.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());

// Groq — gratis, Llama 3.3 70B
function groq() {
  return new OpenAI({
    apiKey:  process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

function loadConfig() {
  try { return require('./business.config.json'); }
  catch { return DEFAULT_CONFIG; }
}

async function sendFallbackEmail(config, userMessage) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: config.fallback_email,
    subject: `[${config.name}] Kunde ønskjer kontakt`,
    text: `Ein kunde i chatboten di ønskjer å snakke med ein person.\n\nSiste melding frå kunden:\n"${userMessage}"\n\nSvar kunden direkte.`,
  });
}

const DEFAULT_CONFIG = {
  name:           'Demo Bedrift AS',
  description:    'Vi er en lokal bedrift som tilbyr gode tjenester.',
  tone:           'vennlig, hjelpsom og profesjonell',
  language:       'norsk',
  faq: [
    { q: 'Hva er åpningstidene?', a: 'Vi er åpne mandag–fredag 09–17.' },
    { q: 'Hvor holder dere til?',  a: 'Vi holder til i Tromsø sentrum.' },
    { q: 'Hvordan kontakter jeg dere?', a: 'Ring oss på 77 00 00 00 eller send e-post til hei@demobedrift.no.' },
  ],
  fallback_email: 'hei@demobedrift.no',
};

function buildSystemPrompt(config) {
  const faqText = config.faq.map(f => `- ${f.q}\n  Svar: ${f.a}`).join('\n');
  return `Du er en hjelpsom kundeservice-assistent for ${config.name}.

Om bedriften: ${config.description}

Tone: Vær ${config.tone}. Svar alltid på ${config.language}.

Vanlige spørsmål du kan svare på:
${faqText}

Regler:
- Svar kort og presist (1-3 setninger normalt)
- Hvis du ikke vet svaret, si at du ikke er sikker og be kunden kontakte oss på ${config.fallback_email}
- Ikke dikter opp informasjon du ikke har fått
- Ikke gå utenfor din rolle som kundeservice for ${config.name}`;
}

// POST /chat  { message, history? }
app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const config = loadConfig();

  try {
    const response = await groq().chat.completions.create({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 400,
      messages: [
        { role: 'system', content: buildSystemPrompt(config) },
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    // Fallback-varsel: om kunden spør etter ein person, send e-post til eigar
    const humanTriggers = ['snakke med', 'kontakte dere', 'ring meg', 'ringe meg', 'en person', 'et menneske', 'hjelp fra', 'speak to', 'contact you'];
    const wantsHuman = humanTriggers.some(t => message.toLowerCase().includes(t));
    if (wantsHuman && process.env.MAIL_USER) {
      sendFallbackEmail(config, message).catch(() => {});
    }

    res.json({ reply });
  } catch (err) {
    console.error('[chat] error:', err.message);
    res.status(500).json({ error: 'Noe gikk galt. Prøv igjen.' });
  }
});

// Serve static files
app.get('/widget.js', (_, res) => res.sendFile(__dirname + '/widget.js'));
app.get('/demo',      (_, res) => res.sendFile(__dirname + '/demo.html'));

// GET /health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`[ai-integ] Kjører på port ${PORT}`));
