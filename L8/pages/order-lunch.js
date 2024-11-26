import {
    apiUrl, 
    apiKey,
    Dish, 
    dishes, 
    chosenDishes, 
    loadDishes, 
    createHTMLNotification
} from '../config.js';

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

function createHTMLSuccessNotification(text) {
    return createHTMLNotification(text, "Окей 👌");
}

function createHTMLErrorNotification(error) {
    return createHTMLNotification(error, "Окей 😔");
}

async function submit() {
    let form = document.getElementById("order-form");
    let formData = new FormData(form);
    formData.set("subscribe", Number(formData.get("subscribe") == "on"));

    console.log(formData);

    let message = null;

    try {
        let response = await fetch(apiUrl + `/orders?api_key=${apiKey}`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            },
        });
        
        let json = await response.json();

        if (!response.ok) {
            console.log("Ошибка: ", json.message);
            message = createHTMLErrorNotification(
                `Ошибка сети ${response.status}`);
        } else {
            console.dir(json);
            console.log("Успешно: ", json.message);
            message = createHTMLSuccessNotification("Запрос выполнен успешно!");
            // for (let dish of chosenDishes.getChosen()) {
            //     processDish(dish, false);
            // }
        }
    } catch (error) {
        message = createHTMLErrorNotification(
            `Внутренняя ошибка ${error.message}`);
    }
    document.body.append(message);
}

function submitHandler(event) {
    if (!chosenDishes.isCombo()) {
        document.body.append(
            createHTMLNotification(chosenDishes.comboText(), "Окей 👌"));

        event.preventDefault();
        return false;
    }

    submit();

    event.preventDefault();
    return false;
}

function onloadHandler() {
    loadDishes(apiUrl + "/dishes").then(
        () => {
            dishes.sort((a, b) => a.name.localeCompare(b.name));
            chosenDishes.load(dishButtonHandler);
            for (let dish of chosenDishes.getChosen()) {
                let container = document.querySelector('.dishes');
                container.append(dish.createHTMLCard(dishButtonHandler));

                // Устанавливаем отображение выбранного блюда без класса
                dish.setChosen(false);

                updateOrderSummary(dish, true);
            }
        }
    );
}

window.onload = onloadHandler;
document.getElementById("order-form").addEventListener("submit", submitHandler);