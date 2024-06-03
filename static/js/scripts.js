// variables

var ClassList = [
  { id: 1, name: "Juji-tsu" },
  { id: 2, name: "Judo" },
  { id: 3, name: "Karate" },
  { id: 4, name: "Muay Thai" },
  { id: 5, name: "Kids Jujitsu" },
  { id: 6, name: "Kids Judo" },
  { id: 7, name: "Kids Karate" },
  { id: 8, name: "Private Tuitions" },
  { id: 9, name: "Open Mat" },
  { id: 10, name: "Personal Practice" },
  { id: 11, name: "Six-week beginners' self-defence course" },
  { id: 12, name: "Use of fitness room - per visit" },
  { id: 13, name: "Personal fitness training - per hour" },
];

var MembershipPlans = [
  {
    id: 1,
    name: "Basic",
    price: "£ 25/month",
    limit: 1,
  },
  {
    id: 2,
    name: "Intermediate",
    price: "£ 35/month",
    limit: 1,
  },
  {
    id: 3,
    name: "Advanced",
    price: "£ 45/month",
    limit: 2,
  },
  {
    id: 4,
    name: "Elite",
    price: "£ 60/month",
    limit: 1000,
  },
  {
    id: 5,
    name: "Private Tuition",
    price: "£ 15/hour",
    limit: 1000,
  },
  {
    id: 6,
    name: "Junior Membership",
    price: "£ 25/month",
    limit: 1000,
  },
];

// forms
const enrollClassForm = document.getElementById("enroll-class-form");
const unrollClassForm = document.getElementById("unroll-class-form");
const contactForm = document.getElementById("contact-us-form");
// show div
const enrolledClassesListDiv = document.getElementById("enrolled-classes-list");

// select
const unrolledClassesSelect = document.getElementById("unroll-class-selected");
const enrolledClassesSelect = document.getElementById("enroll-class-selected");

const membershipSelect = document.getElementById("membership-selected");
const selectedMembershipDiv = document.getElementById("selected-membership");
const membershipInfoDiv = document.getElementById("membership-info");

(function () {
  emailjs.init("PCBhIP4lY0EsFBR7A");
})();

function sendEmail(event) {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const email = formData.get("contact-email");
  const message = formData.get("contact-message");

  const templateParams = {
    to_email: email,
    message: message,
  };
  emailjs.send("service_dq5l9at", "template_m8jdwp7", templateParams).then(
    (response) => {
      alert("Message sent successfully!");
      contactForm.reset();
    },
    (error) => {
      alert("Failed to send the message. Please try again.");
    }
  );
}

function contactFormListener() {
  try {
    if (contactForm) {
      contactForm.addEventListener("submit", sendEmail);
    }
  } catch (error) {
    console.error(error);
  }
}

function renderSelect() {
  try {
    enrolledClassesSelect.innerHTML = "";
    unrolledClassesSelect.innerHTML = "";

    const classes =
      JSON.parse(localStorage.getItem("leftClasses")) || ClassList;
    classes.forEach((classObj) => {
      const newOption = document.createElement("option");
      newOption.value = classObj.id;
      newOption.textContent = classObj.name;
      enrolledClassesSelect.appendChild(newOption);
    });

    const savedClassList =
      JSON.parse(localStorage.getItem("savedClasses")) || [];
    savedClassList.forEach((classObj) => {
      const newOption = document.createElement("option");
      newOption.value = classObj.id;
      newOption.textContent = classObj.name;
      unrolledClassesSelect.appendChild(newOption);
    });

    const membershipPlan = JSON.parse(
      localStorage.getItem("selectedMembershipPlan")
    );
    if (membershipPlan) {
      membershipInfoDiv.innerHTML = `
      <b>Current Plan: ${membershipPlan.name}</b><br>
      <b>Price: ${membershipPlan.price}</b><br>
      <b>Enrolled Classes: ${savedClassList.length}</b><br>
      <b>Classes Limit: ${
        membershipPlan.limit == 1000 ? "Infinity" : membershipPlan.limit
      }</b>
    `;
    } else {
      membershipInfoDiv.innerHTML = "<p>No membership plan selected.</p>";
    }
  } catch (error) {
    console.error(error);
  }
}

