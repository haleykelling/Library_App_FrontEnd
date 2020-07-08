const baseURL = 'http://localhost:3000' 
const usersURL = `${baseURL}/users`
const loginURL = `${baseURL}/login`
const bookSearchURL = `${baseURL}/book_search`
const saveBookURL = `${baseURL}/save_book`

const errorMessage = document.querySelector('#error-message')
const loginForm = document.querySelector('.login-form')
const signupForm = document.querySelector('.signup-form')
const showSignupButton = document.querySelector('#show-signup')
const savedBooksButton = document.querySelector('#saved-books-button')
const logoutButton = document.querySelector('#logout-button')
const bookList = document.querySelector('.book-list')

loginForm.addEventListener('submit', login)
signupForm.addEventListener('submit', signup)
showSignupButton.addEventListener('click', showSignup)
logoutButton.addEventListener('click', logout)
savedBooksButton.addEventListener('click', savedBooksPage)

function login(event){
    event.preventDefault()

    const formData = new FormData(event.target)
    const loginData = {
        username: formData.get('username'), 
        password: formData.get('password')
    }
    
    fetch(loginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok){
            return response.json().then(parsedResponse => {
                throw new Error(parsedResponse.error)
            })
        }
        return response.json()
    })
    .then(result => {
        localStorage.setItem('token', result.token)
        localStorage.setItem('name', result.name)
        errorMessage.textContent = ""
        hideLogin()
        showLogoutButton()
        showSavedBooksButton()
        bookList.classList.remove('hidden')

    })
    .catch(error => {
        errorMessage.textContent = error.message
    })
    
    event.target.reset()
}

function signup(event){
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const signupData = {
        username: formData.get('username'), 
        first_name: formData.get('first-name'),
        last_name: formData.get('last-name'),
        password: formData.get('password')
    }
    
    fetch(usersURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => {
        if (!response.ok){
            return response.json().then(parsedResponse => {
                throw new Error(parsedResponse.error)
            })
        }
        return response.json()
    })
    .then(result => {
        const token = result.token
        localStorage.setItem('token', token)
        errorMessage.textContent = ""
        hideSignup()
        showLogoutButton()
        showSavedBooksButton()
        bookList.classList.remove('hidden')
    })
    .catch(error => {
        errorMessage.textContent = error.message
    })
    
    event.target.reset()
}

function logout(){
    localStorage.clear()
    bookList.classList.add('hidden')
    showLogin()
    hideLogoutButton()
    hideSavedBooksButton()
}

function showSignup(){
    loginForm.classList.add('hidden')
    signupForm.classList.remove('hidden')
}

function hideSignup(){
    signupForm.classList.add('hidden')
}

function showLogin(){
    loginForm.classList.remove('hidden')
    signupForm.classList.add('hidden')
}

function hideLogin(){
    loginForm.classList.add('hidden')
}

function showLogoutButton(){
    logoutButton.classList.remove('hidden')
}

function hideLogoutButton(){
    logoutButton.classList.add('hidden')
}

function showSavedBooksButton(){
    savedBooksButton.classList.remove('hidden')
}

function hideSavedBooksButton(){
    savedBooksButton.classList.add('hidden')
}

function savedBooksPage(){
    window.location = 'show.html'
}

fetch(`${bookSearchURL}?search="Good Summer Reads 2020"`)
    .then(response => response.json())
    .then(result => {
        renderBooks(result.data.attributes.book_search_results)
    })

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
    
    //event listener here, pass book object
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
