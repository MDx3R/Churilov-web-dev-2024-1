import {formatTime, formatDateTime} from './validators.js';

function createHTMLNotification(notificationText, buttonText) {
    let container = document.createElement("div");
    container.className = "notification";
    container.innerHTML = 
        `<p class="notification-text">${notificationText}</p>`;
    let button = document.createElement("button");
    button.className = "notification-button";
    button.innerHTML = buttonText;
    button.onclick = (event) => event.currentTarget.parentElement.remove();
    container.append(button);

    return container;
}

function createHTMLSuccessNotification(text) {
    return createHTMLNotification(text, "Окей 👌");
}

function createHTMLErrorNotification(error) {
    return createHTMLNotification(error, "Окей 😔");
}

function createHTMLDishCard(
    dish, 
    handler = () => console.log("default handler invoked")
) {
    let container = document.createElement("div");
    container.className = "dish";
    container.innerHTML = 
            `<img src="${dish.image}" alt="${dish.name}" class="dish_img">
            <p class="price">${dish.price}&#8381;</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.weight}</p>`;

    container.dish = dish;
    dish.card = container;

    container.dataset.dish = dish.keyword;
    container.dataset.kind = dish.kind;

    let button = document.createElement("button");
    button.className = "add-button";
    button.innerHTML = "Добавить";
    button.onclick = handler;
    
    container.append(button);

    return container;
}

function createHTMLOrderCard(
    order, 
    detailsHandler, 
    editHandler, 
    removeHandler
) {
    let row = document.createElement("tr");
    row.order = order;
    order.card = row;

    function createButton(cls, handler) {
        let button = document.createElement("button");
        button.classList.add(cls);
        button.classList.add("icon-button");
        button.onclick = handler;
        return button;
    }

    let composition = "";
    for (let key of 
        [
            "soup_id", 
            "main_course_id", 
            "salad_id", 
            "drink_id", 
            "dessert_id"
        ]
    ) {
        let dish = order[key];
        if (!dish) continue; 

        if (composition != "") { 
            composition += ", "; 
        }
        composition += dish.name;
    }
    
    row.innerHTML = 
        `<td>${order.id}</td>
        <td>${formatDateTime(order.created_at)}</td>
        <td class="order-composition">${composition}</td>
        <td>${order.price}&#8381;</td>
        <td>${order.delivery_type != "now" ? formatTime(order.delivery_time) 
        : "В течние дня (с 7:00 до 23:00"}
        </td>`;

    let cell = document.createElement("td");
    let container = document.createElement("div");
    container.className = "order-actions";

    container.append(createButton("details-button", detailsHandler));
    container.append(createButton("edit-button", editHandler));
    container.append(createButton("remove-button", removeHandler));

    cell.append(container);
    row.append(cell);

    return row;
}

function createHTMLBaseModal(order, modalName, content, buttons) {
    let container = document.createElement("div");
    container.className = "modal";

    let main = document.createElement("div");
    main.className = "modal-main";
    main.order = order;

    let header = document.createElement("div");
    header.className = "modal-header";
    header.innerHTML = `<h2 class="title">${modalName}</h2>`;

    let button = document.createElement("button");
    button.classList.add("exit-button");
    button.classList.add("icon-button");
    button.onclick = (event) => container.remove();

    header.append(button);
    main.append(header);
    main.insertAdjacentHTML("beforeend", `<hr>`);
    main.append(content);
    main.insertAdjacentHTML("beforeend", `<hr>`);
    main.append(buttons);

    container.append(main);
    return container;
}

function createHTMLModalContent(content) {
    let container = document.createElement("div");
    container.className = "modal-content";
    container.innerHTML = content;

    return container;
}

function createHTMLModalButtons(...buttons) {
    let container = document.createElement("div");
    container.className = "modal-buttons";

    container.append(...buttons);

    return container;
}

function createOrderContactInfo(order, editing = false) {
    function getNameField() {
        let fieldName = "<p>Имя получателя</p>";
        if (editing) {
            return fieldName + `<input type="text" 
                    name="full_name" 
                    id="name-input" 
                    value="${order.full_name}" 
                    required>`;
        }
        return fieldName + `<p>${order.full_name}</p>`;
    }

    function getAddressField() {
        let fieldName = "<p>Адрес доставки</p>";
        if (editing) {
            return fieldName + `<input type="text" 
                    name="delivery_address" 
                    id="address-input" 
                    value="${order.delivery_address}" 
                    required>`;
        }
        return fieldName + `<p>${order.delivery_address}</p>`;
    }

    function getDeliveryTypeField() {
        let fieldName = "<p>Тип доставки</p>";
        if (editing) {
            return fieldName 
                + `<fieldset class="radio-set">
                    <div>
                        <input type="radio" 
                            name="delivery_type" id="fast-radio" value="now" 
                            ${order.delivery_type == "now" ? "checked" : ""} 
                            required>
                        <label for="fast-radio">Как можно скорее</label>
                    </div>
                    <div>
                        <input type="radio" 
                        name="delivery_type" id="concrete-radio" value="by_time"
                            ${order.delivery_type == "by_time" ? "checked" : ""}
                            >
                        <label for="concrete-radio">К указанному времени</label>
                    </div>
                </fieldset>`;
        }
        return "";
    }

    function getDeliveryTimeField() {
        let fieldName = "<p>Время доставки</p>";
        if (editing) {
            return fieldName + `<input type="time" 
                    name="delivery_time" 
                    id="time-input"
                    min="7:00" max="23:00" step="300"
                    value="${formatTime(order.delivery_time)}" 
                    required>`;
        }
        if (order.delivery_type == "now") {
            return fieldName + `<p>В течние дня (с 7:00 до 23:00)</p>`;
        }
        return fieldName + `<p>${formatTime(order.delivery_time)}</p>`;
    }

    function getPhoneField() {
        let fieldName = "<p>Телефон</p>";
        if (editing) {
            return fieldName + `<input type="tel" 
                    name="phone" 
                    id="phone-input" 
                    value="${order.phone}" 
                    required>`;
        }
        return fieldName + `<p>${order.phone}</p>`;
    }

    function getEmailField() {
        let fieldName = "<p>Email</p>";
        if (editing) {
            return fieldName + `<input type="email" 
                    name="email" 
                    id="email-input" 
                    value="${order.email}" 
                    required>`;
        }
        return fieldName + `<p>${order.email}</p>`;
    }

    function getCommentField() {
        let fieldName = '<p class="content-title">Комментарий</p>';
        if (editing) {
            return fieldName + `<textarea
                    name="comment" 
                    id="comment" 
                    rows="2">${order.comment ? order.comment : ""}</textarea>`;
        }
        return fieldName + `<p>${order.comment ? order.comment : ""}</p>`;
    }

    return `<div class="content-row">
                <p>Дата оформления</p>
                <p>${formatDateTime(order.created_at)}</p>
            </div>
            <p class="content-title">Доставка</p>
            <div class="content-table table">
                <div class="content-row">${getNameField()}</div>

                <div class="content-row">${getAddressField()}</div>

                <div class="content-row">${getDeliveryTypeField()}</div>

                <div class="content-row" ${
    order.delivery_type == "now" ? "hidden" : ""}>
                    ${getDeliveryTimeField()}
                </div>

                <div class="content-row">${getPhoneField()}</div>

                <div class="content-row">${getEmailField()}</div>
            </div>
            ${getCommentField()}`;
}

