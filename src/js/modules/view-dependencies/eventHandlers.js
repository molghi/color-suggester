import { Visual } from "../../Controller.js";

// ================================================================================================

// handle form submission
function handleFormSubmit(handler) {
    Visual.formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = Visual.inputEl.value;
        Visual.clearInput();
        handler(value);
    });
}

// ================================================================================================

export { handleFormSubmit };
