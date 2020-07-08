const userName = localStorage.getItem('name')
const bookshelfTitle = document.querySelector('#bookshelf-title')
const searchBooksButton = document.querySelector('#search-books-button')
const logoutButton = document.querySelector('#logout-button')

logoutButton.addEventListener('click', logout)


bookshelfTitle.textContent = `${userName}'s Bookshelves`


function logout(){
    localStorage.clear()
    window.location = 'index.html'
}