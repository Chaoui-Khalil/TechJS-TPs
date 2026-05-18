const API = "http://localhost:3000/api/books";

const form = document.getElementById("bookForm");
const booksDiv = document.getElementById("books");
const statsDiv = document.getElementById("stats");

// 🚨 error display (optional but clean)
const errorBox = document.getElementById("errorBox");
errorBox.style.color = "red";
errorBox.style.marginBottom = "10px";


// ➜ CREATE BOOK
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.innerText = ""; // reset error

  const data = Object.fromEntries(new FormData(form));

  data.pages = Number(data.pages);
  data.pagesRead = Number(data.pagesRead);
  data.price = Number(data.price);

  // 🚨 FRONTEND VALIDATION
  if (data.price < 0) {
    errorBox.innerText = "Price cannot be negative";
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      errorBox.innerText = result.message || "Error while creating book";
      return;
    }

    form.reset();
    loadBooks();

  } catch (err) {
    errorBox.innerText = "Server not reachable";
  }
});

// ➜ LOAD BOOKS
async function loadBooks() {
  try {
    const res = await fetch(API);
    const books = await res.json();

    booksDiv.innerHTML = "";

    let totalPages = 0;
    let totalRead = 0;
    let finishedCount = 0;

    books.forEach(book => {
      const percent = Math.round((book.pagesRead / book.pages) * 100);

      totalPages += book.pages;
      totalRead += book.pagesRead;
      if (book.finished) finishedCount++;

      booksDiv.innerHTML += `
        <div class="bg-white p-4 rounded shadow mb-3">

            <h3 class="text-lg font-bold">${book.title}</h3>
            <p>✍️ Author: ${book.author}</p>
            <p>💰 Price: ${book.price} DH</p>
            <p>📊 Status: ${book.status}</p>

            <p>📄 ${book.pagesRead}/${book.pages} (${percent}%)</p>

            <div class="w-full bg-gray-200 h-2 rounded">
            <div class="bg-green-500 h-2 rounded" style="width:${percent}%"></div>
            </div>

            <button onclick="deleteBook('${book._id}')"
            class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
            Delete
            </button>

            <button onclick="updateBook('${book._id}')"
            class="mt-2 ml-2 bg-blue-500 text-white px-3 py-1 rounded">
            Update
            </button>

        </div>
        `;
    });

    statsDiv.innerHTML = `
      📚 Total Books: ${books.length} <br/>
      ✅ Finished: ${finishedCount} <br/>
      📄 Total Pages: ${totalPages} <br/>
      📖 Pages Read: ${totalRead}
    `;

  } catch (err) {
    statsDiv.innerHTML = "Error loading books";
  }
}

// ➜ DELETE BOOK
async function deleteBook(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadBooks();
}

// 🔥 ➜ UPDATE BOOK (AJOUT ICI)
async function updateBook(id) {
  const pagesRead = prompt("Enter pages read:");
  const price = prompt("Enter price:");

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pagesRead,
      price
    })
  });

  loadBooks();
}

// init
loadBooks();