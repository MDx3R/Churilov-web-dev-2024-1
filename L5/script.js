import {Dish, dishes} from './dish.js';

let chosenOnce = false;

let chosenDishes = {};

function filterDishes(category, kind = null) {
    let container = document.querySelector(`#${category} > .dishes`);
    for (let elem of container.children) {
        if (kind === null || kind === elem.dataset.kind) elem.hidden = false;
        else elem.hidden = true;
    }
}

function filter(event) {
    let target = event.currentTarget;
    console.log(target.parentElement.parentElement.id);
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
    function calculatePrice() {
        let price = 0;
        for (let x of Object.keys(chosenDishes)) {
            let elem = chosenDishes[x]?.dish;
            if (elem) price += elem.price;
        }
        return price;
    }
    
    console.log(event.currentTarget);

    let dishContainer = event.target.parentElement;
    let dish = dishContainer.dish;
    let category = dish.category;
    
    if (chosenDishes[category]) {
        chosenDishes[category].style.border = "none";
    }
    chosenDishes[category] = dishContainer;

    dishContainer.style.border = "2px solid tomato";

    let selectContainer = document.querySelector(".select-container");
    if (!chosenOnce) {
        document.querySelector(".to-hide").hidden = true;
        selectContainer.hidden = false;
        chosenOnce = true;
    }

    let select = selectContainer.querySelector(`#${category}-select`);

    select.lastElementChild.innerHTML = `${dish.name} ${dish.price}&#8381;`;
    select.firstElementChild.value = dish.keyword; // hidden input
    selectContainer.querySelector(".select > .price")
        .innerHTML = `${calculatePrice()}&#8381;`;
}

function onloadHandler() { // displays dishes
    dishes.sort((a, b) => a.name.localeCompare(b.name));
    for (let elem of dishes) {
        chosenDishes[elem.category] = null;

        let container = document.querySelector(`#${elem.category} > .dishes`);

        container.insertAdjacentHTML("beforeend", elem.createHTMLCard());
        container.lastElementChild.dish = elem; // card itself
        container.lastElementChild.lastElementChild.onclick = addDish; // button
    }
}

window.onload = onloadHandler;
document.querySelectorAll(".filter-button")
    .forEach((value) => value.onclick = filter);