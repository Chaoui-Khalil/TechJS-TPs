import express from "express";
import {
  createBook,
  getBooks,
  deleteBook,
  getStats,
  updateBook
} from "../controllers/bookController";

const router = express.Router();

router.post("/books", createBook);
router.get("/books", getBooks);
router.delete("/books/:id", deleteBook);
router.put("/books/:id", updateBook);
// NEW
router.get("/stats", getStats);

export default router;