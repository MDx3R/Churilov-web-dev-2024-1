import {Dish, dishes, chosenDishes} from './config.js';

const apiUrl = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

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

function addDishv2(event, dishContainer, dish) {
    let category = dish.category;

    // Если блюдо уже было выбрано, удаляем класс для выбранного блюда
    if (chosenDishes[category]) {
        chosenDishes[category].classList.remove("chosen-dish");
    }
    // Выбираем текущее блюдо для отображения 
    chosenDishes[category] = dishContainer;
    dishContainer.classList.add("chosen-dish");

    let selectContainer = document.querySelector(".select-container");
    let orderLine = document.querySelector(".order-line");
    if (!chosenDishes.chosenOnce) {
        // Прячем плейсхолдеры для отсутствия блюд
        document.querySelectorAll(".to-hide")
            .forEach((value) => value.hidden = true);
        
        // Отображаем контейнер с информацией о заказе
        orderLine.hidden = false;

        // Отображаем контейнер с выбранными блюдами 
        selectContainer.hidden = false;

        // 
        chosenDishes.chosenOnce = true;
    }

    let select = selectContainer.querySelector(`#${category}-select`);

    select.lastElementChild.innerHTML = `${dish.name} ${dish.price}&#8381;`;
    select.firstElementChild.value = dish.keyword; // hidden input
    selectContainer.querySelector(".select > .price")
        .innerHTML = `${chosenDishes.calculatePrice()}&#8381;`;
}

function dishButtonHandler(event) {
    let dishContainer = event.currentTarget.parentElement;
    let dish = dishContainer.dish;

    if (chosenDishes[dish.category] == dishContainer) { // remove

    } else { // add
        addDishv2(event, dishContainer, dish);
    }
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
        dishes.push(new Dish(elem));
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
            chosenDishes.load();
        }
    );
}

window.onload = onloadHandler;
document.querySelectorAll(".filter-button")
    .forEach((value) => value.onclick = filter);
document.getElementById("order-form").addEventListener("submit", submitHandler);