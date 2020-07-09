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
        bookCard.classList.add('book-card')
        
        showTitle(book.title, bookCard)
        showAuthors(book.authors, bookCard)
        showPublishedDate(book.published_date, bookCard)
        showPageCount(book.page_count, bookCard)
        showCategories(book.categories, bookCard)
        showImage(book.image_link, bookCard)
        showDescription(book.description, bookCard)
        saveButton(book, bookCard)
        
        bookLi.append(bookCard)
        bookList.append(bookLi)
    })
}

function showTitle(title, bookCard){
    const h2 = document.createElement('h2')
    h2.classList.add('book-title')
    h2.textContent = title 
    bookCard.append(h2)
}

function showAuthors(authors, bookCard){
    const p = document.createElement('p')
    p.classList.add('authors')
    p.textContent = authors
    bookCard.append(p)
}

function showPublishedDate(publishedDate, bookCard){
    const p = document.createElement('p')
    p.classList.add('published-date')
    p.classList.add('hidden')
    p.textContent = `Published: ${publishedDate}`
    bookCard.append(p)
}

function showPageCount(pageCount, bookCard){
    if (pageCount != null){
        const p = document.createElement('p')
        p.classList.add('page-count')
        p.classList.add('hidden')
        p.textContent = `${pageCount} Pages`
        bookCard.append(p)
    }
}

function showCategories(categories, bookCard){
    const p = document.createElement('p')
    p.classList.add('categories')
    p.classList.add('hidden')
    p.textContent = categories
    bookCard.append(p)
}

function showDescription(description, bookCard){
    const p = document.createElement('p')
    p.classList.add('description')
    p.classList.add('hidden')
    p.textContent = description
    bookCard.append(p)
}


function showImage(imageLink, bookCard){
    const image = document.createElement('img')
    image.classList.add('image')
    image.src = imageLink

    image.addEventListener('click', showMoreInfo)

    bookCard.append(image)
}

function showMoreInfo(event){
    const image = event.target
    const bookCard = event.target.parentNode
    
    image.classList.add('hidden')
    bookCard.classList.add('expand-card')
    bookCard.querySelector('.save-book-button').classList.add('hidden')
    bookCard.querySelector('.published-date').classList.remove('hidden')
    bookCard.querySelector('.categories').classList.remove('hidden')
    bookCard.querySelector('.description').classList.remove('hidden')
    
    const pageCount = bookCard.querySelector('.page-count')
    if (pageCount){
        pageCount.classList.remove('hidden')
    }
    addCollapseButton(image, bookCard)  
}

function addCollapseButton(image, bookCard){
    const collapseButton = document.createElement('button')
    collapseButton.type = 'button'
    collapseButton.textContent = 'Close'
    
    collapseButton.addEventListener('click', event => closePopupScreen(event, bookCard, image))

    bookCard.append(collapseButton)
}

function closePopupScreen(event, bookCard, image){
    event.target.remove()
    bookCard.classList.remove('expand-card')
    image.classList.remove('hidden')
    bookCard.querySelector('.save-book-button').classList.remove('hidden')
    bookCard.querySelector('.published-date').classList.add('hidden')
    bookCard.querySelector('.categories').classList.add('hidden')
    bookCard.querySelector('.description').classList.add('hidden')
    
    const pageCount = bookCard.querySelector('.page-count')
    if (pageCount){
        pageCount.classList.add('hidden')
    }
}

function saveButton(book, bookCard){
    const saveBookButton = document.createElement('button')
    saveBookButton.classList.add('save-book-button')
    saveBookButton.type = 'button'
    saveBookButton.innerHTML = `<i class="far fa-heart"></i>`
    saveBookButton.addEventListener('click', event => {
        saveBook(book, event)
    })
    bookCard.append(saveBookButton)
}

function saveBook(book, event){
    event.target.innerHTML = `<i class="fas fa-heart"></i>`
    
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
