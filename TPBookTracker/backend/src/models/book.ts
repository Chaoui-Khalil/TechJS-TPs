import { Schema, model } from "mongoose";

/* 📌 ENUM STATUS */
export enum Status {
  Read = "Read",
  ReRead = "Re-read",
  DNF = "DNF",
  CurrentlyReading = "Currently reading",
  ReturnedUnread = "Returned Unread",
  WantToRead = "Want to read"
}

/* 📌 ENUM FORMAT */
export enum Format {
  Print = "Print",
  PDF = "PDF",
  Ebook = "Ebook",
  AudioBook = "AudioBook"
}

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    pagesRead: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: Object.values(Status),
      required: true
    },

    price: { type: Number, required: true },

    format: {
      type: String,
      enum: Object.values(Format),
      required: true
    },

    suggestedBy: { type: String, required: false },

    finished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* 📌 AUTO LOGIC (important) */
bookSchema.pre("save", function () {
  this.finished = this.pagesRead >= this.pages;
});

export const Book = model("Book", bookSchema);