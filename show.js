const baseURL = 'http://localhost:3000' 
const bookshelvesURL = `${baseURL}/bookshelves`
const savedBooksURL = `${baseURL}/saved_books`

const userName = localStorage.getItem('name')
const bookshelfTitle = document.querySelector('#bookshelf-title')
const searchBooksButton = document.querySelector('#search-books-button')
const friendBooksButton = document.querySelector('#friend-books-button')
const logoutButton = document.querySelector('#logout-button')
const toReadList = document.querySelector('.to-read')
const readingList = document.querySelector('.reading')
const previouslyReadList = document.querySelector('.previously-read')

searchBooksButton.addEventListener('click', searchBooksPage)
friendBooksButton.addEventListener('click', friendBooksPage)
logoutButton.addEventListener('click', logout)


bookshelfTitle.textContent = `${userName}'s Bookshelves`

function searchBooksPage(){
    window.location = 'search.html'
}

function friendBooksPage(){
    window.location = 'friend.html'
}

function logout(){
    localStorage.clear()
    window.location = 'index.html'
}


fetch(bookshelvesURL, {
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
        // showPublishedDate(bookshelfItem.book.published_date, bookCard)
        // showPageCount(bookshelfItem.book.page_count, bookCard)
        // showCategories(bookshelfItem.book.categories, bookCard)
        // showDescription(bookshelfItem.book.description, bookCard)
        showImage(bookshelfItem.book.image_link, bookCard)
        deleteButton(bookshelfItem.id, bookCard)
        changeBookshelfButton(bookshelfItem.id, bookCard, listName)
        
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

// function showPublishedDate(publishedDate, bookCard){
//     const p = document.createElement('p')
//     p.classList.add('published-date')
//     p.textContent = `Published: ${publishedDate}`
//     bookCard.append(p)
// }

// function showPageCount(pageCount, bookCard){
//     if (pageCount != null){
//         const p = document.createElement('p')
//         p.classList.add('page-count')
//         p.textContent = `${pageCount} Pages`
//         bookCard.append(p)
//     }
// }

// function showCategories(categories, bookCard){
//     const p = document.createElement('p')
//     p.classList.add('categories')
//     p.textContent = categories
//     bookCard.append(p)
// }

// function showDescription(description, bookCard){
//     const p = document.createElement('p')
//     p.classList.add('description')
//     p.classList.add('hidden')
//     p.textContent = description
//     bookCard.append(p)
// }

function showImage(imageLink, bookCard){
    const image = document.createElement('img')
    image.classList.add('image')
    image.src = imageLink
    bookCard.append(image)
}

function deleteButton(id, bookCard){
    const deleteFromBookshelfButton = document.createElement('button')
    deleteFromBookshelfButton.type = 'button'
    deleteFromBookshelfButton.textContent = 'Delete'
    
    deleteFromBookshelfButton.addEventListener('click', () => deleteFromBookshelf(bookCard, id))
    
    bookCard.append(deleteFromBookshelfButton)
}

function deleteFromBookshelf(bookCard, id){
    bookCard.remove()
    fetch(`${savedBooksURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(console.log)
}

function changeBookshelfButton(id, bookCard, listName){
    if (listName === toReadList){
        addToReadingButton(id, bookCard)
        addToPreviouslyReadButton(id, bookCard)
    } else if (listName === readingList){
        addToToReadButton(id, bookCard)
        addToPreviouslyReadButton(id, bookCard)
    } else if (listName === previouslyReadList){
        addToToReadButton(id, bookCard)
        addToReadingButton(id, bookCard)
    }
}

function addToToReadButton(id, bookCard){
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = "To Read"

    button.addEventListener('click', () => moveToToRead(id, bookCard))

    bookCard.append(button)
}

function addToReadingButton(id, bookCard){
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = "Reading"
    
    button.addEventListener('click', () => moveToReading(id, bookCard))
    
    bookCard.append(button)
}

function addToPreviouslyReadButton(id, bookCard){
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = "Previously Read"
    
    button.addEventListener('click', () => moveToPreviouslyRead(id, bookCard))
    
    bookCard.append(button)
}

function moveToToRead(id, bookCard){
    bookCard.remove()
    toReadList.append(bookCard)
    
    fetch(`${savedBooksURL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({bookshelf: 1})
    })
    .then(response => response.json())
    .then(console.log)
}

function moveToReading(id, bookCard){
    bookCard.remove()
    readingList.append(bookCard)
    
    fetch(`${savedBooksURL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({bookshelf: 2})
    })
    .then(response => response.json())
    .then(console.log)
}

function moveToPreviouslyRead(id, bookCard){
    bookCard.remove()
    previouslyReadList.append(bookCard)

    fetch(`${savedBooksURL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({bookshelf: 3})
    })
    .then(response => response.json())
    .then(console.log)
}