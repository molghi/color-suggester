import { Logic, Visual } from "../../Controller.js";
import renderColorElement from "./renderColorElement.js";

// ================================================================================================

function showFavoriteColors() {
    Visual.removeErrorMsgs(); // removing error messages if there are any
    Visual.clearResults(); // removing all results of previous renderings
    Visual.toggleSections("hide"); // hiding all sections: they'll be shown further down the execution chain

    const parentEl = document.querySelector(".favorite__colors");

    // making sure to remove all before rendering them again
    if (parentEl.firstElementChild) {
        while (parentEl.firstElementChild) parentEl.removeChild(parentEl.firstElementChild);
    }
    if (document.querySelector(".saved-colors")) document.querySelector(".saved-colors").remove();

    // getting all saved colors from the state
    const savedColors = Logic.getSavedColors();

    // showing msg if it's null
    if (savedColors.length === 0 || !savedColors) {
        Visual.showMessage("Nothing here yet...", document.querySelector(".favorite"));
    } else {
        const savedColorsRGBs = savedColors.map((col) => Logic.convertToRgb(col)); // we need their RGBs because they are stored as HEXs
        savedColors.forEach((colHex, i) => renderColorElement(undefined, colHex, savedColorsRGBs[i], parentEl, "fullHeart")); // rendering
    }

    // unhiding the section
    document.querySelector(".favorite").classList.remove("hidden");
}

// ================================================================================================

export default showFavoriteColors;
