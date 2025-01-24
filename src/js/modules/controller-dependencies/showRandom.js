import { Logic, Visual } from "../../Controller.js";
import renderColorElement from "./renderColorElement.js";

// ================================================================================================

function showRandomColors() {
    // generating 21 random color: hex and rgb

    Visual.removeErrorMsgs(); // removing error messages if there are any
    Visual.clearResults(); // removing all results of previous renderings
    Visual.toggleSections("hide"); // hiding all sections: they'll be shown further down the execution chain
    Visual.toggleFavorites("hide"); // hiding favourites
    Visual.removeMessages();

    const parentEl = document.querySelector(".random .results__items-box"); // getting the ref to the parent el
    Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

    const amountOfColors = 21;
    const colors = [];

    // generating and populating 'colors'
    for (let i = 0; i < amountOfColors; i++) {
        const rgb = Logic.getRandomRGBColor();
        const hex = Logic.convertToHex(rgb);
        colors.push([hex, rgb]);
    }

    // rendering
    colors.forEach((curColArr, i, arr) => renderColorElement(undefined, curColArr[0], curColArr[1], parentEl));
}

// ================================================================================================

export default showRandomColors;
