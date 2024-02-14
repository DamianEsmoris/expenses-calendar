import { BACKDROP, ELEMENTS, closeEveryhingInMyScreen, setActiveElement } from "../modules/backdrop.js";
let expensesPopup;

function getDaysInMonth(y, m) {
    let negativeOffset = new Date(y, m, 1).getDay() - 1;
    return new Array(35).fill().map((d,i) => new Date(y,m,i-negativeOffset));
}

function createCalendar(table, popup) {
    expensesPopup = {
        self: popup,
        title: popup.querySelector('span.title'),
        confirm: popup.querySelector('span.bttn'),
    }

    expensesPopup.self.money.onkeyup = () => {
        let value = expensesPopup.self.money.value;
        if(isNaN(value) || value.length === 0){
            expensesPopup.self.money.setAttribute('invalid','!!!!')
            return false;
        }
        
        expensesPopup.self.money.removeAttribute('invalid');
            
    }

    const DATE = new Date();
    let row;
    for (let d of getDaysInMonth(DATE.getFullYear(), DATE.getMonth())){
        if (d.getDay() == 0){
            row = document.createElement('tr');
            table.appendChild(row);
        }

        let td = document.createElement('td');
        td.textContent = d.getDate();

        if (d.getMonth() != DATE.getMonth()) {
            td.classList.add('other-month');
        }else{
            td.onclick = () => {
                customizePopup(d);
                BACKDROP.classList.remove('hidden');
                expensesPopup.self.classList.remove('hidden');
                setActiveElement(ELEMENTS["EXPENSES_POPUP"]);
            }

        }
        row.appendChild(td);
    }

    return table;
}

function hideExpensesPopup(){
    expensesPopup.self.classList.add('hidden');
    expensesPopup.self.onsubmit = (e) => e.preventDefault();
}

function customizePopup(d){
    expensesPopup.self.reset();
    expensesPopup.self.money.removeAttribute('invalid');
    expensesPopup.title.textContent = d.toLocaleDateString();

    expensesPopup.self.onsubmit = (e) => {
        e.preventDefault();
        let toSend = new FormData(expensesPopup.self);
        toSend.append('date', d.getTime());

        fetch('/newEvent', {
            method: "POST",
            body: toSend,
        }).then(() => {
            closeEveryhingInMyScreen();
        })
        
    }
}
 

export {
    createCalendar,
    hideExpensesPopup
}