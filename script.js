// Scroll Bar & Back To Top Scripts

const body = document.body;
const html = document.documentElement;
const bodyHeight = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  html.clientHeight,
  html.scrollHeight,
  html.offsetHeight
);
let windowHeight = window.innerHeight;

// Selector for Progress Bar
const scrollBar = document.getElementById("progressBar");

// Selector for Back To Top
const backToTopButton = document.getElementById("backToTop");

const calculateCurrentScroll = () => {
  let currentUserPosition = window.pageYOffset;
  // If bodyHeight should be the 100% of the progressBar. Let´s calculate the percent based on the currentUserPosition
  let currentPercent =
    // I substract the windowHeight to the bodyHeight because otherwise the currentPercent would never reach the 100%
    (currentUserPosition * 100) / (bodyHeight - windowHeight);
  return currentPercent;
};

// Display progressBar based on the current scroll down percent
const progressBar = (currentPercent) => {
  scrollBar.style.width = currentPercent + "%";
};

// Display backToTop button if at the bottom of the page
const displayBackToTop = (currentPercent) => {
  if (currentPercent > 99) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};
const backToTop = () => {
  window.scroll(0, 0);
};

if (typeof window !== `undefined`) {
  window.addEventListener("scroll", () => {
    progressBar(calculateCurrentScroll());
  });
  window.addEventListener("scroll", () => {
    displayBackToTop(calculateCurrentScroll());
  });
  window.addEventListener("load", () => {
    progressBar(calculateCurrentScroll());
  });
  window.addEventListener("load", () => {
    displayBackToTop(calculateCurrentScroll());
  });
}

// When backToTop button clicked it sends us to top: 0 after a delay of 200ml
backToTopButton.addEventListener("click", function () {
  setTimeout(backToTop, 200);
});

// Form Validation & Testing scripts
const inputName = document.getElementById("name");
let isNameValid;

const validateName = () => {
  if (inputName.value.length <= 2 || inputName.value.length >= 100) {
    inputName.style.borderColor = "red";
    isNameValid = false;
  } else {
    inputName.style.borderColor = "#95989a";
    isNameValid = true;
  }
};
inputName.addEventListener("click", validateName);
inputName.addEventListener("keyup", validateName);

const inputEmail = document.getElementById("email");
let isEmailValid = false;
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmail = () => {
  if (!emailRegex.test(inputEmail.value) || inputEmail.value == "") {
    inputEmail.style.borderColor = "red";
    isEmailValid = false;
  } else {
    inputEmail.style.borderColor = "#95989a";
    isEmailValid = true;
  }
};
inputEmail.addEventListener("click", validateEmail);
inputEmail.addEventListener("keyup", validateEmail);

const inputCheckBox = document.querySelector("#checkbox");
let isCheckBoxValid = false;
inputCheckBox.addEventListener("change", () => {
  isCheckBoxValid = !isCheckBoxValid;
});

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", () => {
  if (isNameValid && isEmailValid && isCheckBoxValid) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        name: inputName.value,
        email: inputEmail.value,
        consentGiven: isCheckBoxValid,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  } else {
    window.alert(
      "Please fill out all required fields before sending your question!"
    );
  }
});

// Modal email testing and sending POST
const modal = document.getElementById("modal");
const emailModal = document.getElementById("emailModal");
const closeModal = document.getElementById("closeBtn");
let isEmailModalValid = false;

const validateModalEmail = () => {
  if (!emailRegex.test(emailModal.value) || emailModal.value == "") {
    emailModal.style.borderColor = "red";
    isEmailModalValid = false;
  } else {
    emailModal.style.borderColor = "#95989a";
    isEmailModalValid = true;
  }
};
emailModal.addEventListener("click", validateModalEmail);
emailModal.addEventListener("keyup", validateModalEmail);

// 3 ways to close the modal: by clicking on the X icon, by pressing the key ESC (keyCode = 27) and by clicking outside of the modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
// If the ESC key is pressed when the modal is opened... it will be closed
const closeKeyDispatcher = (e) => {
  if (e.keyCode == 27) {
    modal.style.display = "none";
  }
};
// The modal has width and height 100% but the modal__container is smaller. This means that if we click outside of the modal__container
// we are clicking the modal. Then userClick is equal to modal and the modal closes.
// If we would click the modal__container... userClick would NOT be equal to modal and then nothing would happen.
document.addEventListener("click", (e) => {
  let userClick = e.target;
  console.log(userClick);
  if (userClick == modal) {
    modal.style.display = "none";
  }
});

const openModal = () => {
  isModalCurrentlyOpened = true;
  wasModalAlreadyOpened = true;
  modal.style.display = "block";
};

let isModalCurrentlyOpened = false;
let wasModalAlreadyOpened = false;
// If scroll more than 25% AND the modal was not yet opened AND is not currently opened... it is displayed
window.addEventListener("scroll", () => {
  if (
    calculateCurrentScroll() > 25 &&
    !wasModalAlreadyOpened &&
    !isModalCurrentlyOpened
  ) {
    openModal();
    document.addEventListener("keydown", (e) => closeKeyDispatcher(e));
  }
});
// If the user did not scroll more than 25% and the modal was not yet opened and it is not currently opened... after 5s the modal is displayed
window.addEventListener("load", () => {
  setTimeout(() => {
    if (!wasModalAlreadyOpened && !isModalCurrentlyOpened) {
      openModal();
      document.addEventListener("keydown", (e) => closeKeyDispatcher(e));
    }
  }, 5000);
});

const modalSubmitBtn = document.getElementById("modalSubmitBtn");

// CHANGE THIS SO THAT THE FORM GETS SENT IF THE BOTTON IS CLICKED OR IF THE ENTER KEY IS PRESSED!!!

modalSubmitBtn.addEventListener("click", () => {
  if (isEmailModalValid) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        email: emailModal.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        modal.style.display = "none";
      });
  } else {
    window.alert("We need your E-Mail address to add you to our Newsletter!");
  }
});
