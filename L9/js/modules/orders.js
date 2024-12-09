import {
    getDish,
} from './api.js';

const cachedDishes = {};

class Order {
    constructor(json) {
        this.id = json.id;
        this.full_name = json.full_name;
        this.delivery_address = json.delivery_address;
        this.delivery_time = json.delivery_time;
        this.delivery_type = json.delivery_type;
        this.phone = json.phone;
        this.email = json.email;
        this.comment = json.comment;
        this.created_at = json.created_at;
        this.updated_at = json.updated_at;
        this.subscribe = json.subscribe;
        this.price = 0;
        this.card = null;
    }

    updateCard() {
        if (!card) return;

        card.replaceWith();
    }

    async loadDishes(json) {
        for (let key of [
            "soup_id", 
            "main_course_id", 
            "salad_id", 
            "drink_id", 
            "dessert_id"
        ]
        ) {
            let dishId = json[key];
            if (!dishId) continue;

            let dish = cachedDishes[dishId];
            if (!dish) {
                dish = await getDish(dishId);
                cachedDishes[dishId] = dish;
            }
            this[key] = dish;
            this.price += dish.price;
        }
    }
}   

export {
    Order,
};