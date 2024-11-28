// // // const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";
// // const accessKey = "sdvUZ3PwhViapWTchPPa7byTZlgB7MqG4FX2-izWBho";

const accessKey = "sdvUZ3PwhViapWTchPPa7byTZlgB7MqG4FX2-izWBho";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".grid");
const showMoreButtonEl = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

// Initialize Masonry
let msnry = new Masonry(searchResultsEl, {
  itemSelector: ".grid-item",
  gutter: 10,
  fitWidth: true,
});

// Wait for images to load before updating Masonry layout
function waitForImagesToLoad(container) {
  return new Promise((resolve) => {
    const imgLoad = imagesLoaded(container);
    imgLoad.on("done", () => resolve());
    imgLoad.on("fail", () => resolve()); // Proceed even if some images fail to load
  });
}

async function searchImages() {
  try {
    inputData = searchInputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch images");

    const data = await response.json();

    if (page === 1) {
      searchResultsEl.innerHTML = "";
      msnry.destroy(); // Destroy the current Masonry instance if resetting the grid
      msnry = new Masonry(searchResultsEl, {
        itemSelector: ".grid-item",
        gutter: 10,
        fitWidth: true,
      });
    }

    const results = data.results;

    results.forEach((result) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("grid-item");
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description;

      imageWrapper.appendChild(image);
      searchResultsEl.appendChild(imageWrapper);
    });

    // Wait for all images to load before updating Masonry layout
    await waitForImagesToLoad(searchResultsEl);
    msnry.reloadItems();
    msnry.layout();

    page++;

    if (page > 1) {
      showMoreButtonEl.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching images:", error.message);
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  searchImages();
});
