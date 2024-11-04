export class Dish {
    constructor(keyword, name, price, weight, category, image, kind) {
        this.keyword = keyword;
        this.name = name;
        this.price = price;
        this.category = category;
        this.weight = weight;
        this.image = image;
        this.kind = kind;
    }

    createHTMLCard() {
        return `
            <div class="dish" data-dish="${this.keyword}" 
                    data-kind="${this.kind}">
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
        "../../images/menu/soups/gazpacho.jpg",
        "veg"
    ),
    new Dish(
        "mushroom-soup", 
        "Грибной суп-пюре", 
        185, 
        330, 
        "soups", 
        "../../images/menu/soups/mushroom_soup.jpg",
        "veg"
    ),
    new Dish(
        "norwegian-soup", 
        "Норвежский суп", 
        270, 
        330, 
        "soups", 
        "../../images/menu/soups/norwegian_soup.jpg",
        "fish"
    ),
    new Dish(
        "ramen", 
        "Рамен", 
        375, 
        425, 
        "soups", 
        "../../images/menu/soups/ramen.jpg",
        "meat"
    ),
    new Dish(
        "tomyum", 
        "Том ям с креветками", 
        650, 
        500, 
        "soups", 
        "../../images/menu/soups/tomyum.jpg",
        "fish"
    ),
    new Dish(
        "chicken-soup", 
        "Куриный суп", 
        330, 
        350, 
        "soups", 
        "../../images/menu/soups/chicken.jpg",
        "meat"
    ),

    // Основные блюда
    new Dish(
        "fried-potatoes-with-mushrooms", 
        "Жареная картошка с грибами", 
        150, 
        350, 
        "main-course", 
        "../../images/menu/main_course/friedpotatoeswithmushrooms1.jpg",
        "veg"
    ),
    new Dish(
        "lasagna", 
        "Лазанья", 
        385, 
        310, 
        "main-course", 
        "../../images/menu/main_course/lasagna.jpg",
        "meat"
    ),
    new Dish(
        "chicken-cutlets-and-mashed-potatoes", 
        "Котлеты из курицы с картофельным пюре", 
        225, 
        280, 
        "main-course", 
        "../../images/menu/main_course/chickencutletsandmashedpotatoes.jpg",
        "meat"
    ),
    new Dish(
        "fish-cutlets-with-rice", 
        "Рыбная котлета с рисов и спаржей", 
        320, 
        270, 
        "main-course", 
        "../../images/menu/main_course/fishrice.jpg",
        "fish"
    ),
    new Dish(
        "pizza-margatita", 
        "Котлеты из курицы с картофельным пюре", 
        450, 
        470, 
        "main-course", 
        "../../images/menu/main_course/pizza.jpg",
        "meat"
    ),
    new Dish(
        "shrimp-pasta", 
        "Паста к креветками", 
        340, 
        280, 
        "main-course", 
        "../../images/menu/main_course/shrimppasta.jpg",
        "fish"
    ),

    // Салаты и стартеры
    new Dish(
        "korean-salad-with-vegetables-and-eggs", 
        "Корейский салат с овощами и яйцов", 
        330, 
        250, 
        "salads", 
        "../../images/menu/salads_starters/saladwithegg.jpg",
        "meat"
    ),
    new Dish(
        "caesar", 
        "Цезарь с цыпленком", 
        370, 
        220, 
        "salads", 
        "../../images/menu/salads_starters/caesar.jpg",
        "meat"
    ),
    new Dish(
        "caprese", 
        "Капрезе с моцареллой", 
        350, 
        235, 
        "salads", 
        "../../images/menu/salads_starters/caprese.jpg",
        "veg"
    ),
    new Dish(
        "tuna-salad", 
        "Салат с тунцом", 
        480, 
        250, 
        "salads", 
        "../../images/menu/salads_starters/tunasalad.jpg",
        "fish"
    ),
    new Dish(
        "french-fries-with-Caesar-sauce", 
        "Картофель фри с соусом Цезарь", 
        280, 
        235, 
        "salads", 
        "../../images/menu/salads_starters/frenchfries1.jpg",
        "veg"
    ),
    new Dish(
        "french-fries-with-ketchup", 
        "Картофель фри с кетчупом", 
        260, 
        235, 
        "salads", 
        "../../images/menu/salads_starters/frenchfries2.jpg",
        "veg"
    ),

    // Напитки
    new Dish(
        "orange-juice", 
        "Апельсиновый сок", 
        120, 
        300, 
        "beverages", 
        "../../images/menu/beverages/orangejuice.jpg",
        "cold"
    ),
    new Dish(
        "apple-juice", 
        "Яблочный сок", 
        90, 
        300, 
        "beverages", 
        "../../images/menu/beverages/applejuice.jpg",
        "cold"
    ),
    new Dish(
        "carrot-juice", 
        "Морковный сок", 
        110, 
        300, 
        "beverages", 
        "../../images/menu/beverages/carrotjuice.jpg",
        "cold"
    ),
    new Dish(
        "cappuccino", 
        "Капучино", 
        180, 
        300, 
        "beverages", 
        "../../images/menu/beverages/cappuccino.jpg",
        "hot"
    ),
    new Dish(
        "green-tea", 
        "Зеленый чай", 
        100,
        300, 
        "beverages", 
        "../../images/menu/beverages/greentea.jpg",
        "hot"
    ),
    new Dish(
        "black-tea", 
        "Черный чай", 
        90,
        300, 
        "beverages", 
        "../../images/menu/beverages/tea.jpg",
        "hot"
    ),

    // Дессерты
    new Dish(
        "baklava", 
        "Пахвала", 
        220,
        300, 
        "desserts", 
        "../../images/menu/desserts/baklava.jpg",
        "medium"
    ),
    new Dish(
        "cheesecake", 
        "Чизкейк", 
        240,
        125, 
        "desserts", 
        "../../images/menu/desserts/checheesecake.jpg",
        "small"
    ),
    new Dish(
        "chocolate-cheesecake", 
        "Шоколандый чизкейк", 
        260,
        125, 
        "desserts", 
        "../../images/menu/desserts/chocolatecheesecake.jpg",
        "small"
    ),
    new Dish(
        "chocolate-cake", 
        "Шоколандый торт", 
        270,
        140, 
        "desserts", 
        "../../images/menu/desserts/chocolatecake.jpg",
        "small"
    ),
    new Dish(
        "three-donuts", 
        "Пончики (3 штуки)", 
        410,
        350, 
        "desserts", 
        "../../images/menu/desserts/donuts2.jpg",
        "medium"
    ),
    new Dish(
        "six-donuts", 
        "Пончики (6 штук)", 
        650,
        700, 
        "desserts", 
        "../../images/menu/desserts/donuts.jpg",
        "big"
    ),
];