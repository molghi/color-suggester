import { handleFormSubmit, handleFormBtns, handleMarkingFavorite } from "./view-dependencies/eventHandlers.js";
import { showError, showMessage } from "./view-dependencies/renderMethods.js";
import { iconHeartHollow, iconHeartFull } from "./view-dependencies/icons.js";

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
        this.combosResultsBox = document.querySelector(".combos .results__items-box");
        this.randomSection = document.querySelector(".random");
        this.favoriteSection = document.querySelector(".favorite");
        this.favoriteColorsBox = document.querySelector(".favorite__colors");
        this.allResultBoxes = document.querySelectorAll(".results__items-box");
        this.formBtnsBox = document.querySelector(".form__btns");
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

    // unhiding the Shades section or the Combos section
    revealSection(el) {
        const section = el.closest(".results__box");
        section.classList.remove("hidden");
    }

    // ================================================================================================

    // clearing all results
    clearResults() {
        this.allResultBoxes.forEach((resultBox) => {
            while (resultBox.firstElementChild) resultBox.removeChild(resultBox.firstElementChild);
        });
    }

    // ================================================================================================

    // hiding or showing main sections
    toggleSections(showFlag = "show") {
        const sections = [this.shadesSection, this.combosSection, this.randomSection];

        if (showFlag === "show") {
            sections.forEach((section) => section.classList.remove("hidden"));
        } else {
            sections.forEach((section) => section.classList.add("hidden"));
        }
    }

    // ================================================================================================

    // hiding or showing favorites
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

    // render a msg (typically the one that says "nothing here yet" in Favourites)
    showMessage(textMsg, parentEl) {
        showMessage(textMsg, parentEl);
    }

    // ================================================================================================

    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

    // change the heart icon (fave) to full/hollow heart
    changeHeartIcon(resultEl, flag) {
        const resultBtnSvg = resultEl.querySelector(".result__color-btn--save").innerHTML;

        if (resultBtnSvg.toString() === iconHeartHollow.toString() || flag === "makeFull") {
            // change to full heart
            resultEl.querySelector(".result__color-btn--save").innerHTML = iconHeartFull;
            resultEl.dataset.favorite = "favorite";
        } else if (resultBtnSvg.toString() === iconHeartFull.toString()) {
            // change to hollow heart
            resultEl.querySelector(".result__color-btn--save").innerHTML = iconHeartHollow;
            resultEl.dataset.favorite = "null";
        }
    }

    // ================================================================================================

    // apply some animation upon faving a color
    pulseHeart(el) {
        const saveBtnEl = el.querySelector(".result__color-btn--save");
        saveBtnEl.style.animation = "pulse 0.5s ease-in-out";
        setTimeout(() => {
            saveBtnEl.style.animation = "none";
        }, 500);
    }

    // ================================================================================================

    // marking duplicates among the rendered elements: if I fave/unfave a color, all duplicates must be also faved/unfaved
    markRenderedDuplicates(value, clickedEl, isMarkedFavorite) {
        const allRenderedResults = [...document.querySelectorAll(".result")];
        const allRenderedHexes = allRenderedResults.map((el) => el.dataset.hex);
        const duplicatesExist = allRenderedHexes.indexOf(value) === allRenderedHexes.lastIndexOf(value) ? false : true; // if the first index of the clicked element's HEX the same as the last index of it in the selection of all rendered elements, then there are no duplicates (false)
        if (!duplicatesExist) return;

        // now I need to fave or unfave all duplicates
        const allDuplicateElements = allRenderedResults.filter((el) => el.dataset.hex === value);
        const indexOfClickedEl = allDuplicateElements.findIndex((duplEl) => duplEl === clickedEl);
        allDuplicateElements.splice(indexOfClickedEl, 1); // removing the element that I just clicked on

        if (isMarkedFavorite) {
            // fave all duplicates
            allDuplicateElements.forEach((duplicateEl) => this.changeHeartIcon(duplicateEl, "makeFull"));
        } else {
            // unfave all duplicates
            allDuplicateElements.forEach((duplicateEl) => this.changeHeartIcon(duplicateEl, "makeHollow"));
        }
    }

    // ================================================================================================

    toggleCombosBlock(showFlag = "show", clearFlag) {
        if (showFlag === "show") {
            this.combosSection.classList.remove("hidden"); // unhiding it
        } else {
            this.combosSection.classList.add("hidden");
        }

        if (clearFlag) {
            while (this.combosResultsBox.firstElementChild) {
                this.combosResultsBox.removeChild(this.combosResultsBox.firstElementChild); // removing all child elements in .results__items-box
            }
        }
    }

    // ================================================================================================

    clearFavoriteElements() {
        this.favoriteColorsBox.innerHTML = "";
    }

    // ================================================================================================
}

export default View;
