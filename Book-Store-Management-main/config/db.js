const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Mahammed:xQEZDvCKO60Zec7k@cluster0.wlrbjfy.mongodb.net/bookStore",{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (error) => {
    console.log('error occurred while connecting to database',error);
}); 

db.once("open", ()=> {
    console.log('Successfully Connected to the database');
})

