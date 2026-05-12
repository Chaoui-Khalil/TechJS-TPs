require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const booksRouter = require('./books');

const app = express();



// JSON MIDDLEWARE

app.use(express.json());



// SESSION

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));



// MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));



// REGISTER

app.post('/register', async (req, res) => {

    try {

        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: "Utilisateur créé"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



// LOGIN

app.post('/login', async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            loggedIn: true
        };

        res.json({
            success: true,
            message: "Connexion réussie",
            user: req.session.user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



// AUTH MIDDLEWARE

function auth(req, res, next) {

    if (req.session.user && req.session.user.loggedIn) {

        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Accès refusé"
    });
}



// PROTECTED BOOKS ROUTE

app.use('/books', auth, booksRouter);



// LOGOUT

app.get('/logout', (req, res) => {

    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({
        success: true,
        message: "Déconnecté"
    });
});



// SERVER

app.listen(process.env.PORT, () => {

    console.log(`Server running on port ${process.env.PORT}`);
});