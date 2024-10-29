import {Dish, dishes} from './dish.js';

let chosenOnce = false;

let chosenDishes = {
    "soups": null,
    "main-course": null,
    "beverages": null
};

function addDish(event) {
    function calculatePrice() {
        let price = 0;
        for (let x of ["soups", "main-course", "beverages"]) {
            let elem = chosenDishes[x]?.dish;
            if (elem) price += elem.price;
        }
        return price;
    }

    let dishContainer = event.target.parentElement;
    let dish = dishContainer.dish;
    
    if (chosenDishes[dish.category]) {
        chosenDishes[dish.category].style.border = "none";
    }
    chosenDishes[dish.category] = dishContainer;

    dishContainer.style.border = "2px solid tomato";

    let selectContainer = document.querySelector(".select-container");
    if (!chosenOnce) {
        document.querySelector(".to-hide").hidden = true;
        selectContainer.hidden = false;
        chosenOnce = true;
    }

    let select = selectContainer.querySelector(`#${dish.category}-select`);

    select.lastElementChild.innerHTML = `${dish.name} ${dish.price}&#8381;`;
    select.firstElementChild.value = dish.keyword; // hidden input
    selectContainer.querySelector(".select > .price")
        .innerHTML = `${calculatePrice()}&#8381;`;
}

function displayDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name.attr));
    for (let elem of dishes) {
        let container = document.querySelector(`#${elem.category} > .dishes`);
        container.insertAdjacentHTML("beforeend", elem.createHTMLCard());
        container.lastElementChild.dish = elem; // card itself
        container.lastElementChild.lastElementChild.onclick = addDish; // button
    }
}

window.onload = displayDishes;