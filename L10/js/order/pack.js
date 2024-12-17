import {Dish, dishes, chosenDishes} from '../modules/dishes.js';
import {loadDishes} from '../modules/api.js';
import {createHTMLDishCard} from '../modules/components.js';

// import {apiUrl, Dish, dishes, chosenDishes, loadDishes} from '../config.js';

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

function updateOrderLine(orderLine = null) {
    if (!orderLine) {
        orderLine = document.querySelector(".order-line");
    }

    orderLine.firstElementChild
        .innerHTML = `Итого: ${chosenDishes.calculatePrice()}&#8381;`;

    // Настраиваем режим отображения orderLine кнопки для перехода на оформление
    if (!chosenDishes.isCombo()) {
        orderLine.lastElementChild.innerHTML = chosenDishes.comboText();
        orderLine.lastElementChild.classList.add("disabled");
    } else {
        orderLine.lastElementChild.innerHTML = "Перейти к оформлению";
        orderLine.lastElementChild.classList.remove("disabled");
    }

    // Отображаем контейнер с информацией о заказе, если он скрыт
    orderLine.hidden = !chosenDishes.anyChosen();
}

function dishButtonHandler(event) {
    let dishContainer = event.currentTarget.parentElement;
    let dish = dishContainer.dish;

    console.log(chosenDishes);

    if (chosenDishes[dish.category] == dish) { // remove dish
        chosenDishes.removeDish(dish.category);

    } else { // add dish
        chosenDishes.addDish(dish);
    }
    // Обновляем контейнер с информацией о заказе
    updateOrderLine();
}

function onloadHandler() {
    loadDishes().then(
        () => {
            dishes.sort((a, b) => a.name.localeCompare(b.name));
            chosenDishes.load();
            for (let dish of dishes) {
                let container = document
                    .querySelector(`#${dish.category} > .dishes`);
                let card = createHTMLDishCard(dish, dishButtonHandler);
                container.append(card);
            }
            
            chosenDishes.showChosen();
            updateOrderLine();
        }
    );
}

window.onload = onloadHandler;
document.querySelectorAll(".filter-button")
    .forEach((value) => value.onclick = filter);