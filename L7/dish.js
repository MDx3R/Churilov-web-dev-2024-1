export class Dish {
    constructor(json) {
        this.keyword = json.keyword;
        this.name = json.name;
        this.price = json.price;
        this.category = json.category;
        this.weight = json.count;
        this.image = json.image;
        this.kind = json.kind;
    }

    createHTMLCard(handler) {
        let container = document.createElement("div");
        container.className = "dish";
        container.innerHTML = 
                `<img src="${this.image}" alt="${this.name}" class="dish_img">
                <p class="price">${this.price}&#8381;</p>
                <p class="name">${this.name}</p>
                <p class="weight">${this.weight}</p>`;
        container.dish = this;
        container.dataset.dish = this.keyword;
        container.dataset.kind = this.kind;
        let button = document.createElement("button");
        button.className = "add-button";
        button.innerHTML = "Добавить";
        button.onclick = handler;
        container.append(button);

        return container;
    }
}

export const dishes = [];