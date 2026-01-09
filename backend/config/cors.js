const allowedOrigins = [
  'https://brandonmrgich.com',
  'https://www.brandonmrgich.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

module.exports = {
  origin: function(origin, callback) {
    console.log(`[CORS] Request from origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`[CORS] Allowed: ${origin}`);
      return callback(null, true);
    } else {
      console.log(`[CORS] Blocked: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  // include common headers browsers may preflight for
  allowedHeaders: 'Content-Type,Authorization,Accept,X-Requested-With',
  credentials: true,
};
