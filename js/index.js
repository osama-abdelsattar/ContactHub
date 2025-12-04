// Global Variables
var addContactBtn = document.querySelector(".navbar-nav .btn"),
  closeContactPageBtn = document.querySelector("#closeContactPageBtn"),
  addContactPage = document.querySelector("#addContactOverlay"),
  contactName = document.querySelector(".form #name"),
  contactPhone = document.querySelector(".form #phoneNumber"),
  contactEmail = document.querySelector(".form #email"),
  contactAddress = document.querySelector(".form #address"),
  contactGroup = document.querySelector(".form #group"),
  contactNotes = document.querySelector(".form #notes"),
  contactFavorite = document.querySelector(".form #favorite"),
  contactEmergency = document.querySelector(".form #urgent"),
  searchInput = document.querySelector("#search"),
  allInputs = document.querySelectorAll(
    ".form-field input:not([type='checkbox']), .form-field textarea"
  ),
  saveContactBtn = document.querySelector("#saveContact"),
  updateContactBtn = document.querySelector("#updateContact"),
  cancelBtn = document.querySelector("#cancel"),
  noContacts = document.querySelector("#noContacts"),
  totalContacts = document.querySelectorAll(".totalContacts"),
  contactsRow = document.querySelector("#contactsRow"),
  favoritesRow = document.querySelector("#favoritesRow"),
  emergencyRow = document.querySelector("#emergencyRow"),
  noFavorites = document.querySelector("#noFavorites"),
  favoriteContacts = document.querySelector("#favoriteContacts"),
  noEmergency = document.querySelector("#noEmergency"),
  emergencyContacts = document.querySelector("#emergencyContacts"),
  contactList = [],
  favoritesList = [],
  emergencyList = [],
  contactId = 0,
  regex = {
    name: /^[a-zA-Z -]{2,50}$/,
    phoneNumber: /^(\+201|201|01)[0125][0-9]{8}$/,
    email: /^(|[a-zA-Z][\w+-.]+@[\w.-]+\.[a-z]{2,})$/i,
    address: /^[\w\. ]{0,100}$/,
    notes: /^[\w\. ]{0,255}$/,
  };

// When user clicks on (+ Add contact) btn
addContactBtn.addEventListener("click", function () {
  addContactPage.classList.remove("d-none");
  saveContactBtn.classList.remove("d-none");
  updateContactBtn.classList.add("d-none");
});

// When user clicks on (X) btn in the overlay
closeContactPageBtn.addEventListener("click", function () {
  addContactPage.classList.add("d-none");
  clearValues();
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove("is-invalid");
  }
});

// When user clicks on (Cancel) btn in the overlay
cancelBtn.addEventListener("click", function () {
  addContactPage.classList.add("d-none");
  clearValues();
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove("is-invalid");
  }
});

// When user clicks on (Save contact) btn in the overlay
saveContactBtn.addEventListener("click", function () {
  addContact();
});
// Create
function addContact() {
  for (var i = 0; i < allInputs.length; i++) {
    validateInputs(allInputs[i]);
  }
  if (!contactName.classList.contains("is-invalid")) {
    if (!contactPhone.classList.contains("is-invalid")) {
      for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].phone == contactPhone.value) {
          Swal.fire({
            icon: "error",
            title: "Duplicate Phone Number",
            text: `
              A contact with this phone number already exists: ${contactList[i].name}
            `,
          });
          return;
        }
      }
      contactList.push({
        id: ++contactId,
        name: contactName.value,
        phone: contactPhone.value,
        email: contactEmail.value,
        address: contactAddress.value,
        group: contactGroup.value,
        notes: contactNotes.value,
        favorites: contactFavorite.checked,
        emergency: contactEmergency.checked,
        bg: randomBg(),
      });
      if (contactList.at(-1).favorites && contactList.at(-1).emergency) {
        addToCategory(favoritesList, contactList.length - 1);
        addToCategory(emergencyList, contactList.length - 1);
      } else if (contactList.at(-1).favorites) {
        addToCategory(favoritesList, contactList.length - 1);
      } else if (contactList.at(-1).emergency) {
        addToCategory(emergencyList, contactList.length - 1);
      }
      storeLists();
      addContactPage.classList.add("d-none");
      displayContacts();
      if (searchInput.value !== "") {
        searchContacts();
      }
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Contact has been added successfully!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (contactPhone.value == "") {
      Swal.fire({
        icon: "error",
        title: "Missing Phone",
        text: "Please enter a phone number!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid phone number (Ex. 01234567891)",
      });
    }
  } else if (contactName.value == "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
  }
  clearValues();
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove("is-invalid");
  }
}

