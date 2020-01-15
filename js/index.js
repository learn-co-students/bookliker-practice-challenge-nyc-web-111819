document.addEventListener("DOMContentLoaded", function() {

    function fetchBooks(){
        fetch("http://localhost:3000/books")
        .then(response => {return response.json()
        })
        .then(booksData => {booksData.forEach(book => {
                renderBook(book)
            });
        })

    } // end of fetchBooks func

    const listPanelDiv = document.getElementById("list-panel")
    let ul = document.createElement('ul')

    function renderBook(book) {
      
        let li = document.createElement('li')
        li.innerText = book.title
        li.dataset.id = book.id
        ul.appendChild(li)
        listPanelDiv.appendChild(ul)
    } // end of renderBook func

    fetchBooks()

    const showPanelDiv = document.getElementById("show-panel")
    let likeButton = document.createElement('button')

    ul.addEventListener("click", function(e){
        fetch(`http://localhost:3000/books/${e.target.dataset.id}`)
        .then(response => {return response.json()
        })
        .then(book => {
            let title = document.createElement('h2')
            let image = document.createElement('img')
            let description = document.createElement('p')
            let userList = document.createElement('ul')
            let userListHeading = document.createElement('h4')
    
            title.innerText = `${book.title}`
            image.src = `${book.img_url}`
            description.innerText = `${book.description}`
            likeButton.innerText = 'Like This Book'
            likeButton.dataset.id = book.id
            userListHeading.innerText = 'Users Who Liked This Book'

            book.users.map(user => {
                let userLi = document.createElement('li')
                userLi.innerText = user.username
                userList.appendChild(userLi)
            })

    
            while (showPanelDiv.hasChildNodes()) {
                showPanelDiv.removeChild(showPanelDiv.firstChild)
                }
    
            showPanelDiv.appendChild(title)
            showPanelDiv.appendChild(image)
            showPanelDiv.appendChild(description)
            showPanelDiv.appendChild(likeButton)
            showPanelDiv.appendChild(userListHeading)
            showPanelDiv.appendChild(userList)
        })
    })


    
    likeButton.addEventListener("click", function(e){
        let currentUser = {"id":1, "username":"pouros"}

        fetch(`http://localhost:3000/books/${e.target.dataset.id}`)
        .then(response => response.json())
        .then(book => {
            fetch(`http://localhost:3000/books/${e.target.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            body: JSON.stringify({users: book.users.concat(currentUser)})
        })
        })

    }) // end of like function
    
}) // end of main function
