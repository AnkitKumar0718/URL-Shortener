const express=require('express')
const app = express();
const dotenv=require('dotenv')
 dotenv.config();

const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./Config/passportConfig'); 

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./Routes/authRoutes');
const urlRoutes = require('./Routes/urlRoutes');

app.use(cors());
app.use((req, res, next) => {
    if (req.method === 'GET') {
        return next(); 
    }
    express.json()(req, res, next);
});

app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);
 
app.get('/', (req, res) => {   
    res.send("Welcome to the URL Shortener - Shorten your links, track clicks, and share easily!") 
});

const connectDB=require('./Database/database');
connectDB();

 app.listen(5000,()=>{
    console.log("server started on port 5000");  
 })

 