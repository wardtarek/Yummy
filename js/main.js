// Sidenav
$("#openCloseIcon.fa-align-justify").on("click", () => {
  if ($(".sidenav").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});
function openSideNav() {
  $(".sidenav").animate({ left: "0px" }, 500);
  $("#openCloseIcon").removeClass("fa-align-justify");
  $("#openCloseIcon").addClass("fa-x");
  let li = $(".sidenav li");
  for (let i = 0; i < 5; i++) {
    li.eq(i).animate({ top: "0" }, (i + 1) * 200);
  }
}
function closeSideNav() {
  $(".sidenav li").animate({ top: "200px" });
  $(".sidenav").animate({ left: "-257px" }, 500);
  $("#openCloseIcon").removeClass("fa-x");
  $("#openCloseIcon").addClass("fa-align-justify");
}

// Get and Display First Api
let myRow = $("#myRow");
let rowSearch = $("#rowSearch");
$(document).ready(async function () {
  await searchByName("");
  $(".loadingScreen").fadeTo(500, 0);
  $(".loadingScreen").animate({ zIndex: "-1" });
  $("body").css("overflow", "auto");
  $(".sidenav").animate({ left: "-257px" }, 400);
});
async function searchByName(name) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let data = await req.json();
  displayData(data.meals);
}
function displayData(data) {
  temp = "";
  data.forEach((element) => {
    temp += `<div class="col-md-3">
                    <div class="item" onclick="getMealDetails(${element.idMeal})">
                        <div class="img-container rounded-2 bg-white overflow-hidden position-relative">
                            <img src="${element.strMealThumb}" class="w-100" alt="">
                            <div class="layer d-flex align-items-center p-2 rounded-2">
                                <h3 class="fw-semibold">${element.strMeal}</h3>
                            </div>
                        </div>
                    </div>
                </div>`;
  });
  myRow.html(temp);
}

// Get Meal Details and Display
function loadWait() {
  $(".loadingScreen").css("left", "66px");
  $(".loadingScreen").animate({ zIndex: "1000", opacity: "1" }, 300);
  $(".loadingScreen").animate({ zIndex: "-1", opacity: "0" });
}
async function getMealDetails(idMeal) {
  myRow.html("");
  loadWait();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
  );
  let data = await req.json();
  displayMealDetails(data.meals[0]);
  console.log(data);
}
function displayMealDetails(data) {
  let ing = ``;
  console.log(data);
  for (let i = 1; i <= 20; i++) {
    let str = "strIngredient" + i;
    if (data[str] != "") {
      let strIng = "strIngredient" + i;
      let strM = "strMeasure" + i;
      ing += `<li class="py-1 px-3 bg-info-subtle m-2 rounded-2 text-black">${data[strM]} ${data[strIng]}</li>`;
    }
  }
  let wordTag = "";
  let tags = "";
  if (data.strTags != null) {
    let arrOfTags = data.strTags.split(",");
    wordTag = "Tags :";

    for (let i = 0; i < arrOfTags.length; i++) {
      tags += `<li class="py-1 px-3 bg-danger-subtle m-2 rounded-2 text-black">${arrOfTags[i]}</li>`;
    }
  }
  console.log(wordTag);
  temp = "";
  temp += `<div class="col-md-4">
                <div class="text-white">
                  <div class="img-container">
                        <img src="${data.strMealThumb}" class="w-100 rounded-2" alt="">
                        <h2>${data.strMeal}</h2>
                    </div>
                </div>
                </div>
                <div class="col-md-8">
                <div class="text-white">
                    <h3>Instructions</h3>
                    <p>${data.strInstructions}</p>
                    <h3>Area : <span class="fs-4 fw-normal">${data.strArea}</span></h3>
                    <h3>Category : <span class="fs-4 fw-normal">${data.strCategory}</span></h3>
                    <h3>Recipes : </h3>
                    <ul class="list-unstyled d-flex flex-wrap">
                    ${ing}
                    </ul>
                    <h3>${wordTag}</h3>
                    <ul class="list-unstyled d-flex flex-wrap">
                    ${tags}
                    </ul>
                    <a type="button" href="${data.strSource}" target="_blank" class="btn btn-success mx-1">Source</a>
                    <a type="button" href="${data.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
                </div>                    
                </div>`;
  myRow.html(temp);
}
// Get and Display Search Api
$("#search").on("click", () => {
  myRow.html("");
  closeSideNav();
  $("#contact").css("display", "none");
  let temp = `<div class="col-md-6">
            <div class="mb-3">
              <input type="text" class="form-control text-white" style="background-color: var(--mainColor);" id="searchByName" onkeyup="displaySearchByName($(this).val())" placeholder="Search By Name">
            </div>
          </div>
        <div class="col-md-6">
          <div class="mb-3">
            <input type="text" class="form-control text-white" style="background-color: var(--mainColor);" id="searchByFLetter" maxlength="1" onkeyup="searchByFLetter($(this).val())" placeholder="Search By First Letter">
          </div>
        </div>
          `;
  rowSearch.html(temp);
});
function displaySearchByName(value) {
  loadWait();
  searchByName(value);
}
async function searchByFLetter(Letter) {
  loadWait();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${Letter}`
  );
  let data = await req.json();
  console.log(data);
  displayDataSearchFLetter(data);
}
function displayDataSearchFLetter(data) {
  let newData;
  if (data.meals.length > 20) {
    newData = data.meals.slice(0, 20);
    displayData(newData);
  } else {
    displayData(data.meals);
  }
}
// Get and Display Categories Api
$("#categories").on("click", async function () {
  closeSideNav();
  myRow.html("");
  loadWait();
  $("#contact").css("display", "none");
  rowSearch.html("");
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await req.json();
  displayCategories(data);
});
function displayCategories(data) {
  temp = "";
  data.categories.forEach((element) => {
    temp += `<div class="col-md-3">
                    <div class="item" onclick="getCategoryMeals('${
                      element.strCategory
                    }')">
                        <div class="img-container rounded-2 bg-white overflow-hidden position-relative bg-transparent">
                            <img src="${
                              element.strCategoryThumb
                            }" class="w-100" alt="">
                            <div class="layer d-flex flex-column text-center align-items-center justify-content-center p-3 rounded-2">
                                <h3 class="fw-semibold mb-0">${
                                  element.strCategory
                                }</h3>
                                <p class="overflow-hidden">${element.strCategoryDescription
                                  .split(" ")
                                  .slice(0, 20)
                                  .join(" ")}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
  });
  myRow.html(temp);
}

