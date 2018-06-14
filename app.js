(function() {
  const form = document.querySelector("#main-form");
  const input = document.querySelector("#todoInput");
  const todoList = document.querySelector("#todoList");
  const completedList = document.querySelector("#completed");

  // Todo search function setup---------------------------------------
  const searchListitem = document.querySelector("#searchListitem");
  searchListitem.addEventListener("keyup", searchList);
  searchListitem.addEventListener("blur", function() {
    this.value = "";
    Array.from(todoList.children).forEach(el => (el.style.display = "flex"));
  });

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxEUCqzLZJjIDUw-E_cF9mqusb9d_cDPw",
    authDomain: "todolist-6d9ba.firebaseapp.com",
    databaseURL: "https://todolist-6d9ba.firebaseio.com",
    projectId: "todolist-6d9ba",
    storageBucket: "todolist-6d9ba.appspot.com",
    messagingSenderId: "320355228892"
  };
  firebase.initializeApp(config);
  let current_user = "";
  firebase.auth().onAuthStateChanged(user => {
    // Checking that if user logged in
    // if logged in activate actions---------------------------------

    if (user) {
      // localStorage.setItem("tokenID", user._lat);
      current_user = user.uid;
      $(".email-holder").html(user.email);

      // Sign out process--------------------------------------------

      $("#signOut").on("click", e => {
        firebase
          .auth()
          .signOut()
          .then(e => {
            window.location.href = "index.html";
          });
      });

      // Send data to Firebase database----------------------------------

      form.addEventListener("submit", addTodoItem);

      // Function that sends data to firebase

      function addTodoItem(e) {
        const todoItem = input.value;

        // Set the date format---------------------------------------------

        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        newdate = day + "/" + month + "/" + year;

        e.preventDefault();
        if (todoItem === "") {
          $(
            `<div class="alert alert-danger mt-3" role="alert"> Please enter task name...</div>`
          ).insertAfter($(".section-logo"));
          const timer = setTimeout(e => {
            $(".alert-danger").hide();
          }, 3000);
          return false;
        }
        firebase
          .database()
          .ref()
          .child("users")
          .child(current_user)
          .child("todo")
          .push({
            completed: false,
            date: newdate,
            description: todoItem
          });
        form.reset();
      }

      // Retrieving data from firebase----------------------------------

      const todoRef = firebase
        .database()
        .ref()
        .child("users/" + current_user)
        .child("todo");
      todoRef.on("value", snap => {
        todoList.innerHTML = "";
        completedList.innerHTML = "";
        snap.forEach(item => {
          const desc = item.val().description;
          const itemKey = item.key;
          // checking completed todos, if true appending to
          // completedlist else appending to uncompleted list
          if (item.val().completed) {
            const completedTodos = createTodoItem(desc, itemKey);
            toggleTodoFirebase(completedTodos);
          } else {
            todoList.insertAdjacentElement(
              "afterBegin",
              createTodoItem(desc, itemKey)
            );
          }
        });
      });
      //-------------------------------------------------------------------------------
      // Delete from database ---------------------------------------------------------

      $("body").on("click", ".deleteBtn", function() {
        const key = this.getAttribute("data-key");
        firebase
          .database()
          .ref("users/" + current_user)
          .child("todo")
          .child(key)
          .remove();
      });
      //-------------------------------------------------------------------------------
      // Update checkbox state on database --------------------------------------------

      $("body").on("click", ".checkbox", function() {
        const key = this.getAttribute("data-key");
        toggleTodoFirebase(this.parentElement);
        const completed = this.parentElement.classList.contains("completed")
          ? true
          : false;

        firebase
          .database()
          .ref("users/" + current_user)
          .child("todo")
          .child(key)
          .child("completed")
          .set(completed);
      });

      //-------------------------------------------------------------------------------
      // Edit todoitem state on database ----------------------------------------------

      $("body").on("click", ".editBtn", function(e) {
        const key = this.getAttribute("data-key");
        editTodoItem(this);
        const newDesc = this.parentElement.parentElement.querySelector("label")
          .innerText;

        firebase
          .database()
          .ref("users/" + current_user)
          .child("todo")
          .child(key)
          .child("description")
          .set(newDesc);
      });
    }
  });
})();
