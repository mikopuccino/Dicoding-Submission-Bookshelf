const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const uncompletedBookList = document.getElementById("booksUnCompleted");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("booksCompleted");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = addBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const search = document.getElementById("searchSubmit");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    getBook();
    reset();
  });
  search.addEventListener("click", function (event) {
    event.preventDefault();
    searchBooks();
    // reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function reset() {
  const resetForm = document.getElementById("inputBook");
  resetForm.reset();
}

function getBook() {
  const bookTitle = document.getElementById("bookTitle").value;
  const bookAuthor = document.getElementById("bookAuthor").value;
  const bookYear = document.getElementById("bookYear").value;
  const bookImage = document.getElementById("bookImage").value;

  const generatedID = generateId();
  const isCompleted = document.getElementById("bookIsComplete").checked;
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookImage,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, image, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    image,
    isCompleted,
  };
}

function addBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;
  const URLCover = document.createElement("img");
  URLCover.src = bookObject.image;

  const textDescriptionContainer = document.createElement("div");
  textDescriptionContainer.classList.add("description");
  textDescriptionContainer.append(textTitle, textAuthor, textYear);

  const textCover = document.createElement("div");
  textCover.classList.add("cover");
  textCover.append(URLCover);

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("bookList");
  bookContainer.setAttribute("id", `${bookObject.id}`);
  bookContainer.append(textCover, textDescriptionContainer);

  if (bookObject.isCompleted) {
    const uncompletedButton = document.createElement("button");
    uncompletedButton.classList.add("moveButton");
    uncompletedButton.innerHTML = "Move";

    uncompletedButton.addEventListener("click", function () {
      moveToUncompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerHTML = "Delete";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.innerHTML = "Edit";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("actionButton");
    buttonDiv.append(uncompletedButton, editButton, trashButton);

    textDescriptionContainer.append(buttonDiv);
  } else {
    const completedButton = document.createElement("button");
    completedButton.classList.add("moveButton");
    completedButton.innerHTML = "Add";

    completedButton.addEventListener("click", function () {
      addToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashButton");
    trashButton.innerHTML = "Delete";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.innerHTML = "Edit";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("actionButton");
    buttonDiv.append(completedButton, editButton, trashButton);

    textDescriptionContainer.append(buttonDiv);
  }
  return bookContainer;
}

function addToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToUncompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const edit = document.getElementById("editBookdiv");
  // const cancelSubmit = document.getElementsById("editBtnCancel");
  edit.style.display = "flex";
  const bookTarget = findBook(bookId);
  const editBookTitle = document.getElementById("editbookTitle");
  editBookTitle.value = bookTarget.title;
  const editBookAuthor = document.getElementById("editbookAuthor");
  editBookAuthor.value = bookTarget.author;
  const editYear = document.getElementById("editbookYear");
  editYear.value = bookTarget.year;
  const editImage = document.getElementById("editbookImage");
  editImage.value = bookTarget.image;
  const editIsCompleted = document.getElementById("editbookIsComplete");
  editIsCompleted.checked = bookTarget.isCompleted;
  const editSubmit = document.getElementById("editbookSubmit");
  editSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    updateEditBook(bookId);
    edit.style.display = "none";
  });
  window.onclick = function (event) {
    if (event.target == edit) {
      edit.style.display = "none";
    }
  };
}

function updateEditBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  const updateTitle = document.getElementById("editbookTitle").value;
  const updateAuthor = document.getElementById("editbookAuthor").value;
  const updateYear = document.getElementById("editbookYear").value;
  const updateImage = document.getElementById("editbookImage").value;
  const isComplete = document.getElementById("editbookIsComplete").checked;

  bookTarget.title = updateTitle;
  bookTarget.author = updateAuthor;
  bookTarget.year = updateYear;
  bookTarget.image = updateImage;
  bookTarget.isCompleted = isComplete;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBooks() {
  const searchBook = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const bookList = document.querySelectorAll("h3");
  for (const book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.parentElement.style.display = "flex";
      // searchBook.reset();
    } else {
      book.parentElement.parentElement.style.display = "none";
    }
  }
}

const toggleMenu = document.querySelector(".nav-menu");
document.querySelector("#toggle-btn").addEventListener("click", function () {
  toggleMenu.classList.toggle("active");
});

const toggleBtn = document.querySelector("#toggle-btn");
document.addEventListener("click", function (e) {
  if (!toggleBtn.contains(e.target) && !toggleMenu.contains(e.target)) {
    toggleMenu.classList.remove("active");
  }
});