async function getCategoryMeals(category) {
  closeSideNav();
  myRow.html("");

  loadWait();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await req.json();
  displayCategoryMeals(data);
}
function displayCategoryMeals(data) {
  myRow.html("");
  loadWait();
  if (data.meals.length > 20) {
    let newData = data.meals.slice(0, 20);
    displayData(newData);
  } else {
    displayData(data.meals);
  }
}

// Get and Display Area Api
$("#area").on("click", async function () {
  closeSideNav();
  myRow.html("");
  loadWait();
  $("#contact").css("display", "none");
  rowSearch.html("");
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await req.json();
  displayAreas(data);
});
function displayAreas(data) {
  temp = "";
  data.meals.forEach((element) => {
    temp += `<div class="col-md-3">
                    <div class="item text-white d-flex flex-column justify-content-center align-items-center" onclick="getAreaMeals('${element.strArea}')">
                      <i class="fa-solid fa-house-laptop fa-4x"></i>
                      <h3 class="fw-semibold">${element.strArea}</h3>
                    </div>
                </div>`;
  });
  myRow.html(temp);
}
async function getAreaMeals(area) {
  closeSideNav();
  myRow.html("");

  loadWait();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await req.json();
  displayAreaMeals(data);
}
function displayAreaMeals(data) {
  myRow.html("");

  loadWait();
  if (data.meals.length > 20) {
    let newData = data.meals.slice(0, 20);
    displayData(newData);
  } else {
    displayData(data.meals);
  }
}

