async function fetchColors(hexOrRgbString, type, mode, resultsNum) {
    try {
        if (!hexOrRgbString || !type) return;

        let colorParam = "";
        if (type === "hex") {
            colorParam = `hex=${hexOrRgbString.slice(1)}`;
        }
        if (type === "rgb") {
            const pureRgbValues = hexOrRgbString
                .slice(4, -1)
                .split(",")
                .map((x) => x.trim())
                .join(","); // getting pure rgb values
            colorParam = `rgb=${pureRgbValues}`;
        }

        let modeChoice = "monochrome";
        // mode choices: monochrome, monochrome-dark, monochrome-light, analogic, complement, analogic-complement, triad, quad
        if (mode) modeChoice = mode;
        let amountOfResults = 7;
        if (resultsNum) amountOfResults = resultsNum;

        const API_URL = `https://www.thecolorapi.com/scheme?${colorParam}&mode=${modeChoice}&count=${amountOfResults}`;
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error();
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ================================================================================================

export { fetchColors };
