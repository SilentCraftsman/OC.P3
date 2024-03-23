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

// FETCH works data from API and display it
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

//*******GALLERY*******

// Créer la galerie
function displayGallery(data) {
  gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  let idCounter = 1; // Initialisation du compteur d'ID

  data.forEach((i) => {
    // Créer les éléments de la galerie avec des ID uniques
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");

    // Attribution de l'ID unique à chaque élément
    const imageId = `Image${idCounter++}`;
    workCard.id = imageId;

    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";

    // Ajouter les éléments à la galerie
    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle);
  });
}

// ********** FILTER ***********//

//get list of categories in array as unique objects
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

// Gallery filter
function functionFilter() {
  const filterButtons = document.querySelectorAll(".filterButton");
  //identify wich filter button has been clicked
  filterButtons.forEach((i) => {
    i.addEventListener("click", function () {
      toggleProjects(i.dataset.category);
    });
  });
}

//if button "tous" active, display all projects, else display only those with same dataset category
function toggleProjects(datasetCategory) {
  const figures = document.querySelectorAll(".workCard");
  if (datasetCategory === "Tous") {
    figures.forEach((figure) => {
      figure.style.display = "block";
    });
  } else {
    figures.forEach((figure) => {
      if (figure.dataset.category === datasetCategory) {
        figure.style.display = "block";
      } else {
        figure.style.display = "none";
      }
    });
  }
}

//********ADMIN MODE******//

function adminUserMode() {
  //display admin mode if token is found and has the expected length
  if (sessionStorage.getItem("token")?.length == 143) {
    //Hide filter
    document.querySelector(".filter").style.display = "none";
    //change login to logout
    document.getElementById("logBtn").innerText = "logout";
    //display top menu bar
    const body = document.querySelector("body");
    const topMenu = document.createElement("div");
    const editMode = document.createElement("p");

    topMenu.className = "topMenu";
    editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;

    body.insertAdjacentElement("afterbegin", topMenu);
    topMenu.append(editMode);
    //edit buttons
    const editBtn = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
    document
      .querySelector("#portfolio h2")
      .insertAdjacentHTML("afterend", editBtn);
    //event listener modal
    document.querySelector("#portfolio p").addEventListener("click", openModal);
    const divModif = document.querySelector(".topMenu p");
    divModif.addEventListener("click", openModal);
  }
}

// Code pour la déconnexion
document.getElementById("logBtn").addEventListener("click", () => {
  // Effacer le token de session
  sessionStorage.removeItem("token");
  // Supprimer les éléments du mode admin directement
  const topMenu = document.querySelector(".topMenu");
  if (topMenu) {
    topMenu.remove();
  }
  const editBtn = document.querySelector(".editBtn");
  if (editBtn) {
    editBtn.remove();
  }
});

//*********MODAL*******//

//open modal if token is found and has the expected length
const openModal = function () {
  if (sessionStorage.getItem("token")?.length == 143) {
    modal = document.querySelector(".modal");
    modal.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);
    modalStep = 0;
    // close modal listener
    modal.addEventListener("click", closeModal);
    // DELETE button listener
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};

//close modal
const closeModal = function (e) {
  if (
    e.target === document.querySelector(".modal") ||
    e.target === document.getElementsByClassName("fa-xmark")[modalStep]
  ) {
    document.querySelector(".modal").style.display = "none";
    document.removeEventListener("click", closeModal);
    document.removeEventListener("click", deleteBtn);
    modalStep = null;
  }
};

//*************DELETE***************/

//display modal gallery function
function modalGallery(data) {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";
  //show all works in array
  data.forEach((i) => {
    //create elements
    const miniWork = document.createElement("figure");
    const workImage = document.createElement("img");
    const trashCan = document.createElement("i");
    //trashcan ID is work ID
    trashCan.id = i.id;
    trashCan.classList.add("fa-solid", "fa-trash-can");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    miniWork.className = "miniWork";
    miniWork.id = "vignette" + i.id;
    //references to DOM
    modalContent.appendChild(miniWork);
    miniWork.append(workImage, trashCan);
  });
}

