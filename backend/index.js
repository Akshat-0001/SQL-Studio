require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const { connectDB } = require('./db/database');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('Server running on', process.env.PORT || 5000));
}).catch(e => {
    console.log(e);
    process.exit(1);
});
