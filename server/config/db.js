const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({path: `.env.${NODE_ENV}`});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB CONECTADOO')
    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = conectarDB;