import htmlColors from "./model-dependencies/HTML_colors.js";

class Model {
    #state = {
        usualColorNames: ["gray", "rose", "peach", "bronze", "amber", "rust"],
    };
    constructor() {
        // console.log(this.getSimilarHtmlColors("coral"));
    }

    // ================================================================================================

    getState() {
        return this.#state;
    }

    // ================================================================================================

    // gets you a flat array of all html colors lowercased
    getAllHtmlColors() {
        const allColors = Object.values(htmlColors).flat();
        return allColors.map((color) => color.toLowerCase());
    }

    // ================================================================================================

    checkHtmlColor(value) {
        const htmlColors = this.getAllHtmlColors();
        const valueFormatted = value.trim().toLowerCase();
        if (htmlColors.includes(valueFormatted)) return true;
        else return false;
    }

    // ================================================================================================

    // gets you an array of similar html colors: if 'white' was passed, all whites are returned -- returns array
    getSimilarHtmlColors(value) {
        const htmlColorKeys = Object.keys(htmlColors);
        const htmlColorValues = Object.values(htmlColors);

        const foundFamily = htmlColorValues.find((colorFamily) => {
            const lowercased = colorFamily.map((el) => el.toLowerCase()); // lowercasing a color family
            return lowercased.includes(value); // returning that color family that contains 'value'
        });

        // const index = foundFamily.map((el) => el.toLowerCase()).indexOf(value);
        // foundFamily.splice(index, 1); // removing 'value' (because it is already rendered)

        return foundFamily;
    }

    // ================================================================================================

    // converting color to RGB
    convertToRgb(color) {
        // mimicking the DOM addition and reading the computed color
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.style.color = color;
        const computedColor = window.getComputedStyle(element).color;
        document.body.removeChild(element);
        return computedColor;
    }

    // ================================================================================================

    // coverting RGB to HEX: input must formatted like: 'rgb(0, 0, 128)'
    convertToHex(rgbColor) {
        const rgbMatch = rgbColor.match(/rgb\((\d+), (\d+), (\d+)\)/); // This regular expression matches the structure of the RGB string. The result of match() is an array where: rgbMatch[1] is the red value, rgbMatch[2] is the green value, rgbMatch[3] is the blue value.
        if (rgbMatch) {
            // If the match exists, extracting the RGB values and converting them to integers:
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);

            // The RGB values are converted into a single hexadecimal value:
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b) // Bitwise Operations: The bitwise shifts (<<) are used to place the RGB values at the correct positions in a 24-bit value, facilitating their conversion into hexadecimal.
                .toString(16) // converts the integer into a hexadecimal string
                .slice(1) // removes the leading "1" (from 1 << 24), leaving only the colour part
                .toUpperCase()}`;

            return hex;
        }
        return null;
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

    // returns array: hex and rgb
    getHexAndRgb(htmlColorStr) {
        const colorRGB = this.convertToRgb(htmlColorStr);
        const colorHEX = this.convertToHex(colorRGB);
        return [colorHEX, colorRGB];
    }

    // ================================================================================================

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

        // Generate 10 colours close to the original
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max); // Helper function to clamp the values within 0-255 range
        const getRandomOffset = () => Math.floor(Math.random() * 41) - 20; // Helper function to generate random offset: Random number between -20 and 20

        for (let i = 0; i < amountOfColors; i++) {
            const r = clamp(pureRgb.r + getRandomOffset(), 0, 255);
            const g = clamp(pureRgb.g + getRandomOffset(), 0, 255);
            const b = clamp(pureRgb.b + getRandomOffset(), 0, 255);
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }

        return colors; // will have entries like "rgb(243, 246, 235)"
    }

    // ================================================================================================

    // returns a string
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
}

export default Model;
