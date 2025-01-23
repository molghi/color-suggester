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
async function init() {
    Visual.focusInput();
    Logic.getFavColors();
    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleFormSubmit(onFormSubmit);
    Visual.handleFormBtns(formBtnsHandler);
    Visual.handleMarkingFavorite(markFavorite);
}

// ================================================================================================

// happens upon the form submit
function onFormSubmit(value) {
    const inputValue = value.trim().toLowerCase();

    Logic.setCurrentInput(inputValue); // setting the current input color

    const isValidHtmlColor = Logic.checkHtmlColor(inputValue); // checking if it's an existing HTML color, returns boolean

    Visual.removeErrorMsgs(); // removing error messages if there are any

    Visual.clearResults(); // removing all results of previous renderings

    Visual.toggleSections("hide"); // hiding both: they'll be shown further down the execution chain
    Visual.toggleFavorites("hide"); // hiding favourites

    const errorText = `<span>Error: input was incorrect.</span><span>Input must be formatted one of the following ways:</span><span>'grey' (existing HTML color), '#808080' or '#ccc' (HEX), or 'rgb(128, 128, 128)' (RGB)</span>`;

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
async function processHtmlColor(inputValue) {
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

    getSimilarRgbColors(thisColorRgb, parentEl);

    await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
}

// ================================================================================================

// get similar colors or adjacent or just those that go well with the input color
async function getMoreColors() {
    let inputColor = Logic.getCurrentInput(); // getting the input color as it was typed
    let inputColorType = inputColor[0] === "#" ? "hex" : inputColor.startsWith("rgb(") ? "rgb" : null; // it is either hex or rgb or null
    if (!inputColorType) {
        inputColor = Logic.convertToRgb(inputColor); // if it is null, convert inputColor to rgb
        inputColorType = "rgb";
    }
    if (inputColor.length === 4) {
        // then it was sth like #ccc --> I need #cccccc
        inputColor = "#" + inputColor.slice(1) + inputColor.slice(1);
    }

    // console.log(inputColor);
    // return console.log(inputColorType);

    // fetching
    const [res1, res2, res3, res4, res5, res6] = await Promise.all([
        Logic.fetchColors(inputColor, inputColorType), // monochrome selection
        Logic.fetchColors(inputColor, inputColorType, "analogic"), // analogic
        Logic.fetchColors(inputColor, inputColorType, "complement"), // complement
        Logic.fetchColors(inputColor, inputColorType, "analogic-complement"), // analogic-complement
        Logic.fetchColors(inputColor, inputColorType, "triad"), // triad
        Logic.fetchColors(inputColor, inputColorType, "quad"), // quad
    ]);

    // console.log(res1, res2, res3, res4, res5, res6);

    // filtering API response
    const res1Filtered = Logic.filterApiResult(res1);
    const res2Filtered = Logic.filterApiResult(res2);
    const res3Filtered = Logic.filterApiResult(res3);
    const res4Filtered = Logic.filterApiResult(res4);
    const res5Filtered = Logic.filterApiResult(res5);
    const res6Filtered = Logic.filterApiResult(res6);

    toggleCombosBlock("show", "clearAll"); // showing the Combos block and clearing all results there

    // rendering
    const parentEl = document.querySelector(".combos .results__items-box");
    const shadesResultsBoxEl = document.querySelector(".shades .results__items-box");
    res1Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], shadesResultsBoxEl)); // pushing the monochrome selection to Shades
    res2Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], parentEl));
    res3Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], parentEl));
    res4Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], parentEl));
    res5Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], parentEl));
    res6Filtered.forEach((colArr) => Visual.renderColorElement(undefined, colArr[0], colArr[1], parentEl));
}

// ================================================================================================

function toggleCombosBlock(showFlag = "show", clearFlag) {
    const entireBlockEl = document.querySelector(".combos");
    const titleEl = entireBlockEl.querySelector(".results__box-title");
    const resultsBoxEl = entireBlockEl.querySelector(".results__items-box");

    if (showFlag === "show") {
        entireBlockEl.classList.remove("hidden"); // unhiding it
    } else {
        entireBlockEl.classList.add("hidden");
    }

    if (clearFlag) {
        // removing all child elements in .results__items-box
        while (resultsBoxEl.firstElementChild) resultsBoxEl.removeChild(resultsBoxEl.firstElementChild);
    }
}

