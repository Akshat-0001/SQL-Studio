const { ObjectId } = require('mongodb');
const { getDB, executeTaskQuery } = require('../db/database');
const Groq = require('groq-sdk');

exports.getAllAssignments = async (req, res) => {
    const data = await getDB().collection('assignments').find({}, { projection: { sampleTables: 0, expectedOutput: 0 } }).toArray();
    res.json(data);
};

exports.getAssignmentById = async (req, res) => {
    try {
        const a = await getDB().collection('assignments').findOne({ _id: new ObjectId(req.params.id) });
        a ? res.json(a) : res.status(404).json({ error: 'Not found' });
    } catch (e) { res.status(400).json({ error: 'Invalid ID' }); }
};

exports.executeSql = async (req, res) => {
    try {
        const { query, assignmentId } = req.body;
        const a = await getDB().collection('assignments').findOne({ _id: new ObjectId(assignmentId) });
        const result = await executeTaskQuery(a.sampleTables, query);
        const match = JSON.stringify(result) === JSON.stringify(a.expectedOutput.value);
        res.json({ isCorrect: match, result, expected: a.expectedOutput.value });
    } catch (e) {
        res.status(400).json({ error: e.message || 'Execution error' });
    }
};

exports.getHint = async (req, res) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: `Give small hint for SQL problem. No full query. 2 lines max.\nQ: ${req.body.question}\nQuery: ${req.body.userQuery}`
            }],
            model: 'llama-3.1-8b-instant'
        });
        res.json({ hint: completion.choices[0]?.message?.content });
    } catch (e) {
        res.status(500).json({ error: 'Hint failed' });
    }
};
