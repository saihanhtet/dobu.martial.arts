function register() {
  var name = document.getElementById("InputName").value;
  var email = document.getElementById("InputEmail").value;
  var password = document.getElementById("InputPassword").value;
  var passwor2 = document.getElementById("InputPassword2").value;

  if (password === passwor2) {
    // Save registration data to local storage
    var userData = {
      name: name,
      email: email,
      password: password,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("Register successful");
    window.location.href = "../dashboard.html";
  } else {
    console.error("Passwords do not match");
  }
}

function login() {
  var email = document.getElementById("InputEmail").value;
  var password = document.getElementById("InputPassword").value;

  // name list
  const namelist = [
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
  ];
  // generate random name
  var randomName = namelist[Math.floor(Math.random() * namelist.length)];

  if (password != "" && email != "") {
    // Save registration data to local storage
    var userData = {
      name: randomName,
      email: email,
      password: password,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log("Register successful");
    window.location.href = "../dashboard.html";
  } else {
    console.error("Passwords do not match");
  }
}

function logout() {
  localStorage.removeItem("userData");
  window.location.href = "../index.html";
}

$(document).ready(function () {
  // Check if user data exists in local storage
  var userData = localStorage.getItem("userData");
  if (userData) {
    $(".navbar-nav .nav-item:last-child .nav-link").removeClass("disabled");
    $("#logout-btn-group").removeClass("hidden");
    $("#auth-btn-group").addClass("hidden");
    // Parse user data from localStorage
    var parsedUserData = JSON.parse(userData);
    // Set the username
    $("#usernameShown").html(parsedUserData.name);
  }

  $("#register-form").on("submit", function (e) {
    e.preventDefault();
    register();
  });

  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    login();
  });

  // Add "active" class to the current navbar item based on the path
  var path = window.location.pathname;
  $(".navbar-nav .nav-link").each(function () {
    if ($(this).attr("href") === path) {
      $(this).addClass("active");
    }
  });

  // Scroll to the next section when the button is clicked
  var sections = $(".section");
  var currentSectionIndex = 0;

  $("#scrollToSectionBtn").on("click", function () {
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
    // replace the scroll box into welcome section
    if (currentSectionIndex == 0) {
      $(".scroll-box").removeClass("move");
    } else {
      $(".scroll-box").addClass("move");
    }
    var nextSection = $(sections[currentSectionIndex]);

    $("html, body").animate(
      {
        scrollTop: nextSection.offset().top - 100,
      },
      "slow"
    );
  });
});
