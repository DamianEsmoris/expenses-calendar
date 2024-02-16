import { createCalendar } from "./modules/calendar.js";
import { setupQuickmenu } from "./modules/quickMenu.js";
const CALENDAR = document.getElementById('calendarTable');
const EXPENSES_POPUP = document.getElementById('expensivePopup');
createCalendar(CALENDAR, EXPENSES_POPUP);


setupQuickmenu();