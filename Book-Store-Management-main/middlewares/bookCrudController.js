const bookSchema = require('../models/bookSchema');
const userSchema = require('../models/userSchema');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    try {
        res.render('admin');
    } catch(error) {
        console.log("Error in logging in");
    }
}

exports.verifyAdmin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const adminData = await userSchema.findOne({email});
        if(adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);
            if(passwordMatch) {
                if(adminData.isAdmin) {
                    // res.send("Admin login successful");
                    res.render('adminHome');
                } else {
                    res.send("Not an admin");
                }
            } else {
                res.send("Invalid credentials");
            }
        } else {
            res.send("Inavlid Credentials");
        }

    } catch(error) {
        console.log("error",error);
        res.redirect("back");
    }
}

exports.addBookPage = async (req,res) => {
    try {
        res.render('addBooks');
    } catch(error) {
        res.send(error);
    }
}

exports.addBook = async (req,res) => {
    try {
        const {name, author, edition, price} = req.body;
        const bookData = await bookSchema.findOne({name,edition});
        if(bookData) {
            res.send("Book already exists");
        } else {
            const addedBook = await bookSchema.create({name,author,edition, price});
            console.log(addedBook);
            res.send("Added Book Successfully");
        }
    } catch(error) {
        res.send("Error in adding the book");
    }
}

exports.updateBookPage = async (req,res) => {
    try {
        const {name,edition} = await req.body;
        const bookData = await bookSchema.findOne({name,edition});
        if(bookData) {
            res.render("updateBooks");
        } else {
            res.send("Book does not exists");
        }
    } catch(error) {
        res.send("Error in fetching the book update page");
    }
}

exports.updateBook = async (req,res) => {
    try {
        const {name,edition,price} = req.body;
        const bookData = await bookSchema.findOneAndUpdate({name,edition}, {name,price}, {new:true});
        res.json(bookData);
    } catch(error) {
        res.send("Error in updating the book");
    }
}

exports.deleteBook = async (req,res) => {
    try {
        const {name,edition} = req.body;
        const deletedBook = await bookSchema.findOneAndDelete({name,edition});
        if(deletedBook) {
            res.send(`Deleted Book Successfully ${deletedBook}`);
        } else {
            res.send("Book does not exists");
        }
    } catch(err) {
        res.send(`Error in deleting the Book ${err}`);
    }
    
}

exports.addToCart = async (req,res) => {
    if(!req.session.isLoggedIn) {
        return res.send("Login First to add item to cart");
    }
    const bookId = req.body;
    const userId = req.session.user._id;
    try {
        const user = await userSchema.findById(userId);
        // console.log("userId: ",userId);
        const book = await bookSchema.findById(bookId);
        // console.log("bookId:",bookId);
        
    
        if (!user || !book) {
          return res.status(404).json({ message: 'User or book not found' });
        }

    
        user.cart.push(book);
        await user.save();
        console.log("Added to cart Successfully");
        res.redirect('/'); // Assuming you have a route to display products
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

exports.viewCart = async (req,res) => {
    try {
        const userId = req.session.user._id;
        const user = await userSchema.findById(userId);
        // const bookData = await bookSchema.find(user.cart);
        // res.send("Let's view the cart");
        // return res.json(user.cart);
        const cartItems = user.cart;
        // console.log(bookData);
        // const cartItems = await bookSchema.find({ _id: { $in: bookData } });
        // console.log(cartItems);
        const bookCounts = new Map(); // Use a Map to keep track of book counts

        // Iterate through cart items and update book counts
        const processCartItem = async (item) => {
            const some = await bookSchema.findById(item).exec();
            const bookId = item.toString();
            // console.log("bookId: ",bookId); 
            if(some) {
                if (bookCounts.has(bookId)) {
                    bookCounts.set(bookId, {
                        some,
                        count: bookCounts.get(bookId).count + 1
                    });
                } else {
                    bookCounts.set(bookId,  {
                        some,
                        count: 1
                    });
                }
                // console.log(bookCounts);
            };
            
        }
            
        for (const item of cartItems) {
            await processCartItem(item);
        }
        
        // console.log("final book counts: ",bookCounts);
        // console.log(bookCounts.entries());
        res.render('myCart', {bookCounts});
    } catch(err) {
        console.log(err);
        return res.redirect("back");
    }
}