import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignmentListing({ onSelect }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/assignments').then(r => setData(r.data)).catch(() => alert('Error'));
    }, []);

    if (!data.length) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="listing-page">
            <h2>ASSIGNMENTS</h2>
            <div className="assignments-grid">
                {data.map(a => (
                    <div key={a._id} className="assignment-card" onClick={() => onSelect(a._id)}>
                        <h3>{a.title}</h3><p>{a.question}</p>
                        <span className={`difficulty ${a.description}`}>{a.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
