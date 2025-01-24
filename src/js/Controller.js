"use strict";

import "../styles/main.scss";

import Model from "./modules/Model.js";
import View from "./modules/View.js";

import processCases from "./modules/controller-dependencies/processInput.js";
import showRandomColors from "./modules/controller-dependencies/showRandom.js";
import showFavoriteColors from "./modules/controller-dependencies/showFavorite.js";
import renderColorElement from "./modules/controller-dependencies/renderColorElement.js";

// initialising main classes
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs upon page refresh
function init() {
    Visual.focusInput(); // focus the input
    Logic.getFavColors(); // get from LS and push to state
    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleFormSubmit(onFormSubmit); // handle form submit
    Visual.handleFormBtns(formBtnsHandler); // handle btns responsible for showing Random or Favorite Colors
    Visual.handleMarkingFavorite(markFavorite); // handle marking a color as favorite or unfavorite (pressing the heart btn)
}

// ================================================================================================

// happens upon the form submit
function onFormSubmit(value) {
    const inputValue = value.trim().toLowerCase();

    Logic.setCurrentInput(inputValue); // setting the current input color

    const isValidHtmlColor = Logic.checkHtmlColor(inputValue); // checking if it's an existing HTML color, returns boolean

    Visual.removeErrorMsgs(); // removing error messages if there are any
    Visual.clearResults(); // removing all results of previous renderings
    Visual.toggleSections("hide"); // hiding sections: they'll be shown further down the execution chain
    Visual.toggleFavorites("hide"); // hiding favourites

    const errorText = `<span>Error: input was incorrect.</span><span>Input must be formatted in one of the following ways:</span><span>'grey' (existing HTML color), '#808080' or '#ccc' (HEX), or 'rgb(128, 128, 128)' (RGB)</span>`;

    // processing cases
    processCases(inputValue, isValidHtmlColor, errorText);
}

// ================================================================================================

// handle showing Random or Favorite Colors
function formBtnsHandler(btnType) {
    if (btnType === "random") showRandomColors();
    if (btnType === "faves") showFavoriteColors();
}

// ================================================================================================

// mark as favorite or delete from favorites
function markFavorite(hexString, resultEl) {
    Visual.changeHeartIcon(resultEl); // changing the heart icon: full heart/hollow heart; and also setting el.dataset.favorite

    const isMarkedFavorite = resultEl.dataset.favorite === "favorite" ? true : false;

    Visual.markRenderedDuplicates(hexString, resultEl, isMarkedFavorite); // if there are duplicates, then when I fave one, all of them must be marked as faves (and vice versa)

    if (isMarkedFavorite) {
        // add to favorites
        Visual.pulseHeart(resultEl); // some animation upon faving a color
        Logic.pushNewFavColor(hexString); // pushing to state and LS
    } else {
        // remove from favorites
        Logic.removeFromFavorites(hexString); // changing in state and LS

        if (!Visual.favoriteSection.classList.contains("hidden")) {
            // I am now in favorites: re-render favorites
            const savedColors = Logic.getSavedColors(); // getting HEXs
            const savedColorsRGBs = savedColors.map((col) => Logic.convertToRgb(col)); // getting RGBs
            Visual.clearFavoriteElements(); // clearing all before re-rendering them
            const parentEl = document.querySelector(".favorite__colors");
            if (savedColors.length === 0) return Visual.showMessage(`Nothing here yet...`, parentEl); // if no saved colors, show message and return
            // re-rendering without animation:
            savedColors.forEach((colHex, i) =>
                renderColorElement(undefined, colHex, savedColorsRGBs[i], parentEl, "fullHeart", "noAnimation")
            );
        }
    }
}

// ================================================================================================

export { Logic, Visual };
