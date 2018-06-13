$(document).ready(e => {
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

  $("#signUp").on("click", e => {
    const email = $("#email").val();
    const password = $("#password").val();
    const auth = firebase.auth();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(e => {
        auth.signInWithEmailAndPassword(email, password).then(e => {
          window.location.href = "../dashboard.html";
        });
      })
      .catch(function(error) {
        const errorMessage = error.message;
        $(`<div class="alert alert-danger" role="alert">
		  ${errorMessage}
		</div>`).insertBefore($("#error"));
        const timer = setTimeout(e => {
          $(".alert-danger").hide();
        }, 3000);
      });
  });
});
