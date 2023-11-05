const express = require('express');
const path = require("path");
const app = express();
const port = 7000;
const bookSchema = require('./models/userSchema');
const userSchema = require('./models/userSchema');
const cartSchema = require('./models/cartSchema');
const db = require('./config/db');
const bookRoutes = require("./routes/bookRoutes");

const methodOverride = require('method-override');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: "mongodb+srv://Mahammed:xQEZDvCKO60Zec7k@cluster0.wlrbjfy.mongodb.net/bookStore",
    collection: 'sessions'
});
  

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(session({
    secret: '123456789',  // Change this to a random secret key
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 3600000
    }
}));


app.use(express.urlencoded());
app.use('/static', express.static('static'));

app.use('/',bookRoutes);

// app.get('/', (req,res) => {
    //     res.send("Mahammed Anish");
    // });
    
    
app.use(methodOverride('_method'));
    
app.listen(port, (err) => {
    if(err) {
        console.log("Error in connecting to the server");
    } else {
        console.log("Server is running on the port",port);
    }
})