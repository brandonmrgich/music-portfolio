const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    origin: isProduction ? 'https://brandonmrgich.com' : 'http://localhost:3000', // Use localhost in dev
    methods: 'GET,POST,PUT,DELETE', // Allow only these HTTP methods
    allowedHeaders: 'Content-Type', // Allow only specific headers
    credentials: true, // Allow cookies, if necessary
};
