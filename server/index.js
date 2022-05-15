const express = require('express');
const connectToMongo = require('./db');
const auth = require('./routes/auth');
const notes = require('./routes/notes');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/notes', notes);

app.listen(port, () => {
    console.log("Server is Running")
})

connectToMongo();