import { Logic } from "../../Controller.js";
import { iconHeartHollow, iconHeartFull } from "../view-dependencies/icons.js";

// ================================================================================================

// rendering one color element
function renderColorElement(htmlColor, hexColor, rgbColor, parentEl, iconChoice, animationFlag) {
    let color = htmlColor;
    let hex = hexColor;
    let rgb = rgbColor;

    const savedColors = Logic.getSavedColors();
    const isInSavedColors = savedColors.includes(hex); // checking if this color exists in Saved Colors

    let colorEl = defineHTMLColor(color, rgb); // seeing if it has any HTML color to display

    const div = document.createElement("div");
    div.classList.add("result");
    div.dataset.hex = hex;

    let icon = defineIcon(iconChoice, isInSavedColors, div); // defining the icon and maybe also the dataset.favorite

    div.innerHTML = getColorElHtml(hex, colorEl, rgb, icon); // getting the HTML of the element

    parentEl.appendChild(div); // rendering

    if (animationFlag) return; // if there was the animation flag, render without animation

    addAnimation(); // else add some nice animation
}

// ================================================================================================

// dependency fn
function getColorElHtml(hex, colorEl, rgb, icon) {
    return `<div style="background-color: ${hex}; box-shadow: 0 0 10px ${hex};" class="result__color-box"></div>
                <div class="result__color-info">
                    ${colorEl}
                    <div class="result__color-hex">${hex}</div>
                    <div class="result__color-rgb">${rgb}</div>
                </div>
                <div class="result__color-btns">
                    <button class="result__color-btn result__color-btn--save">${icon}</button>
                </div>`;
}

// ================================================================================================

// dependency fn
function addAnimation() {
    const allCreatedResults = [...document.querySelectorAll(".result")];
    allCreatedResults.forEach((resultEl, i) => {
        resultEl.style.animationFillMode = "both";
        resultEl.style.animation = `reveal ${i * 0.07}s ease-in-out`;
    });
}

// ================================================================================================

// dependency fn
function defineIcon(iconChoice, isInSavedColors, div) {
    if (iconChoice || isInSavedColors) {
        div.dataset.favorite = "favorite";
        return iconHeartFull;
    } else {
        return iconHeartHollow;
    }
}

// ================================================================================================

// dependency fn
function defineHTMLColor(color, rgb) {
    if (color) {
        return `<div class="result__color-html-color">${color}</div>`;
    } else {
        const htmlColor = Logic.checkExistingHtmlColor(rgb); // checking if it is any of the existing HTML colors
        if (htmlColor) return `<div class="result__color-html-color">${htmlColor}</div>`;
        else return "";
    }
}

// ================================================================================================

export default renderColorElement;
