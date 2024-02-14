import { hideExpensesPopup } from "./calendar.js";
import { hideQuickMenu } from "./quickMenu.js";

const BACKDROP = document.getElementById('backdrop');
const ELEMENTS = Object.freeze({
    'QUICK_MENU': 0,
    'EXPENSES_POPUP': 1,
});

BACKDROP.onclick = closeEveryhingInMyScreen;
let activeElement;

function setActiveElement(elem){
    activeElement = elem;
}

function closeEveryhingInMyScreen() {
    BACKDROP.classList.add('hidden');
    if (activeElement === ELEMENTS["QUICK_MENU"]) hideQuickMenu(); 
    else if (activeElement === ELEMENTS["EXPENSES_POPUP"]) hideExpensesPopup(); 
    activeElement = null;
}

export {
    ELEMENTS,
    BACKDROP,
    activeElement,
    setActiveElement,
    closeEveryhingInMyScreen
}