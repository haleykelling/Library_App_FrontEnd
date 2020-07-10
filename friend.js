const baseURL = 'http://localhost:3000' 
const friendsURL = `${baseURL}/friends`
const saveBookURL = `${baseURL}/save_book`


const searchBooksButton = document.querySelector('#search-books-button')
const myBookshelvesPageButton = document.querySelector('#my-bookshelves-button')
const logoutButton = document.querySelector('#logout-button')
const toReadList = document.querySelector('.to-read')
const readingList = document.querySelector('.reading')
const previouslyReadList = document.querySelector('.previously-read')

myBookshelvesPageButton.addEventListener('click', myBookshelvesPage)
searchBooksButton.addEventListener('click', searchBooksPage)
logoutButton.addEventListener('click', logout)


function logout(){
    localStorage.clear()
    window.location = 'index.html'
}

function myBookshelvesPage(){
    window.location = 'show.html'
}

function searchBooksPage(){
    window.location = 'search.html'
}

fetch(friendsURL, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
    .then(response => response.json())
    .then(result => {
        renderBooks(result.to_read, toReadList, 'to-read-card')
        renderBooks(result.reading, readingList, 'reading-card')
        renderBooks(result.previously_read, previouslyReadList, 'previously-read-card')
    })

function renderBooks(bookshelfItems, listName, className){
    bookshelfItems.forEach(bookshelfItem => {
        const bookLi = document.createElement('li')
        bookLi.id = bookshelfItem.book.isbn_13
        const bookCard = document.createElement('div')
        bookCard.classList.add(className)
        
        showTitle(bookshelfItem.book.title, bookCard)
        showAuthors(bookshelfItem.book.authors, bookCard)
        showPublishedDate(bookshelfItem.book.published_date, bookCard)
        showPageCount(bookshelfItem.book.page_count, bookCard)
        showCategories(bookshelfItem.book.categories, bookCard)
        showDescription(bookshelfItem.book.description, bookCard)
        showImage(bookshelfItem.book.image_link, bookCard)
        saveButton(bookshelfItem.book, bookCard)

        
        bookLi.append(bookCard)
        listName.append(bookLi)
    })
}

function showTitle(title, bookCard){
    const h3 = document.createElement('h3')
    h3.classList.add('book-title')
    h3.textContent = title 
    bookCard.append(h3)
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
}