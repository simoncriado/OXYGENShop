// SCROLL BAR & BACK TO TOP SCRIPTS
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
  // If bodyHeight is equal to 100% of the progressBar. Let´s calculate the percent based on the currentUserPosition
  let currentPercent =
    // I substract the windowHeight to the bodyHeight because otherwise the currentPercent would never reach the 100%
    (currentUserPosition * 100) / (bodyHeight - windowHeight);
  return currentPercent;
};

// Display progressBar based on the current scroll down percent
const progressBar = (currentPercent) => {
  scrollBar.style.width = currentPercent + "%";
};

// Display backToTop button if the user is at the bottom of the page
const displayBackToTop = (currentPercent) => {
  if (currentPercent > 99) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};
// When clicked we get scrolled to the top of the page. Smoothly because of the rule I set in the reset.scss
const backToTop = () => {
  window.scroll(0, 0);
};
// When backToTop button clicked it sends us to top: 0 after a delay of 200ml
backToTopButton.addEventListener("click", function () {
  setTimeout(backToTop, 200);
});

// I faced this issue before where I wasn´t able to upload the page to Netlify without this if-check
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

// FORM VALIDATION & TESTING SCRIPTS
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

// MODAL EMAIL TESTING & SENDING POST
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
  if (userClick == modal) {
    modal.style.display = "none";
  }
});

const openModal = () => {
  isModalCurrentlyOpened = true;
  localStorage.setItem("wasModalAlreadyOpened", "true");
  modal.style.display = "block";
};

let isModalCurrentlyOpened = false;
// If scroll more than 25% AND the modal was not yet opened AND is not currently opened... it is displayed
window.addEventListener("scroll", () => {
  if (
    calculateCurrentScroll() > 25 &&
    localStorage.getItem("wasModalAlreadyOpened") !== "true" &&
    !isModalCurrentlyOpened
  ) {
    openModal();
    // Here I activate the eventListener for closing the modal when pressing ESC
    document.addEventListener("keydown", (e) => closeKeyDispatcher(e));
  }
});
// If the user did not scroll more than 25% and the modal was not yet opened and it is not currently opened... after 5s the modal is displayed
window.addEventListener("load", () => {
  setTimeout(() => {
    if (
      localStorage.getItem("wasModalAlreadyOpened") !== "true" &&
      !isModalCurrentlyOpened
    ) {
      openModal();
      document.addEventListener("keydown", (e) => closeKeyDispatcher(e));
    }
  }, 5000);
});

const modalSubmitBtn = document.getElementById("modalSubmitBtn");

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

// CURRENCY CONVERTER SCRIPTS
// Targeting the buttons
const btnUSD = document.getElementById("usd");
const btnEUR = document.getElementById("eur");
const btnGBP = document.getElementById("gbp");

// Targeting the values to change
const priceToChangeOne = document.getElementById("priceToChangeOne");
const priceToChangeTwo = document.getElementById("priceToChangeTwo");
const priceToChangeThree = document.getElementById("priceToChangeThree");

const changeCurrencyInHTML = async (currency) => {
  // Getting which is the currently displayed currency in the HTML
  let currentCurrency;
  if (priceToChangeOne.innerText.includes("$")) {
    currentCurrency = "usd";
  } else if (priceToChangeOne.innerText.includes("€")) {
    currentCurrency = "eur";
  } else {
    currentCurrency = "gbp";
  }
  // Getting which is the new currency based on the user click
  let newCurrency = currency;
  // If the user clicks on USD
  if (newCurrency == "usd.json") {
    // Change from EUR to USD
    if (currentCurrency == "eur") {
      // Getting the exchange rate from EUR to USD, getting the current displayed value in the HTML and multiplying it by the exchange rate
      const eurToUsd = await changeCurrency("eur/usd.json");
      priceToChangeOne.innerText =
        "$ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToUsd.usd
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "$ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToUsd.usd
        ).toFixed(2);
      priceToChangeThree.innerText =
        "$ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToUsd.usd
        ).toFixed(2);
      // Change from GBP to USD
    } else if (currentCurrency == "gbp") {
      const gbpToUsd = await changeCurrency("gbp/usd.json");
      priceToChangeOne.innerText =
        "$ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToUsd.usd
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "$ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToUsd.usd
        ).toFixed(2);
      priceToChangeThree.innerText =
        "$ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToUsd.usd
        ).toFixed(2);
    }
    // If the user clicks on EUR
  } else if (newCurrency == "eur.json") {
    // Change from USD to EUR
    if (currentCurrency == "usd") {
      const usdToEur = await changeCurrency("usd/eur.json");
      priceToChangeOne.innerText =
        "€ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToEur.eur
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "€ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToEur.eur
        ).toFixed(2);
      priceToChangeThree.innerText =
        "€ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToEur.eur
        ).toFixed(2);
      // Change from GBP to EUR
    } else if (currentCurrency == "gbp") {
      const gbpToEur = await changeCurrency("gbp/eur.json");
      priceToChangeOne.innerText =
        "€ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToEur.eur
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "€ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToEur.eur
        ).toFixed(2);
      priceToChangeThree.innerText =
        "€ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          gbpToEur.eur
        ).toFixed(2);
    }
    // If the user clicks on GBP
  } else {
    // Change from USD to GBP
    if (currentCurrency == "usd") {
      const usdToGbp = await changeCurrency("usd/gbp.json");
      priceToChangeOne.innerText =
        "£ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToGbp.gbp
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "£ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToGbp.gbp
        ).toFixed(2);
      priceToChangeThree.innerText =
        "£ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          usdToGbp.gbp
        ).toFixed(2);
      // Change from EUR to GBP
    } else if (currentCurrency == "eur") {
      const eurToGbp = await changeCurrency("eur/gbp.json");
      priceToChangeOne.innerText =
        "£ " +
        (
          parseFloat(priceToChangeOne.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToGbp.gbp
        ).toFixed(2);
      priceToChangeTwo.innerText =
        "£ " +
        (
          parseFloat(priceToChangeTwo.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToGbp.gbp
        ).toFixed(2);
      priceToChangeThree.innerText =
        "£ " +
        (
          parseFloat(priceToChangeThree.innerText.replace(/[^0-9\.-]+/g, "")) *
          eurToGbp.gbp
        ).toFixed(2);
    }
  }
};

// Fetching the exchange rate based on: what currency is currently displayed in the HTML and the currency that the user clicked
const changeCurrency = async (currency) => {
  const baseURL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";
  const urlToFetch = baseURL + currency;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch (error) {
    console.log(error);
  }
};

// Checking if the currency that the user clicks is not the currently selected one
btnUSD.addEventListener("click", () => {
  if (!btnUSD.classList.contains("active")) {
    btnUSD.classList.add("active");
    btnEUR.classList.remove("active");
    btnGBP.classList.remove("active");
    changeCurrencyInHTML("usd.json");
  }
});
btnEUR.addEventListener("click", () => {
  if (!btnEUR.classList.contains("active")) {
    btnUSD.classList.remove("active");
    btnEUR.classList.add("active");
    btnGBP.classList.remove("active");
    changeCurrencyInHTML("eur.json");
  }
});
btnGBP.addEventListener("click", () => {
  if (!btnGBP.classList.contains("active")) {
    btnUSD.classList.remove("active");
    btnEUR.classList.remove("active");
    btnGBP.classList.add("active");
    changeCurrencyInHTML("gbp.json");
  }
});
