import { handleFormSubmit, handleFormBtns, handleMarkingFavorite } from "./view-dependencies/eventHandlers.js";
import { showError, renderColorElement } from "./view-dependencies/renderMethods.js";
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
        this.randomSection = document.querySelector(".random");
        this.favoriteSection = document.querySelector(".favorite");
        this.favoriteColorsBox = document.querySelector(".favorite__colors");
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

    renderColorElement(htmlColor, hexColor, rgbColor, parentEl, iconChoice) {
        renderColorElement(htmlColor, hexColor, rgbColor, parentEl, iconChoice);
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

    showMessage(textMsg, parentEl) {
        this.removeMessages();
        const div = document.createElement("div");
        div.classList.add("message");
        div.innerHTML = textMsg;
        parentEl.appendChild(div);
    }

    // ================================================================================================

    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

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

    renderFavorites(colorsHex, colorsRgb) {
        this.favoriteColorsBox.innerHTML = "";

        const parentEl = document.querySelector(".favorite__colors");

        if (colorsHex.length === 0) {
            this.showMessage(`Nothing here yet...`, parentEl);
            return;
        }

        colorsHex.forEach((colHex, i) => this.renderColorElement(undefined, colHex, colorsRgb[i], parentEl, "fullHeart"));
    }

    // ================================================================================================
}

export default View;
