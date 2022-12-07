// Data
// {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
// }

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_APPS";

console.log(books);

let generatedId = () => {
    return +new Date();
}

let genereateBooksObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

let findBooks = (booksId) => {
    for(const item of books){
        if(item.id === booksId){
            return item;
        }
    }
    return null;
}

let findBookIndex = (booksId) => {
    for(const index in books) {
        if(books[index].id === booksId){
            return index;
        }
    }
    return -1;
}

let isStorageExist = () => {
    if (typeof(Storage) === undefined){
        window.alert("Browser Tidak Mendukung Local Storage");
        return false;
    }
    return true;
}

let saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

let loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    
    if (data !== null){
        books.splice(0, books.length);
        for (const item of data) {
            books.push(item);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

let showBooks = (booksObject) => {
    const {id, title, author, year, isComplete} = booksObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;

    const textYear = document.createElement('p');
    textYear.innerText = year;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener('click', function () {
        removeBook(id);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, buttonContainer);

    if(isComplete) {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('green');
        unfinishedButton.innerText = "Belum Selesai Dibaca";
        unfinishedButton.addEventListener('click', function () {
            moveToUnfinished(id);
        });

        buttonContainer.append(unfinishedButton, deleteButton);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('green');
        finishedButton.innerText = "Selesai Dibaca";
        finishedButton.addEventListener('click', function () {
            moveToFinished(id);
        });

        buttonContainer.append(finishedButton, deleteButton);
    }

    return container;
}

let addBook = () => {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const Year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generatedId();
    const booksObject = genereateBooksObject(generatedID, textTitle, textAuthor, Year, isComplete);
    books.push(booksObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let searchBook = () => {
    loadDataFromStorage();
    const textSearchTitle = document.getElementById('searchBookTitle').value;
    const searchTitle = books.filter(book => book.title.includes(textSearchTitle));
    books.splice(0, books.length);
    for(item of searchTitle){
        books.push(item);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

let moveToFinished = (id) => {
    const bookTarget = findBooks(id);

    if (bookTarget == null){
        return;
    }

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let moveToUnfinished = (id) => {
    const bookTarget = findBooks(id);

    if(bookTarget == null){
        return;
    }

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let removeBook = (id) => {
    const bookTarget = findBookIndex(id);

    if(bookTarget == -1){
        return;
    }

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function () {
    console.log('Data Berhasil di Simpan');
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBokkshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBokkshelfList.innerHTML = '';

    for (const item of books) {
        const bookElement = showBooks(item);
        if (item.isComplete){
            completeBokkshelfList.append(bookElement);
        } else {
            incompleteBookshelfList.append(bookElement);
        }
    }
});