// Get and Display Ingredients Api
$("#ingredients").on("click", async function () {
  closeSideNav();
  myRow.html("");

  loadWait();
  $("#contact").css("display", "none");
  rowSearch.html("");
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await req.json();
  displayIngredients(data);
});
function displayIngredients(data) {
  temp = "";
  if (data.meals.length > 20) {
    let newData = data.meals.slice(0, 20);
    displayFinalIngredients(newData);
  } else {
    displayFinalIngredients(data.meals);
  }
}
function displayFinalIngredients(data) {
  data.forEach((element) => {
    temp += `<div class="col-md-3">
                    <div class="item text-white text-center d-flex flex-column justify-content-center align-items-center" onclick="getIngredientsMeals('${
                      element.strIngredient
                    }')">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3 class="fw-semibold mb-0">${element.strIngredient}</h3>
                      <p class="overflow-hidden">${element.strDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
                    </div>
                </div>`;
  });
  myRow.html(temp);
}
async function getIngredientsMeals(ingredients) {
  closeSideNav();
  myRow.html("");

  loadWait();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let data = await req.json();
  displayIngredientsMeals(data);
}
function displayIngredientsMeals(data) {
  myRow.html("");

  loadWait();
  if (data.meals.length > 20) {
    let newData = data.meals.slice(0, 20);
    displayData(newData);
  } else {
    displayData(data.meals);
  }
}

// Contact
$("#contactus").on("click", () => {
  closeSideNav();
  myRow.html("");
  rowSearch.html("");
  $("#contact").css("display", "block");
});

// Form validation
// Name Validation
let nameInput = $("#nameInput");
let nameAlert = $("#nameAlert");
nameInput.keyup(validName);
function validName() {
  var regex = /^[a-zA-Z]{2,}$/;
  if (regex.test(nameInput.val())) {
    nameInput.addClass("is-valid");
    nameInput.removeClass("is-invalid");
    nameAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    nameInput.addClass("is-invalid");
    nameInput.removeClass("is-valid");
    nameAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}

// Email Validation
let emailInput = $("#emailInput");
let emailAlert = $("#emailAlert");
emailInput.keyup(validEmail);
function validEmail() {
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(emailInput.val())) {
    emailInput.addClass("is-valid");
    emailInput.removeClass("is-invalid");
    emailAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    emailInput.addClass("is-invalid");
    emailInput.removeClass("is-valid");
    emailAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}

// Phone Validation
let phoneInput = $("#phoneInput");
let phoneAlert = $("#phoneAlert");
phoneInput.keyup(validPhone);
function validPhone() {
  var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (regex.test(phoneInput.val())) {
    phoneInput.addClass("is-valid");
    phoneInput.removeClass("is-invalid");
    phoneAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    phoneInput.addClass("is-invalid");
    phoneInput.removeClass("is-valid");
    phoneAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}

// Age Validation
let ageInput = $("#ageInput");
let ageAlert = $("#ageAlert");
ageInput.keyup(validAge);
function validAge() {
  var regex = /^([0]?[3-9]|[1-9][0-9])$/;
  if (regex.test(ageInput.val())) {
    ageInput.addClass("is-valid");
    ageInput.removeClass("is-invalid");
    ageAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    ageInput.addClass("is-invalid");
    ageInput.removeClass("is-valid");
    ageAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}

// Password Validation
let passwordInput = $("#passwordInput");
let passwordAlert = $("#passwordAlert");
passwordInput.keyup(validPassword);
function validPassword() {
  var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (regex.test(passwordInput.val())) {
    passwordInput.addClass("is-valid");
    passwordInput.removeClass("is-invalid");
    passwordAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    passwordInput.addClass("is-invalid");
    passwordInput.removeClass("is-valid");
    passwordAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}

// rePassword Validation
let rePasswordInput = $("#rePasswordInput");
let rePasswordAlert = $("#rePasswordAlert");
rePasswordInput.keyup(validRePassword);
function validRePassword() {
  if (passwordInput.val() == rePasswordInput.val()) {
    rePasswordInput.addClass("is-valid");
    rePasswordInput.removeClass("is-invalid");
    rePasswordAlert.addClass("d-none");
    submitBtn();
    return true;
  } else {
    rePasswordInput.addClass("is-invalid");
    rePasswordInput.removeClass("is-valid");
    rePasswordAlert.removeClass("d-none");
    submitBtn();
    return false;
  }
}
function submitBtn() {
  if (
    nameInput.hasClass("is-valid") &&
    emailInput.hasClass("is-valid") &&
    phoneInput.hasClass("is-valid") &&
    ageInput.hasClass("is-valid") &&
    passwordInput.hasClass("is-valid") &&
    rePasswordInput.hasClass("is-valid")
  ) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}
