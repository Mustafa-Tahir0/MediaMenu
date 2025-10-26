# Media Menu 🎬

A full-stack personalized media recommendation platform that helps users discover movies and TV shows based on their preferences. Built with React and Node.js, featuring intelligent recommendation algorithms and real-time content discovery.

![Media Menu](https://img.shields.io/badge/Status-Live-success) ![React](https://img.shields.io/badge/React-19.0.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## 🌟 Features

### User Experience
- **Personalized Recommendations**: Smart algorithm that learns from user ratings and viewing preferences
- **Dynamic Search**: Real-time search with debouncing for smooth performance
- **Watchlist Management**: Save and organize movies and TV shows for later viewing
- **Interactive Star Ratings**: Rate content on a 5-star scale to improve recommendations
- **Similar Content Discovery**: Find related movies and shows based on your selections
- **Genre Analytics**: Visual representation of your viewing preferences through interactive charts

### Technical Highlights
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Netflix-inspired UI with polished transitions and hover effects
- **Secure Authentication**: Password hashing with bcrypt for user security
- **RESTful API**: Clean, scalable backend architecture
- **Real-time Data**: Integration with TMDB API for up-to-date content

## 🚀 Live Demo

**Frontend**: [media-menu-client.vercel.app](https://media-menu.vercel.app)  
**Backend API**: [media-menu.vercel.app](https://media-menu.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern component-based UI library
- **React Router DOM** - Client-side routing and navigation
- **Vite** - Lightning-fast build tool and dev server
- **Recharts** - Data visualization for genre analytics
- **CSS3** - Custom styling with Netflix-inspired design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for user data and preferences
- **bcrypt.js** - Password hashing and security
- **node-fetch** - HTTP client for external API calls

### External APIs
- **The Movie Database (TMDB) API** - Comprehensive movie and TV show data

### Deployment
- **Vercel** - Serverless deployment for both frontend and backend
- **MongoDB Atlas** - Cloud database hosting

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB instance)
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/media-menu.git
cd media-menu
```

### 2. Backend Setup
```bash
cd creativeproject-server
npm install
```

Create a `.env` file in the server directory:
```env
MONGO_URI=your_mongodb_connection_string
TMDB_API_KEY=Bearer your_tmdb_api_key
PORT=3000
```

### 3. Frontend Setup
```bash
cd ../creativeproject-client
npm install
```

### 4. Run the Application

**Start the backend server:**
```bash
cd creativeproject-server
npm run dev
```

**Start the frontend (in a new terminal):**
```bash
cd creativeproject-client
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## 📁 Project Structure

```
media-menu/
├── creativeproject-client/          # Frontend React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # User authentication
│   │   │   ├── Create.jsx          # Account creation
│   │   │   ├── Setup.jsx           # Initial preferences setup
│   │   │   ├── Home.jsx            # Main browsing interface
│   │   │   └── Graph.jsx           # Analytics dashboard
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── App.css                 # Authentication styling
│   │   ├── home.css                # Home page styling
│   │   ├── setup.css               # Setup page styling
│   │   └── Graph.css               # Graph page styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── creativeproject-server/          # Backend Node.js API
    ├── api/
    │   └── index.js                # Main server file with all routes
    ├── package.json
    ├── vercel.json                 # Vercel deployment config
    └── .env                        # Environment variables (not in repo)
```

## 🎯 Key Functionalities

### Authentication System
- Secure user registration and login
- Password hashing using bcrypt
- Session management with localStorage
- Protected routes and navigation guards

### Recommendation Engine
The application uses a sophisticated recommendation algorithm:
1. **Rating Collection**: Users rate movies/shows on a 5-star scale
2. **Genre Analysis**: Extracts genre preferences from rated content
3. **Weighted Scoring**: Higher-rated content influences recommendations more
4. **TMDB Integration**: Fetches similar content based on user preferences
5. **Randomization**: Adds variety by selecting from a pool of recommended items

### Data Flow
```
User Interaction → Frontend → Express API → MongoDB / TMDB API → Backend Processing → Frontend Update
```

## 🔑 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /create` - Create new account

### Content Discovery
- `GET /movies` - Trending movies
- `GET /tvshows` - Trending TV shows
- `GET /search?query={query}` - Search for content
- `GET /similar?id={id}&media={type}` - Get similar content

### User Preferences
- `POST /preferencer` - Update user preferences
- `GET /recmovies?id={userId}` - Get personalized movie recommendations
- `GET /recshows?id={userId}` - Get personalized TV recommendations

### Watchlist Management
- `GET /watchlist?id={userId}` - Retrieve user's watchlist
- `POST /postWatchlist` - Add item to watchlist
- `POST /removeWatchlist` - Remove item from watchlist

### Analytics
- `GET /getGraphData?id={userId}` - Get genre rating data for visualization
- `POST /graph` - Store rating data
- `POST /high` - Store highly-rated content for recommendations

## 💡 Algorithm Details

### Recommendation Algorithm
The recommendation system employs a collaborative filtering approach combined with content-based filtering:

1. **Initial Setup**: Users select and rate 5+ movies/shows they enjoy
2. **Preference Storage**: Ratings and genre associations stored in MongoDB
3. **Similar Content Fetching**: Uses TMDB's recommendation endpoint for each highly-rated item
4. **Fisher-Yates Shuffle**: Implements randomization for diverse recommendations
5. **Dynamic Updates**: Recommendations improve as users rate more content

### Genre Analytics
- Aggregates all ratings by genre
- Calculates average rating per genre
- Visualizes data using horizontal bar charts
- Helps users understand their viewing preferences

## 🎨 Design Philosophy

The UI draws inspiration from Netflix and modern streaming platforms:
- Dark theme optimized for media browsing
- Smooth scroll interactions for content rows
- Hover effects that highlight content
- Modal dialogs for detailed information
- Responsive grid layouts for search results
- Loading states with animated spinners

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- CORS configuration for secure cross-origin requests
- Environment variable protection for sensitive data
- MongoDB connection string security
- Input validation and sanitization

## 📊 Performance Optimizations

- **Debounced Search**: Reduces API calls during user typing (150ms delay)
- **Lazy Loading**: Content loads as needed
- **Request Batching**: Multiple similar requests processed efficiently
- **Fisher-Yates Shuffle**: O(n) randomization algorithm
- **Fade Transitions**: Smooth loading experience with CSS transitions

## 🌐 Deployment

Both frontend and backend are deployed on Vercel:

### Frontend Deployment
```bash
cd creativeproject-client
vercel --prod
```

### Backend Deployment
```bash
cd creativeproject-server
vercel --prod
```

The `vercel.json` configuration handles routing for the Express API.

## 🚧 Future Enhancements

- [ ] Social features (friends, shared watchlists)
- [ ] Advanced filtering (year, rating, runtime)
- [ ] Viewing history tracking
- [ ] Email notifications for new releases
- [ ] Multi-language support
- [ ] Integration with streaming service availability
- [ ] Machine learning-based recommendations
- [ ] User reviews and comments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mustafa Tahir**
- GitHub: [@Mustafa-Tahir0](https://github.com/Mustafa-Tahir0)
- LinkedIn: [Mustafa Tahir](https://www.linkedin.com/in/mustafatahir09)
- Email: mustafa.tahir0427@gmail.com
- Portfolio: [Live Site](https://mustafatahir.vercel.app)

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing comprehensive movie and TV data
- [Vercel](https://vercel.com/) for seamless deployment
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for reliable database hosting
- Netflix for UI/UX inspiration

## 📧 Contact

For questions or feedback, please reach out at your.email@example.com

---

⭐ Star this repository if you find it helpful!
