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
(NULL, 'Drumstick Fried Chikin Combo', 1, 'Drumstick Korean Fried Chikin (2pcs) Seasoned With One Type of Korean Sauces Served Together With Kimchi French Fries and Kimchi', 18.9, 10, '../food-image/Drumstick Fried Chikin Combo.webp', 30, DEFAULT),
(NULL, 'Soy Garlic (Authentic Korean Flavor)', 1, 'Korean Fried Chicken Only The crispy and tender chicken is coated in a luscious glaze that is both sweet and spicy, creating a delightful taste sensation.', 15.9, 10, '../food-image/Soy Garlic (Authentic Korean Flavor).webp', 30, DEFAULT),
(NULL, 'Tau Fu Fah', 5, 'I Love to Eat TOFFUUUUFAH', 5.9, 10, '../food-image/Tau Fu Fah.webp', 25, DEFAULT),
(NULL, 'Peach Gum Snow Fungus with Longan', 5, 'Nice', 8.9, 10, '../food-image/Peach Gum Snow Fungus with Longan.webp', 15, DEFAULT),
(NULL, 'Tandoori Chicken Rice Half', 2, 'You wanna eat big chicken', 44.9, 10, '../food-image/Tandoori Chicken Rice Half.webp', 20, DEFAULT),
(NULL, 'Pan Mee Soup', 3, 'Broga broga broga broga', 11.4, 10, '../food-image/Pan Mee Soup.webp', 22, DEFAULT),
(NULL, 'Iced Latte', 4, 'Freshly brewed Iced Latte using 100% Arabica coffee beans and fresh milk.', 8.8, 10, '../food-image/Iced Latte.webp', 38, DEFAULT),
(NULL, 'Da Vinci Tau Fu Fah Ice', 5, 'Taro Creme, Pandan Tau Fu Fah, Soy Milk Ice, Four Seasons Ball, Red Bean', 17.46, 10, '../food-image/Da Vinci Tau Fu Fah Ice.webp', 38, DEFAULT),
(NULL, 'Picasso Tau Fu Fah Ice', 5, 'Taro Creme, Pandan Tau Fu Fah, Soy Milk Ice, Sago, Cendol', 16.51, 13, '../food-image/Picasso Tau Fu Fah Ice.webp', 15, DEFAULT),
(NULL, 'Genki Ice', 5, '(Serves 2 Pax) Soy Shaved Ice, Taro Crème Glutinous Ball, Matcha Red Bean Glutinous Ball, Black Sesame Glutinous Ball, Peanut Glutinous Ball, Cincau, Peach Resin, Barley, Brown Sugar', 31.04, 13, '../food-image/Genki Ice.webp', 15, DEFAULT),
(NULL, 'Strawberry Ice', 5, 'Soy Shaved Ice, Strawberry Syrup, Konjac Jelly, Calbee Cereal', 23.11, 13, '../food-image/Strawberry Ice.webp', 15, DEFAULT),
(NULL, 'Boba Soy Milk', 4, 'Boba, Grinded Soybean, Brown Sugar', 10.85, 13, '../food-image/Boba Soy Milk.webp', 15, DEFAULT),
(NULL, 'Thai Green Tea', 4, 'Thai Green Tea', 8.8, 13, '../food-image/Thai Green Tea.webp', 15, DEFAULT),
(NULL, 'Thai Milk Tea', 4, 'Thai Milk Tea', 8.8, 13, '../food-image/Thai Milk Tea.webp', 15, DEFAULT),
(NULL, 'Brownies with Ice Cream', 5, 'Brownies served with vanilla ice cream and a drizzl of chocolate sauce. Topped with fresh strawberry', 12.72, 13, '../food-image/Brownies with Ice Cream.webp', 15, DEFAULT),
(NULL, 'Banana Split', 5, '3-scoop of ice cream and splited banana. Topped with whipped cream, chocolate sauce, fresh strawberry and cookies crumb', 17.16, 13, '../food-image/Banana Split.webp', 15, DEFAULT),
(NULL, 'Pink Lemonade', 5, 'Fizzy refreshing drinks with the flavour of raspberry, lemon and crushed strawberry', 17.16, 13, '../food-image/Pink Lemonade.webp', 15, DEFAULT),
(NULL, 'Iced Berry Cheesecake', 4, 'Fresh milk add on with berry and cheescake sauce', 10.72, 13, '../food-image/Iced Berry Cheesecake.webp', 15, DEFAULT),
(NULL, 'Passion Spritz', 4, 'Fizzy refreshing drinks with the flavour of passionfruit, crushed lemongrass and topped with passionfruit grain and popping boba', 17.16, 13, '../food-image/Passion Spritz.webp', 15, DEFAULT),
(NULL, 'Grilled Chicken Salad', 2, 'Grilled chicken served with fresh salad and tomato cherry. Topped with parmesan cheese, tartar sauce and olive oil', 22.73, 13, '../food-image/Grilled Chicken Salad.webp', 15, DEFAULT),
(NULL, 'Grilled Chicken', 2, 'Grilled chicken served with french fries, coleslaw, toasted garlic bread and homemade black pepper sauce side', 24.16, 13, '../food-image/Grilled Chicken.webp', 15, DEFAULT),
(NULL, 'Classic Chicken Chop', 2, 'Chicken chop served with french fries, coleslaw, toasted garlic bread and homemade black pepper sauce', 24.16, 13, '../food-image/Classic Chicken Chop.webp', 15, DEFAULT)


CREATE TABLE Cart (
    user_id INT NOT NULL,
    food_id INT NOT NULL, 
    food_num INT NOT NULL,
    PRIMARY KEY(user_id, food_id),
    FOREIGN KEY(user_id) REFERENCES User(user_id),
    FOREIGN KEY(food_id) REFERENCES Food(food_id)
)ENGINE = InnoDB;


CREATE TABLE OrderTable (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_cust_name VARCHAR(100) NOT NULL, 
    order_cust_phone VARCHAR(30) NOT NULL, 
    order_cust_address VARCHAR(150) NOT NULL, 
    order_time_placed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_payment_method VARCHAR(20) NOT NULL,
    order_completed BOOLEAN NOT NULL DEFAULT FALSE,
    order_delivery_instruction VARCHAR(300), 
    FOREIGN KEY(user_id) REFERENCES User(user_id)
)ENGINE = InnoDB;


CREATE TABLE OrderItem (
    order_id INT NOT NULL,
    food_id INT NOT NULL, 
    food_num INT NOT NULL,
    PRIMARY KEY(order_id, food_id),
    FOREIGN KEY(order_id) REFERENCES OrderTable(order_id),
    FOREIGN KEY(food_id) REFERENCES Food(food_id)
)ENGINE = InnoDB;