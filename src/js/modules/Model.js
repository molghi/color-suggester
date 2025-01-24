import htmlColors from "./model-dependencies/HTML_colors.js";
import fetchColors from "./model-dependencies/api.js";
import { convertToRgb, convertToHex } from "./model-dependencies/colorConvertions.js";

class Model {
    #state = {
        usualColorNames: ["gray", "rose", "peach", "bronze", "amber", "rust", "blood", "sky", "grass", "sun", "wood"],
        savedColors: [],
        currentInput: "",
        htmlColorsAsRgb: {},
    };
    constructor() {
        this.convertHtmlColors();
    }

    // ================================================================================================

    getState = () => this.#state;

    getSavedColors = () => this.#state.savedColors;

    setCurrentInput = (value) => (this.#state.currentInput = value);

    getCurrentInput = () => this.#state.currentInput;

    // ================================================================================================

    // get from localStorage
    getFavColors() {
        const unparsed = localStorage.getItem("savedColors");
        const parsed = JSON.parse(unparsed);
        if (!parsed) return;
        parsed.forEach((favCol) => this.#state.savedColors.push(favCol));
    }

    // ================================================================================================

    // push to state and LS
    pushNewFavColor(hexString) {
        if (this.#state.savedColors.includes(hexString)) return;
        this.#state.savedColors.push(hexString);
        localStorage.setItem("savedColors", JSON.stringify(this.#state.savedColors));
    }

    // ================================================================================================

    // gets you a flat array of all html colors lowercased
    getAllHtmlColors() {
        const allColors = Object.values(htmlColors).flat();
        return allColors.map((color) => color.toLowerCase());
    }

    // ================================================================================================

    // checks if this value, which is a word, is one of the html colors
    checkHtmlColor(value) {
        const htmlColors = this.getAllHtmlColors();
        const valueFormatted = value.trim().toLowerCase();
        if (htmlColors.includes(valueFormatted)) return true;
        else return false;
    }

    // ================================================================================================

    // gets you an array of similar html colors (of the same color family): if 'white' was passed, all whites are returned, and so on -- returns an array
    getSimilarHtmlColors(value) {
        const htmlColorKeys = Object.keys(htmlColors);
        const htmlColorValues = Object.values(htmlColors);

        const foundFamily = htmlColorValues.find((colorFamily) => {
            const lowercased = colorFamily.map((el) => el.toLowerCase()); // lowercasing a color family
            return lowercased.includes(value); // returning that color family that contains 'value'
        });

        return foundFamily;
    }

    // ================================================================================================

    // converting color (HEX or HTML color) to RGB
    convertToRgb(color) {
        return convertToRgb(color);
    }

    // ================================================================================================

    // coverting RGB to HEX: input must formatted like: 'rgb(0, 0, 128)'
    convertToHex(rgbColor) {
        return convertToHex(rgbColor);
    }

    // ================================================================================================

    // checking if the input was valid hex color
    checkValidHex(hexString) {
        if (hexString.length < 4 || hexString.length > 7) return false;

        return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hexString);
        /* Explanation:
    Regular Expression:
        ^#: Ensures the string starts with #.
        ([0-9A-F]{3}|[0-9A-F]{6}):
            Matches either a 3-digit or 6-digit hexadecimal value.
            [0-9A-F]: Accepts only valid hexadecimal characters (0-9 and A-F).
        /i: Makes the match case-insensitive.
    Return Value:
        true if the string is a valid HEX colour.
        false otherwise.
     */
    }

    // ================================================================================================

    // checking if the input was valid rgb color
    checkValidRgb(rgbString) {
        return (
            /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/.test(rgbString) &&
            rgbString.match(/\d+/g).every((num) => num >= 0 && num <= 255)
        );
        /* Explanation:
    Regular Expression:
        ^rgb\(: Ensures the string starts with rgb(.
        \s*: Allows optional spaces after rgb( and between numbers.
        (\d{1,3}): Captures numbers with 1 to 3 digits.
        \s*\)$: Allows optional spaces before the closing parenthesis.
    Validation:
        Ensures each captured number (\d+) is between 0 and 255 using every.
    Return Value:
        true if the string is a valid RGB colour.
        false otherwise.
     */
    }

    // ================================================================================================

    // get hex and rgb of the passed html color
    getHexAndRgb(htmlColorStr) {
        const colorRGB = this.convertToRgb(htmlColorStr);
        const colorHEX = this.convertToHex(colorRGB);
        return [colorHEX, colorRGB];
    }

    // ================================================================================================

    // get a selection of colors similar to 'rgbColor' (no API involved)
    getCloseRgbColors(rgbColor, amount = 10) {
        const pureRgbValues = rgbColor
            .slice(4, -1)
            .split(",")
            .map((el) => +el.trim());
        const pureRgb = {
            r: pureRgbValues[0],
            g: pureRgbValues[1],
            b: pureRgbValues[2],
        };
        const colors = [];
        const amountOfColors = amount;

        // helper tools
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max); // Helper function to clamp the values within 0-255 range
        const step = 80; // Subtracting (-step) centres the range around 0 (making it -step to step).
        const multiplier = step * 2 + 1; // The multiplier (101) sets the total range (from 0 to 100).
        const getRandomOffset = () => Math.floor(Math.random() * multiplier) - step; // Helper function to generate random offset: Random number between -step and step

        // generating a certain amount of colours close to the original
        for (let i = 0; i < amountOfColors; i++) {
            const r = clamp(pureRgb.r + getRandomOffset(), 0, 255);
            const g = clamp(pureRgb.g + getRandomOffset(), 0, 255);
            const b = clamp(pureRgb.b + getRandomOffset(), 0, 255);
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }

        return colors; // will have entries like "rgb(243, 246, 235)"
    }

    // ================================================================================================

    // get a random color -- returns a string
    getRandomRGBColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        // Math.random(): Generates a random number between 0 and 1.
        // Math.random() * 256: Scales the random number to the range 0-255 (inclusive).
        // Math.floor(): Rounds down to the nearest integer.
        return `rgb(${r}, ${g}, ${b})`;
    }

    // ================================================================================================

    // perform an API request
    async fetchColors(hexOrRgbString, type, mode, resultsNum) {
        // I don't necessarily need try-catch here because the calling code (in the Controller) handles all errors
        // and the fetchColors method in the module already has its own try-catch block to handle and log errors.
        const data = await fetchColors(hexOrRgbString, type, mode, resultsNum);
        return data;
    }

    // ================================================================================================

    // filter the received API response
    filterApiResult(obj) {
        const result = obj.colors.map((colorObj) => {
            const hex = colorObj.hex.value;
            const rgb = colorObj.rgb.value;
            return [hex, rgb];
        });
        return result;
    }

    // ================================================================================================

    // convert all HTML colors to RGBs
    convertHtmlColors() {
        this.getAllHtmlColors().forEach((htmlCol) => {
            this.#state.htmlColorsAsRgb[htmlCol] = this.convertToRgb(htmlCol);
        });
    }

    // ================================================================================================

    // checks if this value, which is a HEX or RGB color, an existing HTML color
    checkExistingHtmlColor(value) {
        if (!value.startsWith("rgb(") && !value.startsWith("#")) return null;

        let pureRgb;
        if (value.startsWith("#")) {
            pureRgb = this.convertToRgb(value); // if it is HEX, convert it to RGB
        } else {
            pureRgb = value
                .slice(4, -1)
                .split(",")
                .map((x) => x.trim())
                .join(", "); // extracting pure RGB values
            pureRgb = `rgb(${pureRgb})`;
        }

        const htmlRgbs = Object.values(this.#state.htmlColorsAsRgb); // only rgb values, array
        const htmlNames = Object.keys(this.#state.htmlColorsAsRgb);

        const index = htmlRgbs.findIndex((el) => el === pureRgb);
        if (index < 0) return false;
        else return htmlNames[index];
    }

    // ================================================================================================

    // removing from Favorites in state and LS
    removeFromFavorites(hexString) {
        const index = this.#state.savedColors.findIndex((savedColor) => savedColor === hexString);
        this.#state.savedColors.splice(index, 1);
        localStorage.setItem("savedColors", JSON.stringify(this.#state.savedColors));
    }

    // ================================================================================================
}

export default Model;
