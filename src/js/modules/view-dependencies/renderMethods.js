import { Logic, Visual } from "../../Controller.js";
import { iconHeartHollow, iconHeartFull } from "./icons.js";

// ================================================================================================

// rendering error
function showError(text) {
    Visual.removeErrorMsgs(); // removing all error msgs first
    const div = document.createElement("div");
    div.classList.add("message", "error");
    const divInner = document.createElement("div");
    divInner.innerHTML = `Error: Something failed.`;
    if (text) divInner.innerHTML = text;
    div.appendChild(divInner);
    Visual.containerEl.appendChild(div);
}

// ================================================================================================

// rendering one color element
function renderColorElement(htmlColor, hexColor, rgbColor, parentEl, iconChoice) {
    let color = htmlColor;
    let hex = hexColor;
    let rgb = rgbColor;

    const savedColors = Logic.getSavedColors();
    const isInSavedColors = savedColors.includes(hex);

    let colorEl = "";
    if (color) {
        colorEl = `<div class="result__color-html-color">${color}</div>`;
    } else {
        const htmlColor = Logic.checkExistingHtmlColor(rgb);
        if (htmlColor) colorEl = `<div class="result__color-html-color">${htmlColor}</div>`;
    }

    const div = document.createElement("div");
    div.classList.add("result");
    div.dataset.hex = hex;

    let icon = iconHeartHollow;
    if (iconChoice || isInSavedColors) {
        icon = iconHeartFull;
        div.dataset.favorite = "favorite";
    }

    div.innerHTML = `<div style="background-color: ${hex}; box-shadow: 0 0 10px ${hex};" class="result__color-box"></div>
                <div class="result__color-info">
                    ${colorEl}
                    <div class="result__color-hex">${hex}</div>
                    <div class="result__color-rgb">${rgb}</div>
                </div>
                <div class="result__color-btns">
                    <button class="result__color-btn result__color-btn--save">${icon}</button>
                </div>`;

    parentEl.appendChild(div);
}

// ================================================================================================

export { showError, renderColorElement };
