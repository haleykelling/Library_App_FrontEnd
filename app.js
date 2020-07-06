const baseURL = 'http://localhost:3000' 
const usersURL = `${baseURL}/users`
const loginURL = `${baseURL}/login`

const loginForm = document.querySelector('.login-form')
const signupForm = document.querySelector('.signup-form')
const showSignupButton = document.querySelector('#show-signup')

loginForm.addEventListener('submit', login)
signupForm.addEventListener('submit', signup)
showSignupButton.addEventListener('click', showSignup)

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
    .then(response => response.json())
    .then(console.log)

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
    .then(response => response.json())
    .then(console.log)
    
    event.target.reset()
}

function showSignup(){
    loginForm.classList.add('hidden')
    signupForm.classList.remove('hidden')
}