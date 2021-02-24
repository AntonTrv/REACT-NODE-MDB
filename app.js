const express = require('express');
const mongoose = require('mongoose');

//SERVER INITIALISATION
const app = express();

app.use(express.json({extended: true})); // middleWare to parse req.body objects

//Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));

//For external variables
const config = require('config');

//Set the PORT
const PORT = config.get('port') || 5000;
//MONGO connector mongoose
async function start() {
    try{
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen('5000', () => console.log(`App is running on PORT: ${PORT}`));
    }
        catch(err) {
        console.log({message: err});
        process.exit(1)
    }
};

start();


