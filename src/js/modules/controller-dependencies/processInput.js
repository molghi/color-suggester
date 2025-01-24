import { Logic, Visual } from "../../Controller.js";
import getMoreColors from "./fetchShowMoreColors.js"; // API involved
import renderColorElement from "./renderColorElement.js";

// ================================================================================================

// general router function -- processes various cases upon the form submit
function processCases(inputValue, isValidHtmlColor, errorText) {
    if (inputValue.startsWith("#")) {
        // likely HEX color
        const isValidHex = Logic.checkValidHex(inputValue);
        if (!isValidHex) return Visual.showError(errorText);
        else processHexColor(inputValue);
    } else if (inputValue.startsWith("rgb(")) {
        // likely RGB color
        const isValidRgb = Logic.checkValidRgb(inputValue);
        if (!isValidRgb) return Visual.showError(errorText);
        else processRgbColor(inputValue);
    } else if (isValidHtmlColor) {
        // is standard HTML color
        processHtmlColor(inputValue);
    } else {
        Visual.clearResults(); // clears all results in Shades and Combos
        Visual.showError(errorText);
    }
}

// ================================================================================================

// dependency of 'processCases' -- process the input that was a HEX color
async function processHexColor(inputValue) {
    try {
        Visual.clearResults(); // clearing all results in Shades and Combos
        const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
        Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

        // rendering this color: getting its rgb first
        const thisColorRGB = Logic.convertToRgb(inputValue);
        renderColorElement(undefined, inputValue.toUpperCase(), thisColorRGB, parentEl);

        // rendering 20 similar colors
        getSimilarRgbColors(thisColorRGB, parentEl, 20);

        await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
    } catch (error) {
        console.error(error);
    }
}

// ================================================================================================

// dependency of 'processCases' -- process the input that was an RGB color    rgb(100,200,150)
async function processRgbColor(inputValue) {
    try {
        // formatting it properly first:
        const thisColorRgbValues = inputValue
            .slice(4, -1)
            .split(",")
            .map((x) => x.trim())
            .join(", ");
        const thisColorRgbFormatted = `rgb(${thisColorRgbValues})`;

        Visual.clearResults(); // clearing all results in Shades and Combos
        const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
        Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

        // rendering this color: getting its hex first
        const thisColorHex = Logic.convertToHex(thisColorRgbFormatted);
        renderColorElement(undefined, thisColorHex, thisColorRgbFormatted, parentEl);

        // rendering 20 similar colors
        getSimilarRgbColors(thisColorRgbFormatted, parentEl, 20);

        await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
    } catch (error) {
        console.error(error);
    }
}

// ================================================================================================

// dependency of 'processCases' -- process the input that was one of HTML colors such as 'orange', 'cyan', 'lime', 'white', etc.
async function processHtmlColor(inputValue) {
    try {
        Visual.clearResults(); // clearing all results in Shades and Combos
        const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
        Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

        const hexAndRgb = Logic.getHexAndRgb(inputValue); // getting this color in HEX and RGB; returns an array
        const thisColorRgb = hexAndRgb[1];
        // renderColorElement(inputValue, ...hexAndRgb, parentEl); // rendering the color that was typed; 'renderColorElement' args: html color, hex, rgb, parentEl

        const similarColors = Logic.getSimilarHtmlColors(inputValue); // getting all html colors of the same family
        const similarColorsHexRgb = similarColors.map((color) => Logic.getHexAndRgb(color)); // getting their HEX and RGB:
        similarColorsHexRgb.forEach(
            (el, i) => renderColorElement(similarColors[i], similarColorsHexRgb[i][0], similarColorsHexRgb[i][1], parentEl) // rendering them
        );

        getSimilarRgbColors(thisColorRgb, parentEl);

        await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
    } catch (error) {
        console.error(error);
    }
}

// ================================================================================================

// dependency function: gets adjacent RGB colors (no API involved) -- needs thisColorRgb (string) and parentEl that will append this child (this color)
function getSimilarRgbColors(thisColorRgb, parentEl, resultsNum) {
    let similarRgbColors;

    if (resultsNum) similarRgbColors = Logic.getCloseRgbColors(thisColorRgb, 20); // getting their rgb
    else similarRgbColors = Logic.getCloseRgbColors(thisColorRgb);

    const similarColorsRgbAndHex = similarRgbColors.map((rgbCol) => {
        const hex = Logic.convertToHex(rgbCol); // getting HEX's of those RGB colors
        return [rgbCol, hex];
    });

    // rendering them
    similarColorsRgbAndHex.forEach((colorEntry, i) => {
        renderColorElement(undefined, similarColorsRgbAndHex[i][1], similarColorsRgbAndHex[i][0], parentEl);
    });
}

// ================================================================================================

export default processCases;
