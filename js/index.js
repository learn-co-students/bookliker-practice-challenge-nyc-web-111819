document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM successfully loaded")
    let bookList = document.getElementById("list")
    let showPanel = document.getElementById("show-panel")

    function getBooks () {
        fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                let bookLi = document.createElement("li")
                bookLi.id = book.id
                bookLi.classList.add("book-item")
                bookLi.innerHTML = `${book.title}`
                bookList.append(bookLi)
            })
        })
    }
    getBooks()

    bookList.addEventListener("click", (e) => {
        if (e.target.className === "book-item") {
            let bookShow = document.getElementsByClassName("book-show")[0]
            if (bookShow != undefined) {
                bookShow.remove()
            }
            fetch(`http://localhost:3000/books/${e.target.id}`)
            .then(response => response.json())
            .then(book => {
                let bookDiv = document.createElement("div")
                bookDiv.classList.add("book-show")
                bookDiv.id = book.id
                bookDiv.innerHTML = `
                    <h2>${book.title}</h2>
                    <img src="${book.img_url}">
                    <p>${book.description}</p>
                    <button id="read-book">Read Book</button>
                    <p>Users that like this book</p>
                `
                book.users.forEach((user) => {
                    let userLi = document.createElement("li")
                    userLi.innerText = `${user.username}`
                    bookDiv.append(userLi)
                })
                showPanel.append(bookDiv)
            })
        }
    })

    document.addEventListener("click", (e) => {
        if (e.target.id === "read-book") {
            let userLi = document.createElement("li")
            userLi.innerText = "pouros"
            e.target.parentNode.append(userLi)

            fetch(`http://localhost:3000/books/${e.target.parentNode.id}`)
            .then(response => response.json())
            .then(book => {
                fetch(`http://localhost:3000/books/${e.target.parentNode.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({users: book.users.concat({"id":1, "username":"pouros"})})
                })
            })
        }
    })

});
