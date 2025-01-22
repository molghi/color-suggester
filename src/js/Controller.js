"use strict";

import "../styles/main.scss";
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src

import Model from "./modules/Model.js";
import View from "./modules/View.js";
// import KeyCommands from './modules/KeyCommands.js'  // to do sth by typing certain keys
// import LS from './modules/Storage.js'  // to work with local storage

// initialising main classes
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs upon page refresh
function init() {
    Visual.focusInput();
    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleFormSubmit(onFormSubmit);
}

// ================================================================================================

// happens upon the form submit
function onFormSubmit(value) {
    const inputValue = value.trim().toLowerCase();
    const isValidHtmlColor = Logic.checkHtmlColor(inputValue); // checking if it's an existing HTML color, returns boolean
    Visual.removeErrorMsgs(); // removing error messages if there are any
    const errorText = `<span>Error: input was incorrect.</span><span>Input must be formatted the following way:</span><span>'grey' (HTML color), '#808080' (HEX), or 'rgb(128, 128, 128)' (RGB)</span>`;

    // processing cases
    processCases(inputValue, isValidHtmlColor, errorText);
}

// ================================================================================================

// processes various cases upon the form submit
function processCases(inputValue, isValidHtmlColor, errorText) {
    if (inputValue.startsWith("#")) {
        // likely HEX color
        const isValidHex = Logic.checkValidHex(inputValue);
        if (!isValidHex) return Visual.showError(errorText);
        else console.log(`✅ it's a valid HEX color`);
    } else if (inputValue.startsWith("rgb(")) {
        // likely RGB color
        const isValidRgb = Logic.checkValidRgb(inputValue);
        if (!isValidRgb) return Visual.showError(errorText);
        else console.log(`✅ it's a valid RGB color`);
    } else if (isValidHtmlColor) {
        // is standard HTML color
        processHtmlColor(inputValue);
    } else {
        console.log(`🚫 invalid value:`, inputValue);
        Visual.clearResults(); // clears all results in Shades and Combos
        Visual.showError(errorText);
    }
}

// ================================================================================================

function processHtmlColor(inputValue) {
    Visual.clearResults(); // clearing all results in Shades and Combos
    const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
    Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

    const hexAndRgb = Logic.getHexAndRgb(inputValue); // getting this color in HEX and RGB; returns an array
    const thisColorRgb = hexAndRgb[1];
    // Visual.renderColorElement(inputValue, ...hexAndRgb, parentEl); // rendering the color that was typed; 'renderColorElement' args: html color, hex, rgb, parentEl

    const similarColors = Logic.getSimilarHtmlColors(inputValue); // getting all html colors of the same family
    const similarColorsHexRgb = similarColors.map((color) => Logic.getHexAndRgb(color)); // getting their HEX and RGB:
    similarColorsHexRgb.forEach(
        (el, i) => Visual.renderColorElement(similarColors[i], similarColorsHexRgb[i][0], similarColorsHexRgb[i][1], parentEl) // rendering them
    );

    const similarRgbColors = Logic.getCloseRgbColors(thisColorRgb); // getting similar RGB colors
    const similarColorsRgbAndHex = similarRgbColors.map((rgbCol) => {
        const hex = Logic.convertToHex(rgbCol); // getting HEX's of those RGB colors
        return [rgbCol, hex];
    });
    similarColorsRgbAndHex.forEach((colorEntry, i) => {
        Visual.renderColorElement(undefined, similarColorsRgbAndHex[i][1], similarColorsRgbAndHex[i][0], parentEl); // rendering them
    });
}

// ================================================================================================

export { Logic, Visual };
