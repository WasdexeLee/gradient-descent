CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL UNIQUE, 
    user_password VARCHAR(50) NOT NULL, 
    user_email VARCHAR(50) NOT NULL,
    user_address VARCHAR(150) NOT NULL, 
    user_phone VARCHAR(30) NOT NULL, 
    user_notification BOOLEAN NOT NULL,
    user_operator BOOLEAN NOT NULL DEFAULT FALSE
)ENGINE = InnoDB;


INSERT INTO User 
VALUES
(NULL, 'admin', 'admin', 'admin@gmail.com', '99, Jalan 99, Selangor', '013-189 0189', TRUE, DEFAULT),
(NULL, 'capy', 'loves', 'food@gmail.com', '38, Jalan Capy, Kuala Lumpur', '019-506 6516', TRUE, DEFAULT),
(NULL, 'zoomer', 'lazyyi', 'zoomer33@gmail.com', '199, Jalan Tun Tan Cheng Lock, 41442, Kuala Lumpur', '018-255 0568', TRUE, DEFAULT),
(NULL, 'Chef', 'quick22', 'capyba@gmail.com', '20, Jalan KK, 41222, Selangor', '010-223 9402', FALSE, TRUE)


CREATE TABLE FoodCategory (
    food_category_id INT PRIMARY KEY AUTO_INCREMENT, 
    food_category_name VARCHAR(100) NOT NULL UNIQUE
)ENGINE = InnoDB;


INSERT INTO FoodCategory
VALUES
(NULL, 'Fried'),
(NULL, 'Chicken'),
(NULL, 'Noodle'),
(NULL, 'Drinks'),
(NULL, 'Dessert')


CREATE TABLE Food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL UNIQUE, 
    food_category_id INT NOT NULL, 
    food_description VARCHAR(300) NOT NULL,
    food_price FLOAT NOT NULL,
    food_availability INT NOT NULL DEFAULT 0,
    food_image VARCHAR(150) NOT NULL, 
    food_prep_time INT NOT NULL,
    food_num_sold INT NOT NULL DEFAULT 0,
    FOREIGN KEY(food_category_id) REFERENCES FoodCategory(food_category_id)
)ENGINE = InnoDB;


INSERT INTO Food
VALUES
(NULL, 'Drumstick Fried Chikin Combo', 1, 'Drumstick Korean Fried Chikin (2pcs) Seasoned With One Type of Korean Sauces Served Together With Kimchi French Fries and Kimchi', 18.9, 10, 'food-image/Drumstick Fried Chikin Combo.webp', 30, DEFAULT),
(NULL, 'Soy Garlic (Authentic Korean Flavor)', 1, 'Korean Fried Chicken Only The crispy and tender chicken is coated in a luscious glaze that is both sweet and spicy, creating a delightful taste sensation.', 15.9, 10, 'food-image/Soy Garlic (Authentic Korean Flavor).webp', 30, DEFAULT),
(NULL, 'Tau Fu Fah', 5, 'I Love to Eat TOFFUUUUFAH', 5.9, 10, 'food-image/Tau Fu Fah.webp', 25, DEFAULT),
(NULL, 'Peach Gum Snow Fungus with Longan', 5, 'Nice', 8.9, 10, 'food-image/Peach Gum Snow Fungus with Longan.webp', 15, DEFAULT),
(NULL, 'Tandoori Chicken Rice Half', 2, 'You wanna eat big chicken', 44.9, 10, 'food-image/Tandoori Chicken Rice Half.webp', 20, DEFAULT),
(NULL, 'Pan Mee Soup', 3, 'Broga broga broga broga', 11.4, 10, 'food-image/Pan Mee Soup.webp', 22, DEFAULT),
(NULL, 'Iced Latte', 4, 'Freshly brewed Iced Latte using 100% Arabica coffee beans and fresh milk.', 8.8, 10, 'food-image/Iced Latte.webp', 38, DEFAULT)
