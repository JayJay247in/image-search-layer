// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const SearchTerm = require('./models/SearchTerm'); // Import the Mongoose model

const app = express();
const PORT = process.env.PORT || 3000;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json (though not strictly needed for these GET requests)

// --- Database Connection ---
mongoose.connect(MONGODB_URI)

// --- API Routes ---

/**
 * User Story: You can get the image URLs, description and page URLs for a set of images relating to a given search string.
 * User Story: You can paginate through the responses by adding a ?page=2 parameter to the URL.
 */
app.get('/query/:searchString', async (req, res) => {
  const { searchString } = req.params;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const resultsPerPage = 10; // Pixabay default, or you can set this

  if (!PIXABAY_API_KEY) {
    return res.status(500).json({ error: 'Pixabay API key not configured on the server.' });
  }

  if (!searchString) {
    return res.status(400).json({ error: 'Search string is required.' });
  }

  // Log the search term
  try {
    const newSearch = new SearchTerm({ term: searchString });
    await newSearch.save();
  } catch (dbError) {
    console.error('Error saving search term:', dbError.message);
    // Continue with search even if logging fails, but log the error
  }

  const pixabayAPIUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchString)}&image_type=photo&page=${page}&per_page=${resultsPerPage}`;

  try {
    const pixabayResponse = await axios.get(pixabayAPIUrl);
    
    if (pixabayResponse.data && pixabayResponse.data.hits) {
      const formattedResults = pixabayResponse.data.hits.map(hit => ({
        url: hit.webformatURL,        // Image URL
        description: hit.tags,        // Description (tags)
        pageURL: hit.pageURL          // Page URL on Pixabay
      }));
      res.json(formattedResults);
    } else {
      res.json([]); // Return empty array if no hits or unexpected response
    }
  } catch (apiError) {
    console.error('Error fetching from Pixabay API:', apiError.message);
    if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Pixabay API Error Data:', apiError.response.data);
        console.error('Pixabay API Error Status:', apiError.response.status);
        return res.status(apiError.response.status).json({ error: 'Error from Pixabay API', details: apiError.response.data });
    } else if (apiError.request) {
        // The request was made but no response was received
        return res.status(503).json({ error: 'No response from Pixabay API' });
    } else {
        // Something happened in setting up the request that triggered an Error
        return res.status(500).json({ error: 'Failed to fetch images from Pixabay' });
    }
  }
});

/**
 * User Story: You can get a list of the most recently submitted search strings.
 */
app.get('/recent/', async (req, res) => {
  try {
    // Fetch the last 10 search terms, sorted by 'when' in descending order
    const recentSearches = await SearchTerm.find()
      .sort({ when: -1 }) // -1 for descending
      .limit(10)          // Limit to 10 results
      .select('term when -_id'); // Select only term and when, exclude _id

    res.json(recentSearches);
  } catch (dbError) {
    console.error('Error fetching recent searches:', dbError.message);
    res.status(500).json({ error: 'Failed to retrieve recent searches' });
  }
});


// Simple welcome route for the root
app.get('/', (req, res) => {
    res.send(`
        <h1>Image Search Abstraction Layer API</h1>
        <p>Usage:</p>
        <ul>
            <li>Search for images: <code>/query/yoursearchterm?page=1</code></li>
            <li>View recent searches: <code>/recent/</code></li>
        </ul>
        <p>Example Search: <a href="/query/cats funny?page=1">/query/cats funny?page=1</a></p>
        <p>Example Recent: <a href="/recent/">/recent/</a></p>
    `);
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Image search: http://localhost:${PORT}/query/:searchString?page=1`);
  console.log(`Recent searches: http://localhost:${PORT}/recent/`);
});