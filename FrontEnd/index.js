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