//DELETE work event listener handler
const deleteBtn = function (e) {
  e.preventDefault();
  //clicked button
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

//API call for DELETE route
function deleteWork(i) {
  // Authentifier l'utilisateur et envoyer la réponse API
  let token = sessionStorage.getItem("token");
  fetch(baseApiUrl + "works/" + i, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // Si la réponse est positive, mettre à jour la galerie d'œuvres
      if (response.ok) {
        // Supprimer l'œuvre du tableau worksData
        worksData = worksData.filter((work) => work.id != i);
        // Supprimer l'élément correspondant dans la galerie principale
        const galleryItem = document.getElementById("Image" + i);
        console.log("Gallery Item:", galleryItem); // Afficher galleryItem dans la console
        if (galleryItem) {
          galleryItem.remove();
        }
        // Afficher les galeries mises à jour
        // displayGallery(worksData); // Ne pas mettre à jour toute la galerie ici
        // Supprimer l'élément correspondant dans la fenêtre modale
        const vignette = document.getElementById("vignette" + i);
        console.log("Vignette:", vignette); // Afficher vignette dans la console
        if (vignette) {
          vignette.remove();
        }
      } else {
        alert("Erreur : " + response.status);
        closeModal(); // Assurez-vous que c'est bien closeModal() pour appeler la fonction
      }
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

//*************ADD WORK***************/

//display add work form
const openNewWorkForm = function (e) {
  if (e.target === document.querySelector("#addPictureBtn")) {
    modalStep = 1;
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#picturePreview").style.display = "none";
    document.querySelector("#valider").style.backgroundColor = "#A7A7A7";
    document.getElementById("addPictureForm").reset();
    //<select> categories list
    selectCategoryForm();
    //display preview
    pictureInput = document.querySelector("#photo");
    pictureInput.onchange = picturePreview;
    //events
    document.querySelector("#addPictureForm").onchange = changeSubmitBtnColor;
    document.addEventListener("click", closeModal);
    document
      .querySelector(".modalHeader .fa-arrow-left")
      .addEventListener("click", openModal);
    document.removeEventListener("click", openNewWorkForm);
    document.removeEventListener("click", deleteBtn);
    document.addEventListener("click", newWorkFormSubmit);
  }
};

//preview picture in form
const picturePreview = function () {
  const [file] = pictureInput.files;
  const errorMessage = document.querySelector("#errMess");
  const submitButton = document.querySelector("#valider");
  const submitErrorDiv = document.querySelector("#submitError");

  if (file) {
    // Supprimer le message d'erreur existant s'il y en a un
    if (errorMessage) {
      errorMessage.remove();
    }

    if (file.size > 4000000) {
      // Réinitialiser la valeur de l'élément d'entrée du fichier pour vider la mémoire cache de l'image précédente
      pictureInput.value = "";
      // Vérifier si la taille du fichier dépasse 4 millions d'octets
      const newErrorMessage = document.createElement("div");
      newErrorMessage.id = "errMess";
      newErrorMessage.textContent = "La taille de l'image dépasse 4 Mo !";
      newErrorMessage.style.color = "red";
      newErrorMessage.style.margin = "0 auto";
      document
        .querySelector("#labelPhoto")
        .parentNode.insertBefore(
          newErrorMessage,
          document.querySelector("#labelPhoto").nextSibling
        );

      // Masquer le message d'erreur après 2 secondes
      setTimeout(() => {
        newErrorMessage.style.display = "none";
      }, 2000);

      // Désactiver le bouton de validation du formulaire
      submitButton.disabled = true;

      // Afficher un message d'erreur au-dessus du bouton de validation
      if (!submitErrorDiv) {
        const newSubmitErrorDiv = document.createElement("div");
        newSubmitErrorDiv.id = "submitError";
        newSubmitErrorDiv.textContent =
          "Impossible de valider le formulaire. Taille de l'image trop grande.";
        newSubmitErrorDiv.style.color = "red";
        newSubmitErrorDiv.style.marginTop = "10px";
        submitButton.parentNode.insertBefore(newSubmitErrorDiv, submitButton);

        // Masquer le message d'erreur après 5 secondes
        setTimeout(() => {
          newSubmitErrorDiv.style.display = "none";
        }, 5000);
      }

      return; // Arrêter l'exécution de la fonction si la taille dépasse la limite
    } else {
      // Masquer le message d'erreur s'il existe
      if (errorMessage) {
        errorMessage.style.display = "none";
      }

      // Activer le bouton de validation du formulaire
      submitButton.disabled = false;

      // Supprimer le message d'erreur au-dessus du bouton de validation s'il existe
      if (submitErrorDiv) {
        submitErrorDiv.remove();
      }
    }

    document.querySelector("#picturePreviewImg").src =
      URL.createObjectURL(file);
    document.querySelector("#picturePreview").style.display = "flex";
    document.querySelector("#labelPhoto").style.display = "none";
  }
};

//category options for form
const selectCategoryForm = function () {
  //reset categories
  document.querySelector("#selectCategory").innerHTML = "";
  //empty first option
  option = document.createElement("option");
  document.querySelector("#selectCategory").appendChild(option);
  //options from categories array
  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector("#selectCategory").appendChild(option);
  });
};

//submit work form event listener
const newWorkFormSubmit = function (e) {
  if (e.target === document.querySelector("#valider")) {
    e.preventDefault();
    postNewWork();
  }
};

//POST new work
function postNewWork() {
  let token = sessionStorage.getItem("token");
  const select = document.getElementById("selectCategory");
  //get data from form
  const title = document.getElementById("title").value;
  const categoryName = select.options[select.selectedIndex].innerText;
  const categoryId = select.options[select.selectedIndex].id;
  const image = document.getElementById("photo").files[0];
  //check form validity
  let validity = formValidation(image, title, categoryId);
  if (validity === true) {
    //create FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    // send collected data to API
    sendNewData(token, formData, title, categoryName);
  }
}

//change submit button color if all fields are filled
const changeSubmitBtnColor = function () {
  const select = document.getElementById("selectCategory");
  if (
    document.getElementById("title").value !== "" &&
    document.getElementById("photo").files[0] !== undefined &&
    select.options[select.selectedIndex].id !== ""
  ) {
    document.querySelector("#valider").style.backgroundColor = "#1D6154";
  }
};

//form validation
const formValidation = function (image, title, categoryId) {
  if (image == undefined) {
    alert("Veuillez ajouter une image");
    return false;
  }
  if (title.trim().length == 0) {
    alert("Veuillez ajouter un titre");
    return false;
  }
  if (categoryId == "") {
    alert("Veuillez choisir une catégorie");
    return false;
  } else {
    return true;
  }
};

//add new work in worksData array for dynamic display using API response
const addToWorksData = function (data, categoryName) {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = { id: data.categoryId, name: categoryName };
  newWork.imageUrl = data.imageUrl;
  worksData.push(newWork);
};

//API call for new work
function sendNewData(token, formData, title, categoryName) {
  fetch(`${baseApiUrl}works`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Nouveau fichier envoyé avec succés : " + title);
        return response.json();
      } else {
        console.error("Erreur:", response.status);
      }
    })
    .then((data) => {
      addToWorksData(data, categoryName);
      displayGallery(worksData);
      document.querySelector(".modal").style.display = "none";
      document.removeEventListener("click", closeModal);
      modalStep = null;
    })
    .catch((error) => console.error("Erreur:", error));
}
