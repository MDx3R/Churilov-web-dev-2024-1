export class Dish {
    constructor(keyword, name, price, weight, category, image) {
        this.keyword = keyword;
        this.name = name;
        this.price = price;
        this.category = category;
        this.weight = weight;
        this.image = image;
    }

    createHTMLCard() {
        return `
            <div class="dish" data-dish="${this.keyword}">
                <img src="${this.image}" alt="${this.name}" class="dish_img">
                <p class="price">${this.price}&#8381;</p>
                <p class="name">${this.name}</p>
                <p class="weight">${this.weight} г</p>
                <button class="add">Добавить</button>
            </div>
            `;
    }
}

export const dishes = [
    // Супы
    new Dish(
        "gazpacho", 
        "Гаспачо", 
        195, 
        350, 
        "soups", 
        "../images/menu/soups/gazpacho.jpg"
    ),
    new Dish(
        "mushroom-soup", 
        "Грибной суп-пюре", 
        185, 
        330, 
        "soups", 
        "../images/menu/soups/mushroom_soup.jpg"
    ),
    new Dish(
        "norwegian-soup", 
        "Норвежский суп", 
        270, 
        330, 
        "soups", 
        "../images/menu/soups/norwegian_soup.jpg"
    ),

    // Основные блюда
    new Dish(
        "fried-potatoes-with-mushrooms", 
        "Жареная картошка с грибами", 
        150, 
        350, 
        "main-course", 
        "../images/menu/main_course/friedpotatoeswithmushrooms1.jpg"
    ),
    new Dish(
        "lasagna", 
        "Лазанья", 
        385, 
        310, 
        "main-course", 
        "../images/menu/main_course/lasagna.jpg"
    ),
    new Dish(
        "chicken-cutlets-and-mashed-potatoes", 
        "Котлеты из курицы с картофельным пюре", 
        225, 
        280, 
        "main-course", 
        "../images/menu/main_course/chickencutletsandmashedpotatoes.jpg"
    ),

    // Напитки
    new Dish(
        "orange-juice", 
        "Апельсиновый сок", 
        120, 
        300, 
        "beverages", 
        "../images/menu/beverages/orangejuice.jpg"
    ),
    new Dish(
        "apple-juice", 
        "Яблочный сок", 
        90, 
        300, 
        "beverages", 
        "../images/menu/beverages/applejuice.jpg"
    ),
    new Dish(
        "carrot-juice", 
        "Морковный сок", 
        110, 
        300, 
        "beverages", 
        "../images/menu/beverages/carrotjuice.jpg"
    ),
];