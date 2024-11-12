import {Dish, dishes} from './dish.js';

const apiUrl = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

const chosenDishes = {
    "soup": null,
    "main-course": null,
    "salad": null,
    "drink": null,
    "dessert": null,

    chosenOnce: false,

    anyChosen() {
        return (this.soup 
            || this["main-course"] 
            || this.salad
            || this.drink
            || this.dessert) != null;
    },

    isCombo() {
        let main = this["main-course"];
        return ((this.soup && main && this.salad && this.drink) 
            || (this.soup && main && this.drink)
            || (this.soup && this.salad && this.drink)
            || (main && this.salad && this.drink)
            || (main && this.drink)) != null;
    },

    calculatePrice() {
        let price = 0;
        for (let x of Object.keys(this)) {
            let elem = chosenDishes[x]?.dish;
            if (elem) price += elem.price;
        }
        return price;
    },

    comboText() {
        let a = "";
        let main = this["main-course"];
        if (!this.drink) {
            a = "Выберите напиток";
        }
        if (!(this.soup || main || this.salad || this.drink)) {
            a = "Ничего не выбрано. Выберите блюда для заказа";
        }
        if ((this.drink || this.dessert) && !main) {
            a = "Выберите главное блюдо";
        }
        if (this.salad && !(this.soup || main)) {
            a = "Выберите суп или главное блюдо";
        }
        if (this.soup && !(main || this.salad)) {
            a = "Выберите главное блюдо или салат/стартер";
        }
        return a;
    },

    createHTMLNotification() {
        let container = document.createElement("div");
        container.className = "notification";
        container.innerHTML = 
            `<p class="notification-text">${this.comboText()}</p>`;
        let button = document.createElement("button");
        button.className = "notification-button";
        button.innerHTML = "Окей 👌";
        button.onclick = (event) => event.currentTarget.parentElement.remove();
        container.append(button);
    
        return container;
    }
};

function filterDishes(category, kind = null) {
    let container = document.querySelector(`#${category} > .dishes`);
    for (let elem of container.children) {
        if (kind === null || kind === elem.dataset.kind) elem.hidden = false;
        else elem.hidden = true;
    }
}

function filter(event) {
    let target = event.currentTarget;
    let kind = null;

    if (target.classList.contains("filter-active")) {
        target.classList.remove("filter-active");
    } else {
        for (let elem of target.parentElement.children) {
            elem.classList.remove("filter-active");
        }
        target.classList.add("filter-active");
        kind = target.dataset.kind;
    }

    filterDishes(target.parentElement.parentElement.id, kind);
}

function addDish(event) {
    let dishContainer = event.currentTarget.parentElement;
    let dish = dishContainer.dish;
    let category = dish.category;

    if (chosenDishes[category]) {
        chosenDishes[category].classList.remove("chosen-dish");
    }
    chosenDishes[category] = dishContainer;
    dishContainer.classList.add("chosen-dish");

    let selectContainer = document.querySelector(".select-container");
    if (!chosenDishes.chosenOnce) {
        document.querySelector(".to-hide").hidden = true;
        selectContainer.hidden = false;
        chosenDishes.chosenOnce = true;
    }

    let select = selectContainer.querySelector(`#${category}-select`);

    select.lastElementChild.innerHTML = `${dish.name} ${dish.price}&#8381;`;
    select.firstElementChild.value = dish.keyword; // hidden input
    selectContainer.querySelector(".select > .price")
        .innerHTML = `${chosenDishes.calculatePrice()}&#8381;`;
}

async function loadDishes(url) {
    let response = await fetch(url);
    let json = await response.json();
    for (let elem of json) {
        dishes.push(new Dish(elem))
    }
}

function submitHandler(event) {
    if (!chosenDishes.isCombo()) {
        document.body.append(chosenDishes.createHTMLNotification());

        event.preventDefault();
        return false;
    }

    event.currentTarget.submit();
}

function onloadHandler() {
    loadDishes(apiUrl).then(
        () => {
            dishes.sort((a, b) => a.name.localeCompare(b.name));
            for (let elem of dishes) {
                let container = document
                    .querySelector(`#${elem.category} > .dishes`);
                let card = elem.createHTMLCard(addDish);
                container.append(card);
            }
        }
    );
}

window.onload = onloadHandler;
document.querySelectorAll(".filter-button")
    .forEach((value) => value.onclick = filter);
document.getElementById("order-form").addEventListener("submit", submitHandler);