import { Request, Response } from "express";
import { Book } from "../models/book";
import { Status } from "../models/book";
import { BookClass } from "../classes/BookClass";

// ➜ CREATE BOOK
export const createBook = async (req: any, res: any) => {
  try {
    const { title, author, pages, pagesRead, price, status } = req.body;

    const p = Number(pages);
    const pr = Number(pagesRead);
    const prc = Number(price);

    // 🚨 validation négatif
    if (p < 0 || pr < 0 || prc < 0) {
      return res.status(400).json({
        success: false,
        message: "Pages, pagesRead and price cannot be negative"
      });
    }

    // 🚨 logique métier pages
    if (pr > p) {
      return res.status(400).json({
        success: false,
        message: "Pages read cannot be greater than total pages"
      });
    }

    // 🚨 LOGIQUE STATUS (IMPORTANT TP)
    if (status === "Read" && pr !== p) {
      return res.status(400).json({
        success: false,
        message: "If status is READ, pagesRead must equal pages"
      });
    }

    if (status === "Re-read" && pr !== p) {
      return res.status(400).json({
        success: false,
        message: "If status is RE-READ, pagesRead must equal pages"
      });
    }

    if (status === "Returned Unread" && pr !== 0) {
      return res.status(400).json({
        success: false,
        message: "Returned Unread must have pagesRead = 0"
      });
    }

    if (status === "Want to read" && pr !== 0) {
      return res.status(400).json({
        success: false,
        message: "Want to read must have pagesRead = 0"
      });
    }

    if (status === "Currently reading" && pr >= p) {
      return res.status(400).json({
        success: false,
        message: "Currently reading must have pagesRead less than pages"
      });
    }

    if (status === "DNF" && pr >= p) {
      return res.status(400).json({
        success: false,
        message: "DNF must have pagesRead less than pages"
      });
    }

    // ✅ CREATE BOOK
    const book = await Book.create({
      ...req.body,
      pages: p,
      pagesRead: pr,
      price: prc
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err
    });
  }
};

// ➜ UPDATE BOOK
export const updateBook = async (req: any, res: any) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // ✔ only take what is sent
    const pagesRead = req.body.pagesRead !== undefined
      ? Number(req.body.pagesRead)
      : book.pagesRead;

    const price = req.body.price !== undefined
      ? Number(req.body.price)
      : book.price;

    // validation
    if (pagesRead < 0 || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Negative values not allowed"
      });
    }

    // ✔ AUTO STATUS (SAFE)
    let newStatus: Status = book.status;

    if (pagesRead === 0) {
    newStatus = Status.WantToRead;
    }
    else if (pagesRead >= book.pages) {
    newStatus = Status.Read;
    }
    else {
    newStatus = Status.CurrentlyReading;
    }

    const updated = await Book.findByIdAndUpdate(
      id,
      {
        pagesRead,
        price,
        status: newStatus,
        finished: pagesRead >= book.pages
      },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: "Book updated",
      data: updated
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

// ➜ GET ALL BOOKS
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ➜ DELETE BOOK
export const deleteBook = async (req: Request, res: Response) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ➜ GLOBAL STATS (TP requirement)
export const getStats = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();

    const totalBooks = books.length;
    const finishedBooks = books.filter(b => b.finished).length;
    const totalPages = books.reduce((sum, b) => sum + b.pages, 0);
    const totalPagesRead = books.reduce((sum, b) => sum + b.pagesRead, 0);

    res.json({
      totalBooks,
      finishedBooks,
      totalPages,
      totalPagesRead
    });

  } catch (err) {
    res.status(500).json(err);
  }
};