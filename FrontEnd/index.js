//Data
const baseApiUrl = "http://localhost:5678/api/";
let worksData;
let categories;

//Elements
let filter;
let gallery;
let modal;
let modalStep = null;
let pictureInput;

// Fetch from API
window.onload = () => {
  fetch(`${baseApiUrl}works`)
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      //get list of categories
      listOfUniqueCategories();
      //display all works
      displayGallery(worksData);
      //Filter functionnality
      filter = document.querySelector(".filter");
      categoryFilter(categories, filter);
      //administrator mode
      adminUserMode(filter);
    });
};

/*Gallerie*/
function displayGallery(data) {
  gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  //show all works in array
  data.forEach((i) => {
    //create tags
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";
    //references to DOM
    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle);
  });
}

/*Filtre*/
function listOfUniqueCategories() {
  let listOfCategories = new Set();
  //get set of string categories
  worksData.forEach((work) => {
    listOfCategories.add(JSON.stringify(work.category));
  });
  //push stringified categories in array
  const arrayOfStrings = [...listOfCategories];
  //parse array to get objects back
  categories = arrayOfStrings.map((s) => JSON.parse(s));
}

//init filter buttons
function categoryFilter(categories, filter) {
  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filterButton";
  button.dataset.category = "Tous";
  filter.appendChild(button);
  filterButtons(categories, filter);
  functionFilter();
}

//create filter buttons
function filterButtons(categories, filter) {
  categories.forEach((categorie) => {
    createButtonFilter(categorie, filter);
  });
}

function createButtonFilter(categorie, filter) {
  const button = document.createElement("button");
  button.innerText = categorie.name;
  button.className = "filterButton";
  button.dataset.category = categorie.name;
  filter.appendChild(button);
}
