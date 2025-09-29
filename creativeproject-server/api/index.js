const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const env = require('dotenv');
env.config();

// Use dynamic import for node-fetch (since it's ESM-only)
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ------------- APP SETUP -------------
const app = express();
const port = process.env.PORT || 3000;

const Genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics"
};

// learned here: https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
const getRandomItems = (arr, num) => {
  const result = [];
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]; // swap
  }

  return copy.slice(0, num);
}

app.use(cors());
app.use(express.json()); // To parse JSON bodies

const apiKey = process.env.TMDB_API_KEY;
let client;
let db;
async function getDb() {
  if (!client) {
    try {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      db = client.db('creativeproject');
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
  return db;
}

app.get('/', (req, res) => res.status(200).json({ message: 'bruh' }));

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const database = await getDb();
    const users = database.collection('users');
    console.log("Database object:", database);
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'invalid username' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ id: user._id });
    } else {
      res.status(400).json({ message: 'invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'bruh' });
  }
});

app.post('/create', async (req, res) => {
  const username = req.body.username;
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const database = await getDb();
    const users = database.collection('users');
    const newUser = { username: username, password: password };
    const result = await users.insertOne(newUser);
    if (result.acknowledged) {
      return res.status(200).json({ id: result.insertedId });
    }
    return res.status(500).json({ message: 'Insert failed' });
  } catch (error) {
    res.status(500).json({ message: 'bruh' });
  }
});

app.get('/watchlist', async (req, res) => {
  const user = req.query.id;
  try {
    const database = await getDb();
    const watchlist = database.collection('watchlist');
    const all = await watchlist.find({ user }).toArray();
    const moviePromises = all.filter(media => media.movie).map(async (media) => {
      try {
        const response = await fetch(`https://media-menu.vercel.app/movieDetails?id=${media.media_id}`);
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const tvshowPromises = all.filter(media => !media.movie).map(async (media) => {
      try {
        const response = await fetch(`https://media-menu.vercel.app/tvDetails?id=${media.media_id}`);
        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (err) {
        console.error(err);
        return null;
      }
    });
    const movies = await Promise.all(moviePromises);
    const tvshows = await Promise.all(tvshowPromises);
    const allMedia = [...movies, ...tvshows].filter(media => media !== null);
    res.status(200).json({ all: allMedia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

app.get('/movieDetails', async (req, res) => {
  const id = req.query.id;
  const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed' });
  }
});

app.get('/tvDetails', async (req, res) => {
  const id = req.query.id;
  const url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed' });
  }
});

app.post('/postWatchlist', async (req, res) => {
  const user = req.body.user;
  const media_id = req.body.id;
  const movie = req.body.movie;
  const database = await getDb();
  try {
    const watchlist = database.collection('watchlist');
    const newWatch = { user: user, media_id: media_id, movie: movie };
    const result = await watchlist.insertOne(newWatch);
    if (result.acknowledged) {
      return res.status(200).json({ message: 'added' });
    }
  } catch (error) {
    res.status(500).json({ message: 'bruh' });
  }
});

app.post('/removeWatchlist', async (req, res) => {
  const user = req.body.user;
  const media_id = req.body.id;
  const movie = req.body.movie;
  const database = await getDb();
  try {
    const watchlist = database.collection('watchlist');
    const oldWatch = { user: user, media_id: media_id, movie: movie };
    const result = await watchlist.findOneAndDelete(oldWatch);
    if (result) {
      return res.status(200).json({ message: 'removed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'bruh' });
  }
});

app.get('/movies', async (req, res) => {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie list' });
  }
});

app.get('/tvshows', async (req, res) => {
  const url = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch TV list' });
  }
});

app.get('/similar', async (req, res) => {
  const id = req.query.id;
  const media = req.query.media;
  const url = media == 'movie' ? `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1` : `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch similar recommondations' });
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.query;
  const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=true&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: apiKey
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fail' });
  }
});

app.post('/preferencer', async (req, res) => {
  const user = req.body.user;
  const data = req.body.data;

  const graph = data.map(media => ({
    user: user,
    rating: media.rating,
    genres: media.genres
  }));

  const high = data
    .filter(media => media.rating > 3)
    .map(media => ({
      user: user,
      media_id: media.id,
      movie: media.movie
    }));

  try {
    try {
      const response = await fetch('https://media-menu.vercel.app/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph)
      });
      const data = await response.json();
      console.log(response.ok ? data.message : data.message);
    } catch (err) {
      console.error(err);
    }

    try {
      const response = await fetch('https://media-menu.vercel.app/high', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(high)
      });
      const data = await response.json();
      console.log(response.ok ? data.message : data.message);
    } catch (err) {
      console.error(err);
    }

    res.status(200).json({ message: 'done' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

app.post('/high', async (req, res) => {
  const inserts = req.body;
  const database = await getDb();
  try {
    const high = database.collection('high');
    const result = await high.insertMany(inserts);
    if (result.acknowledged) {
      return res.status(200).json({ message: 'added' });
    }
  } catch (err) {
    console.error(err);
  }
});

app.post('/graph', async (req, res) => {
  const inserts = req.body;
  const database = await getDb();
  try {
    const graph = database.collection('graph');
    const result = await graph.insertMany(inserts);
    if (result.acknowledged) {
      return res.status(200).json({ message: 'added' });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/getGraphData', async (req, res) => {
  const user = req.query.id;
  const database = await getDb();
  try {
    const graph = database.collection('graph');
    const all = await graph.find({ user }).toArray();
    const byGenre = all.flatMap(media =>
      media.genres.map(genre => ({
        genre: Genres[genre],
        rating: media.rating
      }))
    );
    const genreMap = {};
    byGenre.forEach(({ genre, rating }) => {
      if (!genreMap[genre]) {
        genreMap[genre] = { total: 0, count: 0 };
      }
      genreMap[genre].total += rating;
      genreMap[genre].count += 1;
    });
    const averagedRatings = Object.entries(genreMap).map(([genre, { total, count }]) => ({
      genre,
      averageRating: total / count
    }));
    res.status(200).json({ final: averagedRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed' });
  }

})

app.get('/recmovies', async (req, res) => {
  const user = req.query.id;
  const database = await getDb();
  const high = database.collection('high');
  const all = await high.find({ user: user, movie: true }).toArray();
  const fiveRandomPromises = getRandomItems(all, 5).map(async (media) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${media.media_id}/recommendations?language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: apiKey
        }
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  });
  const movies = await Promise.all(fiveRandomPromises);
  res.status(200).json({ results: getRandomItems(movies.flat(), 20) });
});

app.get('/recshows', async (req, res) => {
  const user = req.query.id;
  const database = await getDb();
  const high = database.collection('high');
  const all = await high.find({ user: user, movie: false }).toArray();
  const fiveRandomPromises = getRandomItems(all, 5).map(async (media) => {
    try {
      const url = `https://api.themoviedb.org/3/tv/${media.media_id}/recommendations?language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: apiKey
        }
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  });
  const movies = await Promise.all(fiveRandomPromises);
  res.status(200).json({ results: getRandomItems(movies.flat(), 20) });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});