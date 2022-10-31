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

  scrollBar.style.width = currentPercent + "%";
};

const displayBackToTop = () => {
  let currentUserPosition = window.pageYOffset;
  // If bodyHeight should be the 100% of the progressBar. Let´s calculate the percent based on the currentUserPosition
  let currentPercent =
    // I substract the windowHeight to the bodyHeight because otherwise the currentPercent would never reach the 100%
    (currentUserPosition * 100) / (bodyHeight - windowHeight);

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
  window.addEventListener("scroll", calculateCurrentScroll);
  window.addEventListener("scroll", displayBackToTop);
  window.addEventListener("load", calculateCurrentScroll);
  window.addEventListener("load", displayBackToTop);
}

backToTopButton.addEventListener("click", backToTop);
