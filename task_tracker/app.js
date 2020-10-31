const express = require('express');
const dotenv = require("dotenv");
const path = require('path');
const { urlencoded } = require('express');
const db = require("./connect");
const cookieParser = require('cookie-parser')
const session = require('express-session');
//const redisStore = require('connect-redis')(session);
//const redis = require('redis');
//const client = redis.createClient();
const { handlebars } = require('hbs');

// Specifying path to environment variables
dotenv.config( {path: "./.env"});

const app = express();

// Increment function for hbs
handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

// Session handler
app.use(session({
    secret: 'secret-key',
    //store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl : 260}),
    cookie: {
        maxAge: 6000000
    },
    saveUninitialized: false,
    resave: false
}));

// Creates connection to database
const pool = db();

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (Fetch data sent by html form)
app.use(urlencoded({extended:false}));

// Parse JSON bodies (data sent by forms comes in as JSON format)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

// Connects to the database
pool.getConnection( (error,connection) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Mysql connected");
    }
})

// Handles all url requests and fetches from routes folder
app.use("/", require('./routes/pages'));

// Url handler for url that starts with /auth
app.use("/auth", require("./routes/auth"));


// Starting the server on port 3000
app.listen("3000", () =>{
    console.log("Server started on port 3000");
})