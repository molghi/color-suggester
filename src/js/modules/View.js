import { handleFormSubmit, handleFormBtns, handleMarkingFavorite } from "./view-dependencies/eventHandlers.js";
import { showError, renderColorElement } from "./view-dependencies/renderMethods.js";

class View {
    constructor() {
        this.containerEl = document.querySelector(".container");
        this.formEl = document.querySelector(".form__form");
        this.inputEl = document.querySelector(".form__input");
        this.getBtn = document.querySelector(".form__btn--get");
        this.randomBtn = document.querySelector(".form__btn--random");
        this.favesBtn = document.querySelector(".form__btn--faves");
        this.shadesSection = document.querySelector(".shades");
        this.combosSection = document.querySelector(".combos");
        this.randomSection = document.querySelector(".random");
        this.favoriteSection = document.querySelector(".favorite");
        this.allResultBoxes = document.querySelectorAll(".results__items-box");
        this.formBtnsBox = document.querySelector(".form__btns");
        // this.shadesResultsBox = document.querySelector(".shades .results__items-box");
    }

    // ================================================================================================

    handleFormSubmit(handler) {
        handleFormSubmit(handler);
    }

    // ================================================================================================

    clearInput() {
        this.inputEl.value = "";
    }

    // ================================================================================================

    focusInput() {
        this.inputEl.focus();
    }

    // ================================================================================================

    removeErrorMsgs() {
        if (document.querySelector(".error")) document.querySelector(".error").remove();
    }

    // ================================================================================================

    // showing an error message on the screen
    showError(text) {
        showError(text);
    }

    // ================================================================================================

    renderColorElement(htmlColor, hexColor, rgbColor, parentEl) {
        renderColorElement(htmlColor, hexColor, rgbColor, parentEl);
    }

    // ================================================================================================

    // unhiding the Shades section or the Combos section
    revealSection(el) {
        const section = el.closest(".results__box");
        section.classList.remove("hidden");
    }

    // ================================================================================================

    clearResults() {
        this.allResultBoxes.forEach((resultBox) => {
            while (resultBox.firstElementChild) resultBox.removeChild(resultBox.firstElementChild);
        });
    }

    // ================================================================================================

    // hiding or showing main sections
    toggleSections(showFlag = "show") {
        if (showFlag === "show") {
            this.shadesSection.classList.remove("hidden");
            this.combosSection.classList.remove("hidden");
            this.randomSection.classList.remove("hidden");
        } else {
            this.shadesSection.classList.add("hidden");
            this.combosSection.classList.add("hidden");
            this.randomSection.classList.add("hidden");
        }
    }

    // ================================================================================================

    toggleFavorites(showFlag = "show") {
        if (showFlag === "show") {
            this.favoriteSection.classList.remove("hidden");
        } else {
            this.favoriteSection.classList.add("hidden");
        }
    }

    // ================================================================================================

    handleFormBtns(handler) {
        handleFormBtns(handler);
    }

    // ================================================================================================

    handleMarkingFavorite(handler) {
        handleMarkingFavorite(handler);
    }

    // ================================================================================================
}

export default View;
