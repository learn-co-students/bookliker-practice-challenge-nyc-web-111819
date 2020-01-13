document.addEventListener("DOMContentLoaded", function() {

  let list = document.getElementById('list')
  let show = document.getElementById('show-panel')
  
  function listBooks(book) {
    let li = document.createElement('li')
    let br = document.createElement('br')
    li.className = 'book_title'
    li.innerHTML = book.title
    li.dataset.id = book.id
    list.append(li)
    list.append(br)
  }

  function fetchBooks(){
    fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(books => {
      books.forEach(listBooks)
    })
    .catch(error => {
      alert(error.message)
    })
  }

  fetchBooks()

  function addLiked(id, users) {
    fetch(`http://localhost:3000/books/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        accepts: "application/json"
      },
      body: JSON.stringify(users)
    })
    .then(response => response.json())
    .then(book => {
      while (show.hasChildNodes()) {  
        show.removeChild(show.firstChild);
      }
      bookInfo(book)
    })
    .catch(error => {
      alert(error.message)
    })
  }

  function likeButton(book) {
    let liked = document.getElementById('button')
    liked.addEventListener('click', function(){
      let id = book.id
      let users = book.users
      if (event.target.innerHTML === "Unlike 💔") {
        users = users.filter(user => user.id != 1)
      } else {
        users.push({"id":1, "username":"pouros"})
      }
      addLiked(id, {"users": users})
    })
  }

  function bookInfo(book) {
    while (show.hasChildNodes()) {  
      show.removeChild(show.firstChild);
    }
    let image = document.createElement('img')
    let description = document.createElement('p')
    let ul = document.createElement('ul')
    let text = document.createElement('h4')
    let button = document.createElement('button')
    image.src = `${book.img_url}`
    description.innerHTML = book.description
    text.innerHTML = 'Users who have liked this book:'
    if (book.users.find(user => user.id === 1)) {
      button.innerHTML = "Unlike 💔"
    } else {
      button.innerHTML = "Like ❤️"
    }
    button.id = 'button'
    show.append(image)
    show.append(description)
    show.append(button)
    show.append(text)
    book.users.forEach(user => {
      let li = document.createElement('li')
      li.innerHTML = user.username
      ul.append(li)
    })
    show.append(ul)
    likeButton(book)
  }

  function fetchBook(id){
    fetch(`http://localhost:3000/books/${id}`)
    .then(response => response.json())
    .then(book => {
      bookInfo(book)
    })
    .catch(error => {
      alert(error.message)
    })
  }

  list.addEventListener('click', function(){
    if (event.target.className === 'book_title') {
      let id = event.target.dataset.id
      fetchBook(id)
    }
  })


});
