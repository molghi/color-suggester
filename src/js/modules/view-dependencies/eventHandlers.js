import { Visual } from "../../Controller.js";

// ================================================================================================

// handle form submission
function handleFormSubmit(handler) {
    Visual.formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = Visual.inputEl.value;
        Visual.clearInput();
        handler(value);
    });
}

// ================================================================================================

// handle form btns: Random Color and View Favourites
function handleFormBtns(handler) {
    Visual.formBtnsBox.addEventListener("click", (e) => {
        if (!e.target.classList.contains("form__btn")) return;
        const btnClicked = e.target.classList.contains("form__btn--random") ? "random" : "faves";
        handler(btnClicked);
    });
}

// ================================================================================================

// handle adding a color to Your Favorites
function handleMarkingFavorite(handler) {
    // Visual.shadesResultsBox
    Visual.allResultBoxes.forEach((resultBox) => {
        resultBox.addEventListener("click", (e) => {
            if (!e.target.closest(".result__color-btn--save")) return;
            const clickedElementHex = e.target.closest(".result").dataset.hex;
            handler(clickedElementHex);
        });
    });
}

// ================================================================================================

export { handleFormSubmit, handleFormBtns, handleMarkingFavorite };
