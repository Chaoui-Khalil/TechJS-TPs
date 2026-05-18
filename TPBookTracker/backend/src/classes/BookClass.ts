export class BookClass {
  title: string;
  author: string;
  pages: number;
  pagesRead: number;

  constructor(title: string, author: string, pages: number, pagesRead: number) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead;
  }

  currentlyAt() {
    return this.pagesRead;
  }

  isFinished() {
    return this.pagesRead >= this.pages;
  }

  progress() {
    return Math.round((this.pagesRead / this.pages) * 100);
  }
}