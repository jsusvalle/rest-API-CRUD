require('./config/config');

const express = require('express');
const conectarDB = require('./config/db');

// Iniciar server
const app = express();

// Conectar a DB
conectarDB();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});