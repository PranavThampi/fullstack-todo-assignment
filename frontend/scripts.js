let loggedIn = false
let token = ''

function signUp() {
    const mainDiv = document.getElementById('main-div')
    mainDiv.innerHTML = ''

    const formDiv = userForm("signup")
    mainDiv.appendChild(formDiv)
}

function signIn() {
    const mainDiv = document.getElementById('main-div')
    mainDiv.innerHTML = ''

    const formDiv = userForm("signin")
    mainDiv.appendChild(formDiv)
}

function userForm(type) {
    const formDiv = document.createElement("div")
    formDiv.setAttribute("class", "flex flex-col items-center w-full pt-8")
    
    const h1 = document.createElement("h1");
    h1.innerHTML = `${type === 'signup' ? "Sign Up" : "Sign in"} to Todos`
    h1.setAttribute("class", "text-2xl font-extrabold merriweather-sans pb-4")
    formDiv.appendChild(h1)

    const nameInput = document.createElement("input")
    nameInput.setAttribute("type", "text")
    nameInput.setAttribute("name", "username")
    nameInput.setAttribute("placeholder", "Username")
    nameInput.setAttribute("id", `${type}Username`)
    nameInput.setAttribute("class", "rounded-md border-0 bg-gradient-to-tr from-fuchsia-300 to-indigo-400 px-3.5 py-2 shadow-sm focus:ring focus:outline-none focus:ring-fuchsia-500 placeholder:italic text-center placeholder:text-white mb-4 w-1/3")
    formDiv.appendChild(nameInput)

    const passwordInput = document.createElement("input")
    passwordInput.setAttribute("type", "password")
    passwordInput.setAttribute("name", "password")
    passwordInput.setAttribute("placeholder", "Password")
    passwordInput.setAttribute("id", `${type}Password`)
    passwordInput.setAttribute("class", "rounded-md border-0 bg-gradient-to-tr from-fuchsia-300 to-indigo-400 px-3.5 py-2 shadow-sm focus:ring focus:outline-none focus:ring-fuchsia-500 placeholder:italic text-center placeholder:text-white mb-4 w-1/3 ")
    formDiv.appendChild(passwordInput)

    const button = document.createElement("button")
    button.setAttribute("onclick", `${type === 'signup' ? "signUp" : "signIn"}User()`)
    button.setAttribute("class", "merriweather-sans text-white bg-gradient-to-tr from-fuchsia-500 to-indigo-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-fuchsia-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2")
    button.innerHTML = type === 'signup' ? "Sign Up" : "Sign in"
    formDiv.appendChild(button)

    return formDiv
}

function signUpUser() {
    const username = document.getElementById("signupUsername").value
    const password = document.getElementById("signupPassword").value

    try {
        const res = axios.post('/signup', {
            username: username,
            password: password
        })
    
        if (res.statusText == 'OK') {
            alert('Account created!')
            signIn()
        }
        else(
            alert(res.status)
        )
    }
    catch (err) {
        alert(err)
    }

}

function signInUser() {
    const username = document.getElementById("signupUsername").value
    const password = document.getElementById("signupPassword").value

    try {
        const res = axios.post('/signin', {
            username: username,
            password: password
        })
    
        if (res.statusText == 'OK') {
            token = res.data.token
            localStorage.setItem('token', token)
            loggedIn = true
            alert('You have logged in!')
            todosLayout()
        }
        else(
            alert(res.status)
        )
    }
    catch (err) {
        alert(err)
    }

}

function checkLoggedIn() {
    token = localStorage.getItem('token')

    if (token) {
        todosLayout()
    }
}
checkLoggedIn()

function logOutUser() {
    token = ''
    loggedIn = false
    localStorage.clear()
}

function todosLayout() {

}