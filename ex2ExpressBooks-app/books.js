const express = require('express');

const router = express.Router();

const books = [
    { id: 1, title: "Clean Code" },
    { id: 2, title: "Node.js Guide" }
];

router.get('/', (req, res) => {

    res.json({
        success: true,
        books: books
    });
});

module.exports = router;