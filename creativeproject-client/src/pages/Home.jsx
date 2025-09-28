import '../home.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
    const [movieList, setMovieList] = useState([]);
    const [tvList, setTVList] = useState([]);
    const [recMovieList, setRecMovieList] = useState([]);
    const [recTVList, setRecTVList] = useState([]);
    const [watchList, setWatchList] = useState([]);
    const [similarList, setSimilarList] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [requestsComplete, setRequestsComplete] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [query, setQuery] = useState('');
    const [focus, setFocus] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('id')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await fetch('https://media-menu.vercel.app/movies');
                if (response.ok) {
                    const data = await response.json();
                    setMovieList(data.results);
                } else {
                    const err = await response.json();
                    console.log(err.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRequestsComplete(prev => prev + 1);
            }
        };
        const getShows = async () => {
            try {
                const response = await fetch('https://media-menu.vercel.app/tvshows');
                if (response.ok) {
                    const data = await response.json();
                    setTVList(data.results);
                } else {
                    const err = await response.json();
                    console.log(err.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRequestsComplete(prev => prev + 1);
            }
        };
        const getRecMovies = async () => {
            try {
                const response = await fetch(`https://media-menu.vercel.app/recmovies?id=${encodeURIComponent(localStorage.getItem('id'))}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecMovieList(data.results);
                } else {
                    const err = await response.json();
                    console.log(err.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRequestsComplete(prev => prev + 1);
            }
        };
        const getRecShows = async () => {
            try {
                const response = await fetch(`https://media-menu.vercel.app/recshows?id=${encodeURIComponent(localStorage.getItem('id'))}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecTVList(data.results);
                } else {
                    const err = await response.json();
                    console.log(err.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRequestsComplete(prev => prev + 1);
            }
        };
        getMovies();
        getShows();
        getWatchlist();
        getRecMovies();
        getRecShows();
    }, []);

    useEffect(() => {
        if (query.trim() == '') return;
        const delayDebounce = setTimeout(() => {
            search();
        }, 150);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    useEffect(() => {
        if (requestsComplete === 5) {
            setFadeOut(true);

            const timeout = setTimeout(() => {
                setLoading(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [requestsComplete]);

    useEffect(() => {
        if (!selectedMedia) { return; }
        const getSimilar = async () => {
            try {
                const media = selectedMedia.title ? 'movie' : 'tv';
                const response = await fetch(`https://media-menu.vercel.app/similar?id=${encodeURIComponent(selectedMedia.id)}&media=${encodeURIComponent(media)}`)
                if (response.ok) {
                    const data = await response.json();
                    setSimilarList(data.results);
                } else {
                    const err = await response.json();
                    console.log(err.message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getSimilar();
    }, [selectedMedia]);

    const logout = () => {
        localStorage.clear();
        navigate('/'); // or use <Navigate /> if you’re doing a conditional render
    };

    const search = async () => {
        try {
            const response = await fetch(`https://media-menu.vercel.app/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSearchList(data.results);
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getWatchlist = async () => {
        try {
            const response = await fetch(`https://media-menu.vercel.app/watchlist?id=${encodeURIComponent(localStorage.getItem('id'))}`);
            if (response.ok) {
                const data = await response.json();
                setWatchList(data.all);
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setRequestsComplete(prev => prev + 1);
        }
    };

    const postWatchlist = async (media) => {
        try {
            const response = await fetch('https://media-menu.vercel.app/postWatchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: localStorage.getItem('id'), id: media.id, movie: media.title ? true : false })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                getWatchlist();
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeWatchlist = async (media) => {
        try {
            const response = await fetch('https://media-menu.vercel.app/removeWatchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: localStorage.getItem('id'), id: media.id, movie: media.title ? true : false })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                getWatchlist();
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const preferencer = async (media) => {
        try {
            const response = await fetch('https://media-menu.vercel.app/preferencer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: localStorage.getItem('id'), data: media })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    function StarRating({ rating, onRate }) {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? 'star filled' : 'star'}
                        onClick={() => onRate(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    }

    function MediaModal({ media, onClose }) {
        const [onList, setOnList] = useState(false);

        useEffect(() => {
            setOnList(watchList.some(thing => thing.id == media.id));
        }, [watchList, media]);
        return (
            <div className="modal">
                <button className='tech' onClick={onClose}>Close</button><br></br>
                <button className='tech' onClick={!onList ? () => postWatchlist(media) : () => removeWatchlist(media)}>{!onList ? "Add to Watchlist" : "Remove from Watchlist"}</button>
                <StarRating rating={rating} onRate={(star) => setRating(star)} />
                <h2>{media.title ? media.title : media.name}</h2>
                <p>{media.overview}</p>
                <img src={`https://image.tmdb.org/t/p/w500${media.poster_path}`} />
                <div className="genre-row" id="recommended">
                    {similarList.length > 0 && (
                        <div className="genre-row" id="recommended">
                            <h2>Recommended Selection</h2>
                            <RowCreation list={similarList} onSelect={setSelectedMedia} cN='poster-home-rec' />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    function RowCreation({ list, onSelect, cN }) {
        const rowRef = useRef(null);

        const scrollRow = (direction) => {
            if (rowRef.current) {
                const scrollAmount = rowRef.current.clientWidth;
                rowRef.current.scrollBy({
                    left: direction === "left" ? -scrollAmount : scrollAmount,
                    behavior: "smooth",
                });
            }
        };

        return (
            <div className="row-container">
                <button className="scroll-btn left" onClick={() => scrollRow("left")}> &lt; </button>
                <div className="row-scroll" ref={rowRef}>
                    {list.map((media) => (
                        <img
                            key={media.id}
                            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                            alt={'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8='}
                            onClick={() => onSelect(media)}
                            className={cN}
                        />
                    ))}
                </div>
                <button className="scroll-btn right" onClick={() => scrollRow("right")}> &gt; </button>
            </div>
        );
    }

    function MediaCreation({ list, onSelect }) {
        return (
            <div className='search-container'>
                {list.map((media) => (
                    <img
                        key={media.id}
                        src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8='}
                        alt={media.title}
                        onClick={() => onSelect(media)}
                        className="poster-grid"
                    />
                ))}
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`loader-container ${fadeOut ? 'fade-out' : ''}`}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }
    return (
        <div className='home'>
            <div className='searchGrid'>
                {/* Button */}
                <button
                    className={`tech ${focus ? 'hidden' : ''}`}
                    onClick={() => setFocus(true)}
                >
                    Search 🔍
                </button>

                {/* Input field with transition */}
                <input
                    type='text'
                    className={focus ? 'focused' : ''}
                    placeholder='Search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Clear button */}
                {focus &&
                    <button
                        className='tech'
                        onClick={() => {
                            setFocus(false);
                            setQuery('');
                            setSearchList([]);
                        }}
                    >
                        x
                    </button>
                }
                <MediaCreation list={searchList} onSelect={setSelectedMedia}></MediaCreation>
                {selectedMedia && (
                    <MediaModal media={selectedMedia} onClose={() => {
                        if (rating != 0) { preferencer([{ id: selectedMedia.id, genres: selectedMedia.genre_ids, movie: !!selectedMedia.title, rating }]); }
                        setSelectedMedia(null);
                        setSimilarList([]);
                        setRating(0);
                    }} />
                )}
            </div>
            {!focus && (
                <>
                    <div className="profile-dropdown-container">

                        <button className="profile-btn" onClick={() => setShowDropdown(prev => !prev)}>
                            ☰ Profile
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/graph')}>Go to Graph</button>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                    <div className="genre-row">
                        <h2>Trending Movies</h2>
                        <RowCreation list={movieList} onSelect={setSelectedMedia} cN='poster-home' />
                    </div>

                    <br></br>

                    {recMovieList.length > 0 && (
                        <div className="genre-row">
                            <h2>Recommended Movies</h2>
                            <RowCreation list={recMovieList} onSelect={setSelectedMedia} cN='poster-home' />
                        </div>
                    )}

                    <br></br>

                    <div className="genre-row">
                        <h2>Trending TV Shows</h2>
                        <RowCreation list={tvList} onSelect={setSelectedMedia} cN='poster-home' />
                    </div>

                    <br></br>

                    {recTVList.length > 0 && (
                        <div className="genre-row">
                            <h2>Recommended Shows</h2>
                            <RowCreation list={recTVList} onSelect={setSelectedMedia} cN='poster-home' />
                        </div>
                    )}

                    <br></br>

                    {watchList.length > 0 && (
                        <div className="genre-row">
                            <h2>Watchlist</h2>
                            <RowCreation list={watchList} onSelect={setSelectedMedia} cN='poster-home' />
                        </div>
                    )}

                    {selectedMedia && (
                        <MediaModal media={selectedMedia} onClose={() => {
                            if (rating != 0) { preferencer([{ id: selectedMedia.id, genres: selectedMedia.genre_ids, movie: !!selectedMedia.title, rating }]); }
                            setSelectedMedia(null);
                            setSimilarList([]);
                            setRating(0);
                        }} />
                    )}
                </>
            )}
        </div>
    );
}