import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function AssignmentDetail({ id }) {
    const [d, setD] = useState({ a: null, q: '', res: null, err: '', hint: '', load: false });
    const api = (url, body) => axios.post(`http://localhost:5000/api/${url}`, body).then(r => r.data).catch(e => ({ error: e.response?.data?.error || 'Error' }));

    useEffect(() => { axios.get(`http://localhost:5000/api/assignments/${id}`).then(r => setD(x => ({ ...x, a: r.data }))) }, [id]);

    const run = async () => setD(x => ({ ...x, load: true, res: null, err: '' })) || api('execute', { query: d.q, assignmentId: id }).then(r => setD(x => ({ ...x, load: false, res: r.isCorrect !== undefined ? r : null, err: r.error })));
    const hint = async () => setD(x => ({ ...x, load: true, hint: '' })) || api('hint', { question: d.a.question, userQuery: d.q }).then(r => setD(x => ({ ...x, load: false, hint: r.hint || r.error })));

    if (!d.a) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="detail-page">
            <div className="left-panel">
                <div className="question-box"><h2>{d.a.title}</h2><p>{d.a.question}</p></div>
                <div className="tables-viewer">
                    <h3>TABLES</h3>
                    {d.a.sampleTables.map((t, i) => (
                        <div key={i} className="table-container">
                            <h4>{t.tableName}</h4>
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead><tr>{t.columns.map(c => <th key={c.columnName}>{c.columnName}</th>)}</tr></thead>
                                    <tbody>{t.rows.map((r, i) => <tr key={i}>{t.columns.map(c => <td key={c.columnName}>{r[c.columnName]}</td>)}</tr>)}</tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="right-panel">
                <div className="editor-header">
                    <span className="panel-title">SQL EDITOR</span>
                    <div className="actions">
                        <button className="btn secondary" onClick={hint} disabled={d.load}>HINT</button>
                        <button className="btn primary" onClick={run} disabled={d.load || !d.q}>RUN</button>
                    </div>
                </div>

                <div className="editor-container">
                    <Editor height="100%" defaultLanguage="sql" theme="vs-dark" value={d.q} onChange={v => setD({ ...d, q: v })} options={{ minimap: { enabled: false }, fontSize: 16 }} />
                </div>

                <div className="results-panel">
                    <h3>RESULTS</h3>
                    {d.res && <span className={`status ${d.res.isCorrect ? 'correct' : 'incorrect'}`}>{d.res.isCorrect ? 'MATCH' : 'FAIL'}</span>}
                    {d.hint && <div className="hint-msg">HINT: {d.hint}</div>}
                    {d.err && <div className="error-msg">ERROR: {d.err}</div>}

                    {d.res?.resultData && (
                        d.res.resultData.length === 0 ? <p>0 rows.</p> :
                            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead><tr>{Object.keys(d.res.resultData[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                                    <tbody>{d.res.resultData.map((r, i) => <tr key={i}>{Object.keys(r).map(k => <td key={k}>{r[k]}</td>)}</tr>)}</tbody>
                                </table>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
}