// ================================================================================================

function getSimilarRgbColors(thisColorRgb, parentEl, resultsNum) {
    // this fn needs thisColorRgb (string) and parentEl that will append this child (this color)

    let similarRgbColors;
    if (resultsNum) similarRgbColors = Logic.getCloseRgbColors(thisColorRgb, 20); // getting their rgb
    else similarRgbColors = Logic.getCloseRgbColors(thisColorRgb); // getting similar RGB colors

    const similarColorsRgbAndHex = similarRgbColors.map((rgbCol) => {
        const hex = Logic.convertToHex(rgbCol); // getting HEX's of those RGB colors
        return [rgbCol, hex];
    });

    // rendering them
    similarColorsRgbAndHex.forEach((colorEntry, i) => {
        Visual.renderColorElement(undefined, similarColorsRgbAndHex[i][1], similarColorsRgbAndHex[i][0], parentEl);
    });
}

// ================================================================================================

// process the input that was a HEX color
async function processHexColor(inputValue) {
    Visual.clearResults(); // clearing all results in Shades and Combos
    const parentEl = document.querySelector(".shades .results__items-box"); // getting the ref to the parent el
    Visual.revealSection(parentEl); // unhiding 'Shades' or 'Combos' section, it is hidden by default

    // rendering this color: getting its rgb first
    const thisColorRGB = Logic.convertToRgb(inputValue);
    Visual.renderColorElement(undefined, inputValue.toUpperCase(), thisColorRGB, parentEl);

    // rendering 20 similar colors
    getSimilarRgbColors(thisColorRGB, parentEl, 20);

    await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
}

// ================================================================================================

// process the input that was an RGB color    rgb(100,200,150)
async function processRgbColor(inputValue) {
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
    getSimilarRgbColors(thisColorRgbFormatted, parentEl, 20);

    await getMoreColors(); // getting similar colors or adjacent or just those that go well with the input color
}

// ================================================================================================

function formBtnsHandler(btnType) {
    if (btnType === "random") {
        // console.log(`show random colors`);
        showRandomColors();
    }
    if (btnType === "faves") {
        // console.log(`show favourite colours`);
        showFavoriteColors();
    }
}

// ================================================================================================

function showRandomColors() {
    // generating 21 random color: hex and rgb

    Visual.removeErrorMsgs(); // removing error messages if there are any
    Visual.clearResults(); // removing all results of previous renderings
    Visual.toggleSections("hide"); // hiding all sections: they'll be shown further down the execution chain
    Visual.toggleFavorites("hide"); // hiding favourites

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

    // console.log(colors);

    // rendering
    colors.forEach((curColArr, i, arr) => Visual.renderColorElement(undefined, curColArr[0], curColArr[1], parentEl));
}

// ================================================================================================

function showFavoriteColors() {
    Visual.removeErrorMsgs(); // removing error messages if there are any
    Visual.clearResults(); // removing all results of previous renderings
    Visual.toggleSections("hide"); // hiding all sections: they'll be shown further down the execution chain

    const parentEl = document.querySelector(".favorite__colors");
    if (parentEl.firstElementChild) {
        while (parentEl.firstElementChild) parentEl.removeChild(parentEl.firstElementChild); // removing all before rendering them again
    }

    if (document.querySelector(".saved-colors")) document.querySelector(".saved-colors").remove();

    // const div = document.createElement("div");
    // div.classList.add("saved-colors");

    const savedColors = Logic.getSavedColors();

    if (savedColors.length === 0 || !savedColors) return;

    const savedColorsRGBs = savedColors.map((col) => Logic.convertToRgb(col)); // we need their RGBs because they are stored as HEXs

    // rendering:
    savedColors.forEach((colHex, i) => Visual.renderColorElement(undefined, colHex, savedColorsRGBs[i], parentEl));

    // unhiding the section
    document.querySelector(".favorite").classList.remove("hidden");

    // document.querySelector(".container").appendChild(div);
}

// ================================================================================================

function markFavorite(hexString) {
    Logic.pushNewFavColor(hexString); // pushing to state and LS
}

// ================================================================================================

export { Logic, Visual };
