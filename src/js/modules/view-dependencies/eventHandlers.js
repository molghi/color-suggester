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

export { handleFormSubmit, handleFormBtns };
