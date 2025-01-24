import { Logic, Visual } from "../../Controller.js";
import renderColorElement from "./renderColorElement.js";

// ================================================================================================

// get similar colors or adjacent or just those that go well with the input color
async function getMoreColors() {
    try {
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

        // fetching
        const [res1, res2, res3, res4, res5, res6] = await Promise.all([
            Logic.fetchColors(inputColor, inputColorType), // monochrome selection
            Logic.fetchColors(inputColor, inputColorType, "analogic"), // analogic
            Logic.fetchColors(inputColor, inputColorType, "complement"), // complement
            Logic.fetchColors(inputColor, inputColorType, "analogic-complement"), // analogic-complement
            Logic.fetchColors(inputColor, inputColorType, "triad"), // triad
            Logic.fetchColors(inputColor, inputColorType, "quad"), // quad
        ]);

        // filtering API response
        const res1Filtered = Logic.filterApiResult(res1);
        const res2Filtered = Logic.filterApiResult(res2);
        const res3Filtered = Logic.filterApiResult(res3);
        const res4Filtered = Logic.filterApiResult(res4);
        const res5Filtered = Logic.filterApiResult(res5);
        const res6Filtered = Logic.filterApiResult(res6);

        Visual.toggleCombosBlock("show", "clearAll"); // showing the Combos block and clearing all results there

        // rendering
        const parentEl = document.querySelector(".combos .results__items-box");
        const shadesResultsBoxEl = document.querySelector(".shades .results__items-box");
        res1Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], shadesResultsBoxEl)); // pushing the monochrome selection to Shades & Hues
        res2Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], parentEl)); // all the rest go to Good Combos
        res3Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], parentEl));
        res4Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], parentEl));
        res5Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], parentEl));
        res6Filtered.forEach((colArr) => renderColorElement(undefined, colArr[0], colArr[1], parentEl));
    } catch (error) {
        console.error(error.message);
    }
}

// ================================================================================================

export default getMoreColors;
