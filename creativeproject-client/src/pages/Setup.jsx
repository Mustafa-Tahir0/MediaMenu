import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../setup.css'

export default function SetupScreen() {
    const [query, setQuery] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('id') || !localStorage.getItem('setup')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (query.trim() == '') return;
        const delayDebounce = setTimeout(() => {
            search();
        }, 150);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    const search = async () => {
        try {
            const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`, {
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

    function MediaCreation({ list, onSelect }) {
        return (
            <div className='left-grid-container'>
                {list.map((media) => (
                    <img
                        key={media.id}
                        src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8='}
                        alt={media.title}
                        onClick={() => onSelect(media)}
                        className="poster"
                    />
                ))}
            </div>
        );
    }

    function appendGrid(media) {
        if (!selectedMedia.find(item => item.id === media.id)) {
            setSelectedMedia(prev => [...prev, { ...media, rating: 0 }]);
        }
    }

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

    function finish() {
        const data = selectedMedia.map(info => ({
            id: info.id,
            genres: info.genre_ids,
            movie: info.title ? true : false,
            rating: info.rating
        }));
        preferencer(data);
    }

    const preferencer = async (media) => {
        try {
            const response = await fetch('http://localhost:3000/preferencer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: localStorage.getItem('id'), data: media })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                localStorage.removeItem('setup');
                navigate('/home');
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className='container'>
                <div className='left-half'>
                    <input type='text' placeholder='Search' value={query} onChange={(e) => setQuery(e.target.value)}></input>
                    <MediaCreation list={searchList} onSelect={appendGrid}></MediaCreation>
                </div>
                <div className='right-half'>
                    <div className='right-grid-container'>
                        {selectedMedia.map((media) => (
                            <div key={media.id} className="poster-container">
                                <img
                                    src={media.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                                        : 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8='}
                                    alt={media.title}
                                    className='poster-right'
                                />
                                <StarRating
                                    rating={media.rating}
                                    onRate={(star) => {
                                        setSelectedMedia(prev =>
                                            prev.map(item =>
                                                item.id === media.id ? { ...item, rating: star } : item
                                            )
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className="floating-button" onClick={() => finish()}>Finish Setup</button>
        </div>
    );
}