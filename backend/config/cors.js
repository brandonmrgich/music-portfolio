module.exports = {
    origin: 'https://brandonmrgich.com', // Allow requests from this frontend domain
    methods: 'GET,POST,PUT,DELETE', // Allow only these HTTP methods
    allowedHeaders: 'Content-Type', // Allow only specific headers
    credentials: true, // Allow cookies, if necessary
};
