/*
Const declarations are as follows:
sections: Describes the pages that are targeted by the navbar
gradients: Describes the color values of each section
bubble: Describes the colored div used for animation
optionsMain: Threshold used for primary animation
optionsSide: Threshold used for supplementary animation effects
*/

const sections = document.querySelectorAll("section");

const gradients = [
  // "linear-gradient(to right top, #f46b45, #eea849)",
  // "linear-gradient(to right top, #005c97, #363795)",
  // "linear-gradient(to right top, #e53935, #e35d5b)",
  "linear-gradient(315deg, #ffac81 0%, #ff928b 74%)",
  "linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)",
  "linear-gradient(315deg, #96c8fb 0%, #ddbdfc 74%)",
];
const bubble = document.querySelector(".bubble");

const optionsMain = {
  threshold: 0.6,
};

const optionsSide = {
  threshold: 0.4,
};

/*
Tell an observer to look at HTML sections
@param {Object} observer - An intersection observer object
*/
function observeSections(observer) {
  sections.forEach((section) => {
    observer.observe(section);
  });
}

/*
Unpack, obtain, and repack useful information from a HTML element
@param {Object} coords -- contains the size of an element and its position relative to the viewport
*/
function getDirections(coords) {
  const directions = {
    height: coords.height,
    width: coords.width,
    top: coords.top,
    left: coords.left,
  };

  return directions;
}

/*
Moves a HTML element given a set of coordinates
@param {Object} directions -- contains useful information regarding target location
*/
function moveBubble(directions) {
  bubble.style.setProperty("left", `${directions.left - 10}px`);
  bubble.style.setProperty("top", `${directions.top - 10}px`);
  bubble.style.setProperty("width", `${directions.width + 20}px`);
  bubble.style.setProperty("height", `${directions.height + 20}px`);
}

/*
Moves the bubble element to the section of the navbar corresponding to page currently being viewed
Also changes the color of the text underneath bubble
@param {Array} entries -- IntersectionObserver arrary of obsered objects
*/
function bubbleAnimation(entries) {
  entries.forEach((entry) => {
    const className = entry.target.className;
    const activeAnchor = document.querySelector(`[data-page=${className}]`);
    const gradientIndex = entry.target.getAttribute("data-index");
    const coords = activeAnchor.getBoundingClientRect();
    const directions = getDirections(coords);
    if (entry.isIntersecting) {
      currentAnchor = entry;
      console.log(currentAnchor.target.className);
      moveBubble(directions);
      bubble.style.background = gradients[gradientIndex];
      activeAnchor.style.color = "white";
    }
  });
}

/*
Supplements the primary animation by changing the color of the text previously covered by bubble to its default value
@param {Array} entries -- IntersectionObserver arrary of obsered objects
*/
function bubbleText(entries) {
  entries.forEach((entry) => {
    const className = entry.target.className;
    const activeAnchor = document.querySelector(`[data-page=${className}]`);
    if (!entry.isIntersecting) {
      activeAnchor.style.color = "black";
    }
  });
}

/*
Allows for bubble to behave reponsively despite being given an absolute position
*/
function bubbleResize() {
  try {
    const className = currentAnchor.target.className;
    const activeAnchor = document.querySelector(`[data-page=${className}]`);
    const coords = activeAnchor.getBoundingClientRect();
    const directions = getDirections(coords);
    if (currentAnchor.isIntersecting) {
      moveBubble(directions);
    }
  } catch (error) {
    console.log("Damn");
  }
}

/*
Stops relevant observers from altering elements once a media query is met
@param {Object} x -- contains information regarding specicifed media query
*/
function mediaQuery(mediaObject) {
  if (mediaObject.matches) {
    console.log("media met");
    observerMain.disconnect();
    observerSide.disconnect();
    try {
      const className = currentAnchor.target.className;
      const activeAnchor = document.querySelector(`[data-page=${className}]`);
      activeAnchor.style.color = "black"; // bug when starting from mobile and going up to desktop
    } catch (error) {
      sections[0].style.color = "black";
    }
  } else {
    observeSections(observerMain);
    observeSections(observerSide);
  }
}

/*
Code block used to remove transitions on resize
Prevents bubble from seemingly 'lagging behind' resize
*/
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

let currentAnchor = "";
let mediaObject = window.matchMedia("(max-width: 768px");
let observerMain = new IntersectionObserver(bubbleAnimation, optionsMain);
let observerSide = new IntersectionObserver(bubbleText, optionsSide);
observeSections(observerMain);
observeSections(observerSide);

mediaQuery(mediaObject);
mediaObject.addListener(mediaQuery);
window.addEventListener("resize", bubbleResize);
