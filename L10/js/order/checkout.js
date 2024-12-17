import {Dish, dishes, chosenDishes} from '../modules/dishes.js';
import {Order} from '../modules/orders.js';
import {loadDishes, postOrder} from '../modules/api.js';
import {isOrderTimeValid} from '../modules/validators.js';
import {
    createHTMLDishCard, 
    createHTMLNotification,
    createHTMLSuccessNotification,
    createHTMLErrorNotification,
} from '../modules/components.js';

let hiddenOnce = false;

let dishSummaryDefaultValues = {
    "soup": "Суп не выбран",
    "main-course": "Главное блюдо не выбрано",
    "salad": "Салат или стартер не выбран",
    "drink": "Напиток не выбран",
    "dessert": "Десерт не выбран"
};

function updateOrderSummary(dish, adding, orderSummary = null) {
    if (!orderSummary) {
        orderSummary = document.querySelector(".select-container");
    }
    let select = orderSummary.querySelector(`#${dish.category}-select`);
    if (adding) {
        select.lastElementChild.innerHTML = `${dish.name} ${dish.price}&#8381;`;
        select.firstElementChild.value = dish.id; // hidden input
    } else {
        select.lastElementChild.innerHTML 
            = dishSummaryDefaultValues[dish.category];
        select.firstElementChild.value = ''; // hidden input
    }

    orderSummary.querySelector(".select > .price")
        .innerHTML = `${chosenDishes.calculatePrice()}&#8381;`;

    let chosen = chosenDishes.anyChosen();
    if ((!chosen && hiddenOnce) || (!hiddenOnce && chosen)) {
        // Показываем плейсхолдеры для отсутствия блюд при chosen == false
        // Прячем плейсхолдеры для отсутствия блюд при chosen == true
        document.querySelectorAll(".to-hide")
            .forEach((value) => value.hidden = chosen);
        hiddenOnce = chosen;
    }
    // Скрываем контейнер с выбранными блюдами при chosen == false
    // Показываем контейнер с выбранными блюдами при chosen == true
    orderSummary.hidden = !chosen;
}

function processDish(dish, adding) {
    if (!adding) {
        chosenDishes.removeDish(dish.category);
    } else {
        chosenDishes.addDish(dish);
    }
    dish.card.hidden = !adding;
    updateOrderSummary(dish, adding);
}

function dishButtonHandler(event) {
    let dishContainer = event.currentTarget.parentElement;
    let dish = dishContainer.dish;
    
    processDish(dish, chosenDishes[dish.category] != dish);
}

async function submit() {
    let form = document.getElementById("order-form");
    let formData = new FormData(form);
    formData.set(
        "subscribe",
        String(Number(formData.get("subscribe") == "on"))
    );

    console.log(...formData);

    postOrder(formData)
        .then(() => {
            let message = createHTMLSuccessNotification(
                "Запрос выполнен успешно!");

            for (let dish of chosenDishes.getChosen()) {
                processDish(dish, false);
            }
            document.body.append(message);
        })
        .catch((error) => {
            let message = createHTMLErrorNotification(error.message);
            document.body.append(message);
        });
}

function submitHandler(event) {
    if (!chosenDishes.isCombo()) {
        document.body.append(
            createHTMLNotification(chosenDishes.comboText(), "Окей 👌"));

        event.preventDefault();
        return false;
    }

    let form = document.forms[0];

    if (form.elements["delivery_type"].value == "by_time"
        && !isOrderTimeValid(form.elements["delivery_time"].value)
    ) {
        document.body.append(
            createHTMLNotification(
                "Установите правильное время заказа.", 
                "Окей 👌"
            ));

        event.preventDefault();
        return false;
    }

    submit();

    event.preventDefault();
    return true;
}

function onloadHandler() {
    loadDishes().then(
        () => {
            dishes.sort((a, b) => a.name.localeCompare(b.name));
            chosenDishes.load(dishButtonHandler);
            for (let dish of chosenDishes.getChosen()) {
                let container = document.querySelector('.dishes');
                container.append(createHTMLDishCard(dish, dishButtonHandler));

                // Устанавливаем отображение выбранного блюда без класса
                dish.setChosen(false);

                updateOrderSummary(dish, true);
            }
        }
    );
}

window.onload = onloadHandler;
document.getElementById("order-form").addEventListener("submit", submitHandler);