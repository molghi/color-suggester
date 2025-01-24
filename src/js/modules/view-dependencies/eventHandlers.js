import { Visual } from "../../Controller.js";

// ================================================================================================

// handle form submission
function handleFormSubmit(handler) {
    Visual.formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = Visual.inputEl.value;
        Visual.clearInput(); // clearing the input field
        handler(value);
    });
}

// ================================================================================================

// handle form btns: Random Color and View Favourites
function handleFormBtns(handler) {
    Visual.formBtnsBox.addEventListener("click", (e) => {
        if (!e.target.classList.contains("form__btn")) return;
        const btnClicked = e.target.classList.contains("form__btn--random") ? "random" : "faves"; // defining the type of the clicked btn
        handler(btnClicked);
    });
}

// ================================================================================================

// handle adding a color to Your Favorites (or removing)
function handleMarkingFavorite(handler) {
    Visual.containerEl.addEventListener("click", (e) => {
        if (!e.target.closest(".result__color-btn--save")) return;
        const clickedElementHex = e.target.closest(".result").dataset.hex; // getting the hex value
        const result = e.target.closest(".result"); // getting the entire element
        handler(clickedElementHex, result);
    });
}

// ================================================================================================

export { handleFormSubmit, handleFormBtns, handleMarkingFavorite };
