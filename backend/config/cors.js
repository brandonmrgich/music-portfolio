const allowedOrigins = [
  'https://brandonmrgich.com',
  'http://localhost:3000',
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
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
