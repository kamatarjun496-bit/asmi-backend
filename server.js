
import express from 'express';
import cors from 'cors';
 
const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
 
// Allow requests from GitHub Pages and localhost
const allowedOrigins = [
  'https://kamatarjun496-bit.github.io',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];
 
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
 
app.use(express.json());
 
// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Asmi backend is running 🌸' });
});
 
// Proxy chat requests to Groq
app.post('/chat', async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }
 
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
 
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Groq error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
 
app.listen(PORT, () => {
  console.log(`✅ Asmi backend running on port ${PORT}`);
});
