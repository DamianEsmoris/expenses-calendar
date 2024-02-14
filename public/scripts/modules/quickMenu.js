import { closeEveryhingInMyScreen, BACKDROP, setActiveElement, ELEMENTS, activeElement } from "./backdrop.js";

const QUICK_MENU = document.getElementById('quickMenu');
const MOON = QUICK_MENU.querySelector('#moon');
const SWIPE_TOLERANCE = 25;

MOON.onclick = () => 
    document.body.classList.toggle('dark-theme');

function showQuickMenu() {
    setActiveElement(ELEMENTS["QUICK_MENU"]);
    QUICK_MENU.classList.remove('hidden');
    BACKDROP.classList.remove('hidden');
}

function hideQuickMenu() {
    setActiveElement(null)
    QUICK_MENU.classList.add('hidden');
    BACKDROP.classList.add('hidden');
}

// DRAG

let touchstartX, touchendX;
function checkDirection() {
    if (touchstartX > window.innerWidth / 3 || 
        touchendX - SWIPE_TOLERANCE <= touchstartX)
        return;

    closeEveryhingInMyScreen();
    showQuickMenu();
}

document.ontouchstart = (e) => 
    touchstartX = e.changedTouches.item(0).clientX
    
document.ontouchend = (e) => {
    touchendX = e.changedTouches.item(0).clientX
    checkDirection()
}

// KEYBOARD EVENT

document.onkeyup = (e) => {
    if (e.key == "`") {
        if (activeElement === ELEMENTS["QUICK_MENU"]) hideQuickMenu();
        else {
            closeEveryhingInMyScreen();
            showQuickMenu();
        }
    }

    if (e.key == "Escape") 
        closeEveryhingInMyScreen();
}

function setupQuickmenu() {};

export {
    hideQuickMenu,
    setupQuickmenu
}