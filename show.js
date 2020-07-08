const baseURL = 'http://localhost:3000' 
const bookshelvesURL = `${baseURL}/bookshelves`

const userName = localStorage.getItem('name')
const bookshelfTitle = document.querySelector('#bookshelf-title')
const searchBooksButton = document.querySelector('#search-books-button')
const logoutButton = document.querySelector('#logout-button')
const toReadList = document.querySelector('.to-read')
const readingList = document.querySelector('.reading')
const previouslyReadList = document.querySelector('.previously-read')

logoutButton.addEventListener('click', logout)
searchBooksButton.addEventListener('click', searchBooksPage)


bookshelfTitle.textContent = `${userName}'s Bookshelves`

function logout(){
    localStorage.clear()
    window.location = 'index.html'
}

function searchBooksPage(){
    window.location = 'search.html'
}

fetch(bookshelvesURL, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
    .then(response => response.json())
    .then(result => {
        renderBooks(result.to_read, toReadList)
        renderBooks(result.reading, readingList)
        renderBooks(result.previously_read, previouslyReadList)
    })

function renderBooks(bookshelfItems, listName){
    bookshelfItems.forEach(bookshelfItem => {
        const bookLi = document.createElement('li')
        bookLi.id = bookshelfItem.book.isbn_13
        const bookCard = document.createElement('div')
        
        showTitle(bookshelfItem.book.title, bookCard)
        showAuthors(bookshelfItem.book.authors, bookCard)
        showPublishedDate(bookshelfItem.book.published_date, bookCard)
        showPageCount(bookshelfItem.book.page_count, bookCard)
        showCategories(bookshelfItem.book.categories, bookCard)
        showDescription(bookshelfItem.book.description, bookCard)
        showImage(bookshelfItem.book.image_link, bookCard)
        deleteButton(bookshelfItem.id, bookCard)
        changeBookshelfButton(bookshelfItem.id, bookCard)
        
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
    p.textContent = `Authors: ${authors}`
    bookCard.append(p)
}

function showPublishedDate(publishedDate, bookCard){
    const p = document.createElement('p')
    p.classList.add('published-date')
    p.textContent = `Published: ${publishedDate}`
    bookCard.append(p)
}

function showPageCount(pageCount, bookCard){
    if (pageCount != null){
        const p = document.createElement('p')
        p.classList.add('page-count')
        p.textContent = `${pageCount} Pages`
        bookCard.append(p)
    }
}

function showCategories(categories, bookCard){
    const p = document.createElement('p')
    p.classList.add('categories')
    p.textContent = categories
    bookCard.append(p)
}

function showDescription(description, bookCard){
    const p = document.createElement('p')
    p.classList.add('description')
    p.textContent = description
    bookCard.append(p)
}


function showImage(imageLink, bookCard){
    const image = document.createElement('img')
    image.classList.add('image')
    image.src = imageLink
    bookCard.append(image)
}

function deleteButton(id, bookCard){

}

function changeBookshelfButton(id, bookCard){

}