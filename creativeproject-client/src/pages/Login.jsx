import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('id')) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });
            if (response.ok) {
                const data = await response.json();
                // logic for setting data.id and then nav to /home
                localStorage.setItem('id', data.id);
                navigate('/home');
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
            <form onSubmit={handleLogin}>
                <h1>Media Menu</h1>
                <label>Username:</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>

                <label>Password:</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                <div class="form-footer">
                    <a href='/create'>Create Account</a>
                    <input type='submit' value="Login"></input>
                </div>
            </form>
        </div>
    );
}