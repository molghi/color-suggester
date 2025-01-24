import { Visual } from "../../Controller.js";

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

    div.style.animation = "pulse2 0.5s ease-in-out";
    setTimeout(() => {
        div.style.animation = "none";
    }, 500);
}

// ================================================================================================

// render a msg (typically the one that says "nothing here yet" in Favourites)
function showMessage(textMsg, parentEl) {
    Visual.removeMessages(); // remove all messages first if there are any

    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = textMsg;
    parentEl.appendChild(div);
}

// ================================================================================================

export { showError, showMessage };
