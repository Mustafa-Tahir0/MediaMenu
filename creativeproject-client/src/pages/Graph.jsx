import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Graph.css';

export default function GraphScreen() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('id')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const getGraphData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getGraphData?id=${encodeURIComponent(localStorage.getItem('id'))}`);
                if (response.ok) {
                    const data = await response.json();
                    setData(data.final);
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
        getGraphData();
    }, []);

    const MyChart = () => (
        <ResponsiveContainer width='100%' height={1000}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis type="category" dataKey="genre" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageRating" fill="#e50914" />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '100vh'
        }}>
            {loading ? (
                <div className="spinner"></div>
            ) : data.length > 0 ? (
                <>
                    <h1>Average Ratings per Genre</h1>
                    <MyChart />
                </>
            ) : (
                <h1>No Ratings Found</h1>
            )}
        </div>
    );
}