function showEnrolledClass() {
  try {
    enrolledClassesListDiv.innerHTML = "";
    const classes = localStorage.getItem("savedClasses");
    if (classes) {
      const classesArray = JSON.parse(classes);
      classesArray.forEach((classObj) => {
        const newParagraph = document.createElement("li");
        newParagraph.textContent = classObj.name;
        enrolledClassesListDiv.appendChild(newParagraph);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function onload() {
  if (localStorage.getItem("savedClasses") == null) {
    localStorage.setItem("savedClasses", JSON.stringify([]));
  }
  if (localStorage.getItem("leftClasses") == null) {
    localStorage.setItem("leftClasses", JSON.stringify(ClassList));
  }
}

function renderMembershipPlans() {
  try {
    membershipSelect.innerHTML = "";
    MembershipPlans.forEach((plan) => {
      const newOption = document.createElement("option");
      newOption.value = plan.id;
      newOption.textContent = `${plan.name} - ${plan.price}`;
      membershipSelect.appendChild(newOption);
    });
  } catch (error) {
    console.error(error);
  }
}

function selectMembershipListener() {
  try {
    const membershipForm = document.getElementById("membership-form");
    membershipForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(membershipForm);
      const selectedPlanId = formData.get("membership-selected");
      const selectedPlan = MembershipPlans.find(
        (plan) => plan.id === parseInt(selectedPlanId)
      );
      localStorage.setItem(
        "selectedMembershipPlan",
        JSON.stringify(selectedPlan)
      );
      renderSelect();
    });
  } catch (error) {
    console.error(error);
  }
}

function enroll(object) {
  // Get the data from localStorage
  const classes = JSON.parse(localStorage.getItem("savedClasses")) || [];
  const membershipPlan = JSON.parse(
    localStorage.getItem("selectedMembershipPlan")
  );

  // check the plan
  if (!membershipPlan) {
    alert("Please select a membership plan before enrolling in classes.");
    return;
  }
  // check the plan limit per enroll class
  const currentPlanLimit = membershipPlan.limit;
  if (classes.length >= currentPlanLimit && membershipPlan.limit != Infinity) {
    alert(
      `You have reached the maximum number of enrollments for the ${membershipPlan.name} plan.`
    );
    return;
  }

  const localLeftClasses =
    JSON.parse(localStorage.getItem("leftClasses")) || ClassList;
  const leftClasses = localLeftClasses.filter((item) => item.id !== object.id);
  const savedClasses = [...classes, object];

  // Update the localStorage with the new lists
  localStorage.setItem("savedClasses", JSON.stringify(savedClasses));
  localStorage.setItem("leftClasses", JSON.stringify(leftClasses));
  // Update the UI
  showEnrolledClass();
  renderSelect();
}

function unroll(object) {
  // Get the current saved classes from localStorage
  const savedClasses = JSON.parse(localStorage.getItem("savedClasses"));
  // Remove the class from the saved classes
  const updatedSavedClasses = savedClasses.filter(
    (item) => item.id !== object.id
  );
  // Get the left classes from localStorage
  const localLeftClasses =
    JSON.parse(localStorage.getItem("leftClasses")) || ClassList;
  // Add the unrolled class back to the left classes
  const updatedLeftClasses = [...localLeftClasses, object];
  // Update the localStorage with the new lists
  localStorage.setItem("savedClasses", JSON.stringify(updatedSavedClasses));
  localStorage.setItem("leftClasses", JSON.stringify(updatedLeftClasses));
  // Update the UI
  showEnrolledClass();
  renderSelect();
}

function enrollClassListener() {
  try {
    enrollClassForm.addEventListener("submit", (event) => {
      // Prevent the form from submitting in the default way
      event.preventDefault();
      // Get the form data
      var formData = new FormData(enrollClassForm);
      // Get the value of the enroll-class-selected field
      var selectedClass = formData.get("enroll-class-selected");
      // get the name of value from selected
      const selectedObject = ClassList.find(
        (classObj) => classObj.id === parseInt(selectedClass)
      );
      enroll(selectedObject);
    });
  } catch (error) {
    console.error(error);
  }
}

function unrollClassListener() {
  try {
    unrollClassForm.addEventListener("submit", (event) => {
      // Prevent the form from submitting in the default way
      event.preventDefault();
      // Get the form data
      var formData = new FormData(unrollClassForm);
      // Get the value of the unroll-class-selected field
      var selectedClass = formData.get("unroll-class-selected");
      // get the name of value from selected
      const selectedObject = ClassList.find(
        (classObj) => classObj.id === parseInt(selectedClass)
      );
      unroll(selectedObject);
    });
  } catch (error) {
    console.error(error);
  }
}

function register() {
  var name = document.getElementById("InputName").value.trim();
  var email = document.getElementById("InputEmail").value.trim();
  var password = document.getElementById("InputPassword").value.trim();
  var password2 = document.getElementById("InputPassword2").value.trim();
  // validation
  if (!name || !email || !password || !password2) {
    alert("All fields are required.");
    return;
  }
  if (password !== password2) {
    alert("Passwords do not match.");
    return;
  }
  // add in local storage
  var userData = {
    name: name,
    email: email,
    password: password,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  window.location.href = "../dashboard.html";
}

function login() {
  var email = document.getElementById("InputEmail").value.trim();
  var password = document.getElementById("InputPassword").value.trim();
  // validation
  if (!email || !password) {
    alert("All fields are required.");
    return;
  }
  // add in local storage
  var storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    var userData = JSON.parse(storedUserData);
    if (userData.email === email && userData.password === password) {
      console.log("Login successful");
      window.location.href = "../dashboard.html";
    } else {
      alert("Invalid email or password.");
    }
  } else {
    alert("No user found. Please register.");
  }
}

function logout() {
  localStorage.removeItem("userData");
  window.location.href = "../index.html";
}

function scrollSectionsListener() {
  // Smooth scroll for links within the same page
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            }
          );
        }
      }
    });

  // Smooth scroll to the target section if the URL contains a hash on page load
  if (window.location.hash) {
    var hash = window.location.hash;
    var target = $(hash);
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 100,
        },
        1000,
        function () {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr("tabindex", "-1");
            $target.focus();
          }
        }
      );
    }
  }
}

