// convert an input, which can be an HTML color or HEX, to rgb
function convertToRgb(color) {
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
function convertToHex(rgbColor) {
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

export { convertToRgb, convertToHex };
