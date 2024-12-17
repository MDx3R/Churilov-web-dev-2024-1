const dishes = [];

const chosenDishes = {
    "soup": null,
    "main-course": null,
    "salad": null,
    "drink": null,
    "dessert": null,

    chosenOnce: false,

    load() {
        for (let x of ["soup", "main-course", "salad", "drink", "dessert"]) {
            let id = localStorage.getItem(x);
            if (id) {
                let elem = dishes.find(
                    (element) => element.id == id);
                if (elem) {
                    this[x] = elem;
                }
            }
        }
    },

    clear() {
        for (let x of ["soup", "main-course", "salad", "drink", "dessert"]) {
            localStorage.removeItem(category);
            this[x] = null;
        }
    },

    getChosen() {
        let arr = [];
        for (let x of ["soup", "main-course", "salad", "drink", "dessert"]) {
            let dish = this[x];
            if (dish) arr.push(dish);
        }
        return arr;
    },

    showChosen() {
        for (let x of ["soup", "main-course", "salad", "drink", "dessert"]) {
            let dish = this[x];
            if (dish) dish.setChosen();
        }
    },

    removeDish(category) {
        // Удаляем запись из localStorage
        localStorage.removeItem(category);

        // Убираем стиль для отображения выбранного блюда
        this[category]?.removeChosen();

        this[category] = null;
    },

    addDish(dish) {
        let category = dish.category;

        // Удаляем прошлое блюдо
        this.removeDish(category);

        // Добавляем запись из localStorage
        localStorage.setItem(category, dish.id);

        // Выбираем текущее блюдо для отображения 
        this[category] = dish;

        // Добавляем стиль для отображения выбранного блюда
        dish.setChosen();
    },

    anyChosen() {
        return (this.soup 
            || this["main-course"] 
            || this.salad
            || this.drink
            || this.dessert) != null;
    },

    isCombo() {
        let main = this["main-course"];
        return ((this.soup && main && this.salad && this.drink) 
            || (this.soup && main && this.drink)
            || (this.soup && this.salad && this.drink)
            || (main && this.salad && this.drink)
            || (main && this.drink)) != null;
    },

    calculatePrice() {
        let price = 0;
        for (let x of Object.keys(this)) {
            let elem = chosenDishes[x];
            if (elem?.price) price += elem.price;
        }
        return price;
    },

    comboText() {
        let a = "";
        let main = this["main-course"];
        if (!this.drink) {
            a = "Выберите напиток";
        }
        if (!(this.soup || main || this.salad || this.drink)) {
            a = "Ничего не выбрано. Выберите блюда для заказа";
        }
        if ((this.drink || this.dessert) && !main) {
            a = "Выберите главное блюдо";
        }
        if (this.salad && !(this.soup || main)) {
            a = "Выберите суп или главное блюдо";
        }
        if (this.soup && !(main || this.salad)) {
            a = "Выберите главное блюдо или салат/стартер";
        }
        return a;
    },
};

class Dish {
    constructor(json) {
        this.id = json.id;
        this.keyword = json.keyword;
        this.name = json.name;
        this.price = json.price;
        this.category = json.category;
        this.weight = json.count;
        this.image = json.image;
        this.kind = json.kind;
        this.card = null;
    }

    removeChosen() {
        if (!this.card) return;

        let dishContainer = this.card;

        dishContainer.classList.remove("chosen-dish");
        dishContainer.lastElementChild.innerHTML = "Добавить";
    }
    
    setChosen(setClass = true) {
        if (!this.card) return;

        let dishContainer = this.card;
        
        if (setClass) dishContainer.classList.add("chosen-dish");
        dishContainer.lastElementChild.innerHTML = "Удалить";
    }

    toJson() {
        return JSON.stringify(meetup, function replacer(key, value) {
            return (key == 'card') ? undefined : value;
        });
    }
}

export {
    Dish,
    dishes,
    chosenDishes,
};