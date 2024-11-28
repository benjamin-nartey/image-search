// const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";
// // // const accessKey = "sdvUZ3PwhViapWTchPPa7byTZlgB7MqG4FX2-izWBho";

const accessKey = "sdvUZ3PwhViapWTchPPa7byTZlgB7MqG4FX2-izWBho";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".grid");
const showMoreButtonEl = document.getElementById("show-more-button");

let page = 1; // Track the current page for pagination
let currentQuery = ""; // Track the current search query
let isSearchMode = false; // Track whether the user is searching or not

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

// Fetch images from the appropriate endpoint
async function fetchImages() {
  const baseUrl = isSearchMode
    ? `https://api.unsplash.com/search/photos?page=${page}&query=${currentQuery}`
    : `https://api.unsplash.com/photos?page=${page}`;
  const url = `${baseUrl}&client_id=${accessKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch images");

  const data = await response.json();
  return isSearchMode ? data.results : data; // Handle response structure for both endpoints
}

// Render images and update Masonry
async function renderImages(images) {
  images.forEach((image) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("grid-item");
    const img = document.createElement("img");
    img.src = image.urls.small;
    img.alt = image.alt_description;

    imageWrapper.appendChild(img);
    searchResultsEl.appendChild(imageWrapper);
  });

  // Wait for all images to load before updating Masonry layout
  await waitForImagesToLoad(searchResultsEl);
  msnry.reloadItems();
  msnry.layout();
}

// Fetch and render images on app mount or "Show More" button click
async function loadImages() {
  try {
    const images = await fetchImages();
    await renderImages(images);
    page++;
    showMoreButtonEl.style.display = "block"; // Show "Show More" button
  } catch (error) {
    console.error("Error loading images:", error.message);
  }
}

// Reset grid and Masonry layout
function resetGrid() {
  searchResultsEl.innerHTML = "";
  msnry.destroy();
  msnry = new Masonry(searchResultsEl, {
    itemSelector: ".grid-item",
    gutter: 10,
    fitWidth: true,
  });
}

// Handle form submission for search
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInputEl.value.trim();

  if (query) {
    currentQuery = query;
    isSearchMode = true;
    page = 1; // Reset page for new search
    resetGrid();
    loadImages();
  }
});

// Handle "Show More" button click
showMoreButtonEl.addEventListener("click", () => {
  loadImages();
});

// Fetch images on page mount from /photos
window.addEventListener("DOMContentLoaded", () => {
  isSearchMode = false; // Default to non-search mode
  loadImages();
});