function scrollBoxListener() {
  var sections = $(".section");
  var currentSectionIndex = 0;

  $("#scrollToSectionBtn").on("click", function () {
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
    // check if the current is the last section
    if (currentSectionIndex == sections.length - 1) {
      $(".scroll-icon").addClass("rotate-oppsite");
    } else {
      $(".scroll-icon").removeClass("rotate-oppsite");
    }
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
}

function checkUserState() {
  // Check if user data exists in local storage
  var userData = localStorage.getItem("userData");
  if (userData) {
    $(".navbar-nav .nav-item:last-child .nav-link").removeClass("disabled");
    $("#dashboard-footer-url").removeClass("disabled-link");
    $("#logout-btn-group").removeClass("hidden");
    $("#auth-btn-group").addClass("hidden");
    // Parse user data from localStorage
    var parsedUserData = JSON.parse(userData);
    // Set the username
    $(".usernameShown").html("");
    $("#usernameShown").html(parsedUserData.name);
  } else {
    // disable the dashboard a tags or urls if not login yet
    $("#dashboard-footer-url").addClass("disabled-link");
  }
}

function navbarState() {
  // Add "active" class to the current navbar item based on the path
  var path = window.location.pathname;
  $(".navbar-nav .nav-link").each(function () {
    if ($(this).attr("href") === path) {
      $(this).addClass("active");
    }
  });
}

function autoType() {
  const exampleText = ["DoBu Martial Arts"];
  const exampleTyping = new AutoTyping("#text-auto-type", exampleText, {
    typeSpeed: 50,
    deleteSpeed: 50,
    waitBeforeDelete: 2000,
    waitBetweenWords: 500,
  });
  exampleTyping.start();
}

function authEventListeners() {
  // register event listener
  $("#register-form").on("submit", function (e) {
    e.preventDefault();
    register();
  });
  // login event listener
  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    login();
  });
}

$(document).ready(function () {
  onload();
  autoType();
  // State checking
  checkUserState();
  navbarState();

  // display
  showEnrolledClass();
  renderSelect();
  renderMembershipPlans();
  selectMembershipListener();

  // event listeners
  authEventListeners();
  contactFormListener();
  scrollSectionsListener();
  scrollBoxListener();
  enrollClassListener();
  unrollClassListener();
});