function createOrderDishesInfo(order) {
    const composition = {
        "Суп": order["soup_id"],
        "Основное блюдо": order["main_course_id"],
        "Салат или стартер": order["salad_id"],
        "Напиток": order["drink_id"],
        "Десерт": order["dessert_id"],
    };

    function getDishesFields() {
        let dishes = "";
        for (let [key, value] of Object.entries(composition)) {
            if (!value) continue;

            dishes += 
                `<div class="content-row">
                <p>${key}</p><p>${value.name} (${value.price}&#8381;)</p>
                </div>`;
        }
        return dishes;
    }

    return `<div class="content-table table">${getDishesFields()}</div>`;
}

function createHTMLOrderViewModal(order) {
    function createModalContent() {
        let content = 
            createOrderContactInfo(order) 
            + `<p class="content-title">Состав заказа</p>`
            + createOrderDishesInfo(order)
            + `<p class="content-title">Стоимость: ${order.price}&#8381;</p>`;

        return createHTMLModalContent(content);
    }

    function createModalButtons() {
        let button = document.createElement("button");
        button.className = "modal-button";
        button.innerHTML = "Ок";
        button.onclick = (event) => 
            event.currentTarget
                .parentElement.parentElement.parentElement.remove();

        return createHTMLModalButtons(button);
    }

    return createHTMLBaseModal(
        order,
        "Просмотр заказа", 
        createModalContent(),
        createModalButtons()
    );
}

function createHTMLOrderEditModal(order, saveHandler) {
    function createModalContent() {
        let content = 
            `<form class="form" id="order-form">
                ${createOrderContactInfo(order, true)}
            </form>`
            + `<p class="content-title">Состав заказа</p>`
            + createOrderDishesInfo(order)
            + `<p class="content-title">Стоимость: ${order.price}&#8381;</p>`;

        let container = createHTMLModalContent(content);
        container.querySelector("#fast-radio").onchange = (event) => {
            document.getElementById('time-input')
                .parentElement.hidden = true;
        };
        container.querySelector("#concrete-radio").onchange = (event) => {
            document.getElementById('time-input')
                .parentElement.hidden = false;
        };

        return container;
    }

    function createModalButtons() {
        let cancel = document.createElement("button");
        cancel.className = "modal-button";
        cancel.innerHTML = "Отмена";
        cancel.onclick = (event) => 
            event.currentTarget
                .parentElement.parentElement.parentElement.remove();

        let save = document.createElement("button");
        save.classList.add("modal-button");
        save.classList.add("confirm-save-button");
        save.innerHTML = "Сохранить";
        save.onclick = saveHandler;

        return createHTMLModalButtons(cancel, save);
    }

    return createHTMLBaseModal(
        order,
        "Редактирование заказа", 
        createModalContent(),
        createModalButtons()
    );
}

function createHTMLOrderRemoveModal(order, removeHandler) {
    function createModalContent() {
        let content = "<p>Вы уверены, что хотите удалить заказ?</p>";

        return createHTMLModalContent(content);
    }

    function createModalButtons() {
        let cancel = document.createElement("button");
        cancel.className = "modal-button";
        cancel.innerHTML = "Отмена";
        cancel.onclick = (event) => 
            event.currentTarget
                .parentElement.parentElement.parentElement.remove();

        let save = document.createElement("button");
        save.classList.add("modal-button");
        save.classList.add("confirm-remove-button");
        save.innerHTML = "Ок";
        save.onclick = removeHandler;

        return createHTMLModalButtons(cancel, save);
    }

    return createHTMLBaseModal(
        order,
        "Редактирование заказа", 
        createModalContent(),
        createModalButtons()
    );
}

export {
    createHTMLNotification,
    createHTMLSuccessNotification,
    createHTMLErrorNotification,
    createHTMLDishCard,
    createHTMLOrderCard,
    createHTMLOrderViewModal,
    createHTMLOrderEditModal,
    createHTMLOrderRemoveModal,
};