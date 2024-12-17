import {Order} from '../modules/orders.js';
import {listOrders, putOrder, deleteOrder} from '../modules/api.js';
import {isOrderTimeValid} from '../modules/validators.js';
import {
    createHTMLOrderCard, 
    createHTMLOrderViewModal,
    createHTMLOrderEditModal,
    createHTMLOrderRemoveModal,
    createHTMLNotification,
    createHTMLSuccessNotification,
    createHTMLErrorNotification,
} from '../modules/components.js';

function removeHandler(event) {
    let main = event.currentTarget.parentElement.parentElement;
    let modal = main.parentElement;
    let order = main.order;

    deleteOrder(order.id)
        .then((result) => {
            let message = createHTMLSuccessNotification(
                "Заказ успешно изменён!"
            );
            order.card.remove();

            modal.remove();
            document.body.append(message);
        })
        .catch((error) => {
            let message = createHTMLErrorNotification(error.message);
            document.body.append(message);
        });
}

function viewOrder(event) {
    let order = event.currentTarget
        .parentElement.parentElement.parentElement.order;
    document.body.append(createHTMLOrderViewModal(order));
    console.log("viewOrder()");
}

function editOrder(event) {
    let order = event.currentTarget
        .parentElement.parentElement.parentElement.order;
    document.body.append(createHTMLOrderEditModal(order, saveHandler));
    console.log("editOrder()");
}

function removeOrder(event) {
    let order = event.currentTarget
        .parentElement.parentElement.parentElement.order;
    document.body.append(createHTMLOrderRemoveModal(order, removeHandler));
    console.log("removeOrder()");
}

function saveHandler(event) {
    let main = event.currentTarget.parentElement.parentElement;
    let modal = main.parentElement;
    let order = main.order;

    let form = document.getElementById("order-form");

    if (form.elements["delivery_type"].value == "by_time"
        && !isOrderTimeValid(form.elements["delivery_time"].value)
    ) {
        document.body.append(
            createHTMLNotification(
                "Установите правильное время заказа.", 
                "Окей 👌"
            ));

        return;
    }

    let formData = new FormData(form);

    console.log(...formData);

    putOrder(order.id, formData)
        .then((result) => {
            let message = createHTMLSuccessNotification(
                "Заказ успешно изменён!"
            );
            order.card.replaceWith(createHTMLOrderCard(
                result,
                viewOrder, 
                editOrder, 
                removeOrder
            ));

            modal.remove();
            document.body.append(message);
        })
        .catch(() => {
            let message = createHTMLErrorNotification(error.message);
            document.body.append(message);
        });
}

function onloadHandler() {
    listOrders().then(
        (result) => {
            let table = document.getElementById("order-table");
            for (let order of result) {
                let card = createHTMLOrderCard(
                    order, 
                    viewOrder, 
                    editOrder, 
                    removeOrder
                );
                table.append(card);
            }
        }
    );
}

window.onload = onloadHandler;