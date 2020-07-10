const baseURL = 'http://localhost:3000' 
const usersURL = `${baseURL}/users`
const loginURL = `${baseURL}/login`

const loginForm = document.querySelector('.login-form')
const signupForm = document.querySelector('.signup-form')
const showSignupButton = document.querySelector('#show-signup')
const showLoginButton = document.querySelector('#show-login')

loginForm.addEventListener('submit', login)
signupForm.addEventListener('submit', signup)
showSignupButton.addEventListener('click', showSignup)
showLoginButton.addEventListener('click', showLogin)

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
        window.location = 'search.html'

    })
    .catch(error => {
        alert(error.message)
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
        window.location = 'search.html'
    })
    .catch(error => {
        alert(error.message)
    })
    
    event.target.reset()
}

function showSignup(){
    loginForm.classList.add('hidden')
    signupForm.classList.remove('hidden')
}

function showLogin(){
    loginForm.classList.remove('hidden')
    signupForm.classList.add('hidden')
}
