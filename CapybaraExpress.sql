CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL UNIQUE, 
    user_password VARCHAR(50) NOT NULL, 
    user_email VARCHAR(50) NOT NULL,
    user_address VARCHAR(150) NOT NULL, 
    user_notification BOOLEAN NOT NULL
)ENGINE = InnoDB;


INSERT INTO User 
VALUES
(NULL, 'admin', 'admin', 'admin@gmail.com', '99, Jalan 99, Selangor', TRUE),
(NULL, 'capy', 'loves', 'food@gmail.com', '38, Jalan Capy, Kuala Lumpur', TRUE),
(NULL, 'zoomer', 'lazyyi', 'zoomer33@gmail.com', '199, Jalan Tun Tan Cheng Lock, 41442, Kuala Lumpur', TRUE),
(NULL, 'Chef', 'quick22', 'capyba@gmail.com', '20, Jalan KK, 41222, Selangor', FALSE)


CREATE TABLE Food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL UNIQUE, 
    food_category VARCHAR(50) NOT NULL, 
    food_description VARCHAR(50) NOT NULL,
    food_price
    food_availability
    food_image VARCHAR(150) NOT NULL, 
    food_prep_time BOOLEAN NOT NULL
)ENGINE = InnoDB;

