import {
    Dish,
    dishes
} from './dishes.js';

import {
    Order,
} from './orders.js';

const apiUrl = "https://edu.std-900.ist.mospolytech.ru/labs/api";
const apiKey = "e3e17790-c7e0-4eb3-ac85-aa40f4715bf2";

const endpoints = {
    dishes: {
        list: () => `${apiUrl}/dishes`,
        retrive: (id) => `${apiUrl}/dishes/${id}?api_key=${apiKey}`,
    },

    orders: {
        list: () => `${apiUrl}/orders?api_key=${apiKey}`,
        create: () => `${apiUrl}/orders?api_key=${apiKey}`,
        retrive: (id) => `${apiUrl}/orders/${id}?api_key=${apiKey}`,
        update: (id) => `${apiUrl}/orders/${id}?api_key=${apiKey}`,
        delete: (id) => `${apiUrl}/orders/${id}?api_key=${apiKey}`,
    }
};

async function sendRequest(url, data = null) {
    let response = await fetch(url, data);
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}

async function listDishes() {
    let response = await sendRequest(endpoints.dishes.list());

    let arr = [];
    for (let elem of response) {
        arr.push(new Dish(elem));
    }

    return arr;
}

async function getDish(id) {
    let response = await sendRequest(endpoints.dishes.retrive(id));

    return new Dish(response);
}


async function listOrders() {
    let response = await sendRequest(endpoints.orders.list());

    let arr = [];
    for (let elem of response) {
        let order = new Order(elem);
        await order.loadDishes(elem);
        arr.push(order);
    };

    return arr;
}

async function getOrder(id) {
    let response = await sendRequest(endpoints.orders.retrive(id));

    let order = new Order(response);
    await order.loadDishes(response);

    return order;
}

async function postOrder(data) {
    let response = await sendRequest(
        endpoints.orders.create(), 
        {
            method: "POST",
            body: data,
            // headers: {} // headers все ломают
        }
    );

    let order = new Order(response);
    await order.loadDishes(response);

    return order;
}

async function putOrder(id, data) {
    let response = await sendRequest(
        endpoints.orders.update(id), 
        {
            method: "PUT",
            body: data,
            // headers: {} // headers все ломают
        }
    );

    let order = new Order(response);
    await order.loadDishes(response);

    return order;
}

async function deleteOrder(id) {
    let response = await sendRequest(
        endpoints.orders.delete(id),
        {
            method: "DELETE",
            // headers: {} // headers все ломают
        }
    );

    let order = new Order(response);
    await order.loadDishes(response);

    return order;
}

async function loadDishes() { // копируем в общий массив блюд
    (await listDishes()).forEach(element => dishes.push(element));
}

export {
    listDishes,
    getDish, 
    listOrders, 
    getOrder, 
    postOrder, 
    putOrder, 
    deleteOrder,
    loadDishes,
};