const baseURL = 'http://localhost:3000' 
const bookSearchURL = `${baseURL}/book_search`
const saveBookURL = `${baseURL}/save_book`

const savedBooksButton = document.querySelector('#saved-books-button')
const logoutButton = document.querySelector('#logout-button')
const errorMessage = document.querySelector('#error-message')
const searchForm = document.querySelector('.search-form')
const bookList = document.querySelector('.book-list')

logoutButton.addEventListener('click', logout)
savedBooksButton.addEventListener('click', savedBooksPage)
searchForm.addEventListener('submit', searchBooks)

fetch(`${bookSearchURL}?search="Good Summer Reads 2020"`)
    .then(response => response.json())
    .then(result => {
        renderBooks(result.data.attributes.book_search_results)
    })

function logout(){
    localStorage.clear()
    window.location = 'index.html'
}

function savedBooksPage(){
    window.location = 'show.html'
}

function searchBooks(event){
    event.preventDefault()
    const formData = new FormData(event.target)
    const search = formData.get('search')
  
    fetch(`${bookSearchURL}?search=${search}`)
        .then(response => response.json())
        .then(result => {
            removeCurrentBookList()
            renderBooks(result.data.attributes.book_search_results)
        })
}

function removeCurrentBookList(){
    const allBookListItems = document.querySelectorAll('.book-list li')
    allBookListItems.forEach(item => item.remove())
}

function sendSearchRequest(url){
    fetch(url)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        renderBooks(result.data.attributes.book_search_results)
    })
}

function renderBooks(books){
    books.forEach(book => {
        const bookLi = document.createElement('li')
        bookLi.id = book.isbn_13
        const bookCard = document.createElement('div')
        
        showTitle(book.title, bookCard)
        showAuthors(book.authors, bookCard)
        showPublishedDate(book.published_date, bookCard)
        showPageCount(book.page_count, bookCard)
        showCategories(book.categories, bookCard)
        showDescription(book.description, bookCard)
        showImage(book.image_link, bookCard)
        saveButton(book, bookCard)
        
        bookLi.append(bookCard)
        bookList.append(bookLi)
    })
}

function showTitle(title, bookCard){
    const h2 = document.createElement('h2')
    h2.class = 'book-title'
    h2.textContent = title 
    bookCard.append(h2)
}

function showAuthors(authors, bookCard){
    const p = document.createElement('p')
    p.class = 'authors'
    p.textContent = `Authors: ${authors}`
    bookCard.append(p)
}

function showPublishedDate(publishedDate, bookCard){
    const p = document.createElement('p')
    p.class = 'published-date'
    p.textContent = `Published: ${publishedDate}`
    bookCard.append(p)
}

function showPageCount(pageCount, bookCard){
    if (pageCount != null){
        const p = document.createElement('p')
        p.class = 'page-count'
        p.textContent = `${pageCount} Pages`
        bookCard.append(p)
    }
}

function showCategories(categories, bookCard){
    const p = document.createElement('p')
    p.class = 'categories'
    p.textContent = categories
    bookCard.append(p)
}

function showDescription(description, bookCard){
    const p = document.createElement('p')
    p.class = 'description'
    p.textContent = description
    bookCard.append(p)
}


function showImage(imageLink, bookCard){
    const image = document.createElement('img')
    image.class = 'image'
    image.src = imageLink
    bookCard.append(image)
}

function saveButton(book, bookCard){
    const saveBookButton = document.createElement('button')
    saveBookButton.type = 'button'
    saveBookButton.textContent = 'Save to your Bookshelf'
    saveBookButton.addEventListener('click', () => {
        saveBook(book)
    })
    bookCard.append(saveBookButton)
}

function saveBook(book){
    fetch(saveBookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(book)
    })
        .then(response => response.json())
        .then(console.log)
}
