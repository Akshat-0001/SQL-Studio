const { MongoClient } = require('mongodb');
const { Client } = require('pg');
const fs = require('fs');

let db;

exports.connectDB = async () => {
    const mc = new MongoClient(process.env.MONGO_URI);
    await mc.connect();
    db = mc.db('ciphersqlstudio');
    console.log('MongoDB connected');

    // Seed
    const coll = db.collection('assignments');
    if (await coll.countDocuments() === 0) {
        const data = JSON.parse(fs.readFileSync(__dirname + '/../../CipherSqlStudio-assignment.json', 'utf8'));
        await coll.insertMany(data.map(i => ({ ...i, createdAt: new Date(i.createdAt), updatedAt: new Date(i.updatedAt) })));
        console.log('DB seeded');
    }
};

exports.getDB = () => db;

exports.executeTaskQuery = async (tables, query) => {
    const pg = new Client({ connectionString: process.env.POSTGRES_URI });
    await pg.connect();

    const schema = `ws_${Date.now()}`;
    try {
        await pg.query(`CREATE SCHEMA ${schema}; SET search_path TO ${schema}`);

        for (let t of tables) {
            await pg.query(`CREATE TABLE ${t.tableName} (${t.columns.map(c => `${c.columnName} ${c.dataType}`).join(', ')})`);
            for (let r of t.rows) {
                let keys = Object.keys(r).join(',');
                let vals = Object.values(r).map(v => typeof v === 'string' ? `'${v}'` : v).join(',');
                await pg.query(`INSERT INTO ${t.tableName} (${keys}) VALUES (${vals})`);
            }
        }

        if (!query.trim().toUpperCase().startsWith('SELECT')) throw new Error('SELECT only');

        const res = await pg.query(query);
        return res.rows;
    } finally {
        await pg.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
        await pg.end();
    }
};