// Store
function storeLists() {
  localStorage.setItem("Contacts", JSON.stringify(contactList));
  localStorage.setItem("Favorites", JSON.stringify(favoritesList));
  localStorage.setItem("Emergency", JSON.stringify(emergencyList));
}
function addToCategory(list, contactIndex) {
  list.push({
    id: contactList[contactIndex].id,
    name: contactList[contactIndex].name,
    phone: contactList[contactIndex].phone,
  });
}
function removeFromCategory(list, contactIndex) {
  for (var i = 0; i < list.length; i++) {
    if (contactList[contactIndex].id === list[i].id) {
      list.splice(i, 1);
      break;
    }
  }
}

// Clear
function clearValues() {
  contactName.value = "";
  contactPhone.value = "";
  contactEmail.value = "";
  contactAddress.value = "";
  contactGroup.value = "";
  contactNotes.value = "";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
}

// Display stored items if exist
if (
  localStorage.getItem("Contacts") &&
  localStorage.getItem("Contacts") != "[]"
) {
  contactId = JSON.parse(localStorage.getItem("Contacts")).at(-1).id;
  displayContacts();
  if (searchInput.value !== "") {
    searchContacts();
  }
}
// Read
function displayContacts() {
  contactList = JSON.parse(localStorage.getItem("Contacts"));
  contactsRow.innerHTML = ``;
  if (contactList.length == 0) {
    noContacts.classList.remove("d-none");
  } else {
    noContacts.classList.add("d-none");
  }
  for (var i = 0; i < contactList.length; i++) {
    insertContact(i);
  }
  for (var i = 0; i < totalContacts.length; i++) {
    totalContacts[i].innerHTML = contactList.length;
  }
  displayFavorites();
  displayEmergency();
}
function displayFavorites() {
  var favoritesCards = "";
  favoritesList = JSON.parse(localStorage.getItem("Favorites"));
  favoritesRow.innerHTML = ``;
  if (favoritesList.length == 0) {
    noFavorites.classList.remove("d-none");
  } else {
    noFavorites.classList.add("d-none");
  }
  for (var i = 0; i < favoritesList.length; i++) {
    favoritesCards += `
      <a
        href="tel:${favoritesList[i].phone}"
        class="d-flex align-items-center gap-1 gap-xl-2 link-dark text-decoration-none mini-card border rounded-3 p-2"
      >
        <div class="icon in-center bg-rose-pink to-br">
          <span class="text-uppercase fs-6 fw-semibold">
            ${favoritesList[i].name.charAt(0)}
          </span>
        </div>
        <div class="text d-flex flex-column me-auto">
          <span class="fw-medium">${favoritesList[i].name}</span>
          <span class="text-gray-400">${favoritesList[i].phone}</span>
        </div>
        <div class="action in-center">
          <i class="fas fa-phone fa-xs"></i>
        </div>
      </a>
    `;
  }
  favoritesRow.innerHTML = favoritesCards;
  favoriteContacts.innerHTML = favoritesList.length;
}
function displayEmergency() {
  var emergencyCards = "";
  emergencyList = JSON.parse(localStorage.getItem("Emergency"));
  emergencyRow.innerHTML = ``;
  if (emergencyList.length == 0) {
    noEmergency.classList.remove("d-none");
  } else {
    noEmergency.classList.add("d-none");
  }
  for (var i = 0; i < emergencyList.length; i++) {
    emergencyCards += `
      <a
        href="tel:${emergencyList[i].phone}"
        class="d-flex align-items-center gap-1 gap-xl-2 link-dark text-decoration-none mini-card border rounded-3 p-2"
      >
        <div class="icon in-center bg-rose-pink to-br">
          <span class="text-uppercase fs-6 fw-semibold">
            ${emergencyList[i].name.charAt(0)}
          </span>
        </div>
        <div class="text d-flex flex-column me-auto">
          <span class="fw-medium">${emergencyList[i].name}</span>
          <span class="text-gray-400">${emergencyList[i].phone}</span>
        </div>
        <div class="action in-center">
          <i class="fas fa-phone fa-xs"></i>
        </div>
      </a>
    `;
  }
  emergencyRow.innerHTML = emergencyCards;
  emergencyContacts.innerHTML = emergencyList.length;
}
function insertContact(index) {
  function addClass(classes, basedOn, ifValues) {
    var result;
    for (var i = 0; i < classes.length; i++) {
      if (contactList[index][basedOn] == ifValues[i]) {
        result = classes[i];
      }
    }
    return result;
  }
  var contactCard = `
    <div class="col-lg-6">
      <div
        class="mini-card bg-white rounded-4 border border-gray-100 shadow-sm"
      >
        <div
          class="heading d-flex align-items-center gap-3 p-3 pb-0"
        >
          <div
            class="icon in-center position-relative bg-${
              contactList[index].bg
            } to-br"
          >
            <div
              class="position-absolute top-0 end-0 in-center bg-amber rounded-circle border border-white border-3 ${addClass(
                ["d-none"],
                "favorites",
                [false]
              )}"
            >
              <i class="fas fa-star fa-sm"></i>
            </div>
            <span class="fw-semibold fs-5 text-uppercase">
              ${contactList[index].name.charAt(0)}
            </span>
            <div
              class="position-absolute bottom-0 end-0 in-center bg-rose rounded-circle border border-white border-3 ${addClass(
                ["d-none"],
                "emergency",
                [false]
              )}"
            >
              <i class="fas fa-heart-pulse fa-sm"></i>
            </div>
          </div>
          <div class="text d-flex flex-column gap-1">
            <span class="fw-bold">${contactList[index].name}</span>
            <span class="d-flex align-items-center gap-2">
              <span
                class="icon in-center d-inline-flex bg-blue-subtle"
              >
                <i class="fas fa-phone fa-sm"></i>
              </span>
              <span class="small text-gray-500 fw-medium">
                ${contactList[index].phone}
              </span>
            </span>
          </div>
        </div>
        <div class="body p-3">
          <div class="d-flex align-items-center gap-2 mb-2 ${addClass(
            ["d-none"],
            "email",
            [""]
          )}">
            <span
              class="icon in-center d-inline-flex bg-violet-subtle"
            >
              <i class="fas fa-envelope fa-sm"></i>
            </span>
            <span class="small text-gray-500 fw-medium">
              ${contactList[index].email}
            </span>
          </div>
          <div class="d-flex align-items-center gap-2 mb-3 ${addClass(
            ["d-none"],
            "address",
            [""]
          )}">
            <span
              class="icon in-center d-inline-flex bg-emerald-subtle"
            >
              <i class="fas fa-location-dot fa-sm"></i>
            </span>
            <span class="small text-gray-500 fw-medium">
              ${contactList[index].address}
            </span>
          </div>
          <div class="d-flex align-items-center gap-2 small">
            <span class="badge fw-medium p-2 text-capitalize ${addClass(
              [
                "d-none",
                "bg-blue-subtle",
                "bg-emerald-subtle",
                "bg-violet-subtle",
                "bg-amber-subtle",
                "bg-gray-subtle",
              ],
              "group",
              ["", "family", "friends", "work", "school", "other"]
            )}">
              ${contactList[index].group}
            </span>
            <span class="badge fw-medium p-2 bg-rose-subtle text-capitalize ${addClass(
              ["d-none"],
              "emergency",
              [false]
            )}">
              <i class="fas fa-heart-pulse"></i>
              Emergency
            </span>
          </div>
        </div>
        <div
          class="footer d-flex justify-content-between align-items-center bg-gray-50 bg-opacity-75 border-top py-2 px-3"
        >
          <div class="links d-flex align-items-center gap-2">
            <a
              title="Phone"
              href="tel:${contactList[index].phone}"
              class="btn in-center text-decoration-none"
            >
              <i class="fas fa-sm fa-phone"></i>
            </a>
            <a
              title="Mail"
              href="mailto:${contactList[index].email}"
              class="btn in-center text-decoration-none ${addClass(
                ["d-none"],
                "email",
                [""]
              )}"
            >
              <i class="fas fa-sm fa-envelope"></i>
            </a>
          </div>
          <div class="actions d-flex align-items-center gap-2">
            <button title="Favorite" class="favorites-btn btn in-center ${addClass(
              ["active"],
              "favorites",
              [true]
            )}" onclick="toggleList(favoritesList, ${index}, 'favorites', this)">
              <i class="fas fa-sm fa-star"></i>
            </button>
            <button title="Emergency" class="emergency-btn btn in-center ${addClass(
              ["active"],
              "emergency",
              [true]
            )}" onclick="toggleList(emergencyList, ${index}, 'emergency', this);">
              <i class="fas fa-sm fa-heart-pulse"></i>
            </button>
            <button title="Edit" class="btn in-center" onclick="updateContact(${index})">
              <i class="fas fa-sm fa-pencil"></i>
            </button>
            <button title="Delete" class="btn in-center" onclick="deleteContact(${index})">
              <i class="fas fa-sm fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  contactsRow.innerHTML += contactCard;
}
function toggleList(list, contactIndex, type, btn) {
  if (!btn.classList.contains("active")) {
    contactList[contactIndex][type] = true;
    checkDuplicationAndAdd(list, contactIndex);
    btn.classList.add("active");
    storeLists();
    displayContacts();
    if (searchInput.value !== "") {
      searchContacts();
    }
  } else {
    contactList[contactIndex][type] = false;
    removeFromCategory(list, contactIndex);
    btn.classList.remove("active");
    storeLists();
    displayContacts();
    if (searchInput.value !== "") {
      searchContacts();
    }
  }
}
function randomBg() {
  var backgrounds = [
      "rose-red",
      "violet-indigo",
      "blue-darkblue",
      "lightblue-darkblue",
      "amber-orange",
      "rose-pink",
      "teal-emerald",
    ],
    randomBgIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomBgIndex];
}

// Update
function updateContact(i) {
  addContactPage.classList.remove("d-none");
  updateContactBtn.classList.remove("d-none");
  saveContactBtn.classList.add("d-none");
  contactName.value = contactList[i].name;
  contactPhone.value = contactList[i].phone;
  contactEmail.value = contactList[i].email;
  contactAddress.value = contactList[i].address;
  contactGroup.value = contactList[i].group;
  contactNotes.value = contactList[i].notes;
  contactFavorite.checked = contactList[i].favorites;
  contactEmergency.checked = contactList[i].emergency;
  for (var j = 0; j < allInputs.length; j++) {
    validateInputs(allInputs[j]);
  }
  updateContactBtn.addEventListener(
    "click",
    function () {
      saveEdits(i);
    },
    { once: true }
  );
}
function saveEdits(j) {
  if (!contactName.classList.contains("is-invalid")) {
    if (!contactPhone.classList.contains("is-invalid")) {
      for (var i = 0; i < contactList.length; i++) {
        if (i !== j && contactList[i].phone == contactPhone.value) {
          Swal.fire({
            icon: "error",
            title: "Duplicate Phone Number",
            text: `
              A contact with this phone number already exists: ${contactList[i].name}
            `,
          });
          return;
        }
      }
      contactList[j].name = contactName.value;
      contactList[j].phone = contactPhone.value;
      contactList[j].email = contactEmail.value;
      contactList[j].address = contactAddress.value;
      contactList[j].group = contactGroup.value;
      contactList[j].notes = contactNotes.value;
      contactList[j].favorites = contactFavorite.checked;
      contactList[j].emergency = contactEmergency.checked;
      checkDuplicationAndAdd(favoritesList, j);
      checkDuplicationAndAdd(emergencyList, j);
      storeLists();
      displayContacts();
      addContactPage.classList.add("d-none");
      if (searchInput.value !== "") {
        searchContacts();
      }
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else if (contactPhone.value == "") {
      Swal.fire({
        icon: "error",
        title: "Missing Phone",
        text: "Please enter a phone number!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid phone number (Ex. 01234567891)",
      });
    }
  } else if (contactName.value == "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
  }
  clearValues();
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].classList.remove("is-invalid");
  }
}
function checkDuplicationAndAdd(list, contactIndex) {
  /*
    If the contact is already in the favorite list, remove it and add it again
    (to prevent contact duplication).
  */
  // Favorite
  if (list == favoritesList) {
    for (var k = 0; k < favoritesList.length; k++) {
      if (contactList[contactIndex].id === favoritesList[k].id) {
        favoritesList.splice(k, 1);
        break;
      }
    }
    if (contactList[contactIndex].favorites) {
      addToCategory(favoritesList, contactIndex);
    }
  } else {
    // Emergency
    for (var k = 0; k < emergencyList.length; k++) {
      if (contactList[contactIndex].id === emergencyList[k].id) {
        emergencyList.splice(k, 1);
        break;
      }
    }
    if (contactList[contactIndex].emergency) {
      addToCategory(emergencyList, contactIndex);
    }
  }
}

// Delete
function deleteContact(t) {
  Swal.fire({
    title: "Are you sure?",
    text: `Are you sure you want to delete ${contactList[t].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      for (var i = 0; i < favoritesList.length; i++) {
        if (favoritesList[i].id === contactList[t].id) {
          favoritesList.splice(i, 1);
          break;
        }
      }
      for (var i = 0; i < emergencyList.length; i++) {
        if (emergencyList[i].id === contactList[t].id) {
          emergencyList.splice(i, 1);
          break;
        }
      }
      contactList.splice(t, 1);
      storeLists();
      displayContacts();
      if (searchInput.value !== "") {
        searchContacts();
      }
      if (localStorage.getItem("Contacts") == "[]") {
        noContacts.classList.remove("d-none");
      }
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  });
}

// When user searches
searchInput.addEventListener("input", function () {
  searchContacts();
});
// Search
function searchContacts() {
  contactsRow.innerHTML = "";
  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      contactList[i].phone
        .toLowerCase()
        .includes(searchInput.value.toLowerCase()) ||
      contactList[i].email
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      insertContact(i);
    }
  }
  if (contactsRow.innerHTML == "") {
    noContacts.classList.remove("d-none");
  } else {
    noContacts.classList.add("d-none");
  }
}

// Validation
for (var i = 0; i < allInputs.length; i++) {
  allInputs[i].addEventListener("input", function (e) {
    validateInputs(e.target);
  });
}
function validateInputs(input) {
  if (regex[input.id].test(input.value)) {
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
  }
}
