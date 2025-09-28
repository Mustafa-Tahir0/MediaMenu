import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('id')) {
            navigate('/home');
        }
    }, [navigate]);

    const handleCreateLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('id', data.id);
                localStorage.setItem('setup', true);
                navigate('/setup');
            } else {
                const err = await response.json();
                console.log(err.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='acc'>
            <form onSubmit={handleCreateLogin}>
            <label>Username:</label>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input><br></br>
            <label>Password:</label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input><br></br>
            <input type='submit'></input>
            </form>
        </div>
    );
}