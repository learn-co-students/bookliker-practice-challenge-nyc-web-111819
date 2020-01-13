let baseUrl = `http://localhost:3000/books/`
let currentUser = {
  "id": 2,
  "username": "auer"
}


function getBooks(url){
  fetch(url)
  .then(resp => resp.json())
  .then(books => {
    books.forEach(function(book) {
      renderBook(book)
    })
  })
}

function renderBook(book){
  let li = document.createElement('li')
  li.innerText = book.title
  li.dataset.id = book.id
  let ul = document.getElementById('list')
  ul.appendChild(li)
  // ul.append(li)
}

function getOneBook(url) {
  fetch(url)
  .then(response => response.json())
  .then(function(book){
    renderDetails(book)
  })
}

function renderDetails(book){
  // console.log('Rendering a book', book)
  let showPanel = document.getElementById('show-panel')
  showPanel.dataset.id = book.id
  showPanel.innerHTML = `
    <img src="${book.img_url}" >
    <h3>${book.title}</h3>
    <p>${book.description}</p>
    <p>Users that like this book:</p>
  `
  showPanel.appendChild(renderUsersDiv(book.users))
}

function renderUsersDiv(users){
  let showPanel = document.getElementById('show-panel')
  let usersDiv = document.createElement('div')
  usersDiv.id = "users-div"
  let ul = document.createElement('ul')
  renderUsers(users, ul)
  usersDiv.appendChild(ul)

  let currentUserLike = getCurrentUserLike(users)

  //render button
  let button = document.createElement('BUTTON')
  button.id = "like-button"
  currentUserLike ? button.innerText = "Unlike" : button.innerText = "Like" 
  usersDiv.appendChild(button)

  //button event listener
  // button = document.getElementById('like-button')
  button.addEventListener('click', function(event){
    likesHandler(users)
  })
  return usersDiv
}

function renderUsers(users, ul){
  users.forEach (function(user){
    let li = document.createElement('li')
    li.innerText = user.username
    ul.appendChild(li)
  })
}

function getCurrentUserLike(users){
  // test if book.users include currentUser
  if (users.find(user => user.id === currentUser.id)) {
    return true
  } else {
    return false
  }
}

function likesHandler(users){
  let showPanel = document.getElementById('show-panel')
  //set update object for body
  let updatedUserListObj = { 
    users: [...users]
  }
  let updatedUsers = updatedUserListObj.users
  if (getCurrentUserLike(users) === true){
  // remove user from users
    updatedUsers.splice(updatedUsers.findIndex(function(user){
      return currentUser.id === user.id 
    }),1 )
  } else {
  // add user to users
    updatedUsers.push(currentUser)
  }
  
  //clear ul for show
  document.getElementById('users-div').remove()
  showPanel.appendChild(renderUsersDiv(updatedUsers))

  //fetch patch
  fetch(baseUrl + showPanel.dataset.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accepts: "application/json"
    },
    body: JSON.stringify(updatedUserListObj)
  })
}

document.addEventListener("DOMContentLoaded", function() {
  let ul = document.getElementById('list')
  
  getBooks(baseUrl)

  ul.addEventListener('click', function(event){
    let id = event.target.dataset.id
    getOneBook(baseUrl + id)
  })
});
