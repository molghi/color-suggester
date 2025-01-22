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
    Visual.handleFormBtns(formBtnsHandler);
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
        console.log(`🚫 invalid value:`, inputValue);
        Visual.clearResults(); // clears all results in Shades and Combos
        Visual.showError(errorText);
    }
}

// ================================================================================================

// process the input that was one of HTML colors such as 'orange', 'cyan', 'lime', 'white', etc.
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

// process the input that was a HEX color
function processHexColor(inputValue) {
    console.log(inputValue);
    Visual.clearResults(); // clearing all results in Shades and Combos
    const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
    Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

    // rendering this color: getting its rgb first
    const thisColorRGB = Logic.convertToRgb(inputValue);
    Visual.renderColorElement(undefined, inputValue.toUpperCase(), thisColorRGB, parentEl);

    // rendering 20 similar colors
    const similarRgbColors = Logic.getCloseRgbColors(thisColorRGB, 20); // getting their rgb
    const similarColorsHex = similarRgbColors.map((rgbCol) => Logic.convertToHex(rgbCol)); // getting their hex
    // rendering:
    similarRgbColors.forEach((rgbCol, i) => Visual.renderColorElement(undefined, similarColorsHex[i], rgbCol, parentEl));
}

// ================================================================================================

// process the input that was an RGB color    rgb(100,200,150)
function processRgbColor(inputValue) {
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
    Visual.renderColorElement(undefined, thisColorHex, thisColorRgbFormatted, parentEl);

    // rendering 20 similar colors
    const similarRgbColors = Logic.getCloseRgbColors(thisColorRgbFormatted, 20); // getting their rgb
    const similarColorsHex = similarRgbColors.map((rgbCol) => Logic.convertToHex(rgbCol)); // getting their hex
    // rendering:
    similarRgbColors.forEach((rgbCol, i) => Visual.renderColorElement(undefined, similarColorsHex[i], rgbCol, parentEl));
}

// ================================================================================================

function formBtnsHandler(btnType) {
    if (btnType === "random") {
        console.log(`show random colors`);
        showRandomColors();
    }
    if (btnType === "faves") {
        console.log(`show favourite colours`);
        showFavoriteColors();
    }
}

// ================================================================================================

function showRandomColors() {
    // generating 21 random color: hex and rgb
    Visual.clearResults(); // clearing all results in Shades and Combos first
    const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
    Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

    const amountOfColors = 21;
    const colors = [];

    // generating and populating 'colors'
    for (let i = 0; i < amountOfColors; i++) {
        const rgb = Logic.getRandomRGBColor();
        const hex = Logic.convertToHex(rgb);
        colors.push([hex, rgb]);
    }

    console.log(colors);

    // rendering
    colors.forEach((curColArr, i, arr) => Visual.renderColorElement(undefined, curColArr[0], curColArr[1], parentEl));
}

// ================================================================================================

function showFavoriteColors() {
    // do what?
    // first such must be added to LS and state...
}

// ================================================================================================

export { Logic, Visual };
