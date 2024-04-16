-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2024 at 12:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capybaraexpress`
--

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `food_id` int(11) NOT NULL,
  `food_name` varchar(100) NOT NULL,
  `food_category_id` int(11) NOT NULL,
  `food_description` varchar(300) NOT NULL,
  `food_price` float NOT NULL,
  `food_availability` int(11) NOT NULL DEFAULT 0,
  `food_image` varchar(150) NOT NULL,
  `food_prep_time` int(11) NOT NULL,
  `food_num_sold` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`food_id`, `food_name`, `food_category_id`, `food_description`, `food_price`, `food_availability`, `food_image`, `food_prep_time`, `food_num_sold`) VALUES
(1, 'Drumstick Fried Chikin Combo', 1, 'Drumstick Korean Fried Chikin (2pcs) Seasoned With One Type of Korean Sauces Served Together With Kimchi French Fries and Kimchi', 18.9, 10, 'food-image/Drumstick Fried Chikin Combo.webp', 30, 0),
(2, 'Soy Garlic (Authentic Korean Flavor)', 1, 'Korean Fried Chicken Only The crispy and tender chicken is coated in a luscious glaze that is both sweet and spicy, creating a delightful taste sensation.', 15.9, 10, 'food-image/Soy Garlic (Authentic Korean Flavor).webp', 30, 0),
(3, 'Tau Fu Fah', 5, 'I Love to Eat TOFFUUUUFAH', 5.9, 10, 'food-image/Tau Fu Fah.webp', 25, 0),
(4, 'Peach Gum Snow Fungus with Longan', 5, 'Nice', 8.9, 10, 'food-image/Peach Gum Snow Fungus with Longan.webp', 15, 0),
(5, 'Tandoori Chicken Rice Half', 2, 'You wanna eat big chicken', 44.9, 10, 'food-image/Tandoori Chicken Rice Half.webp', 20, 0),
(6, 'Pan Mee Soup', 3, 'Broga broga broga broga', 11.4, 10, 'food-image/Pan Mee Soup.webp', 22, 0),
(7, 'Iced Latte', 4, 'Freshly brewed Iced Latte using 100% Arabica coffee beans and fresh milk.', 8.8, 10, 'food-image/Iced Latte.webp', 38, 0);

-- --------------------------------------------------------

--
-- Table structure for table `foodcategory`
--

CREATE TABLE `foodcategory` (
  `food_category_id` int(11) NOT NULL,
  `food_category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `foodcategory`
--

INSERT INTO `foodcategory` (`food_category_id`, `food_category_name`) VALUES
(2, 'Chicken'),
(5, 'Dessert'),
(4, 'Drinks'),
(1, 'Fried'),
(3, 'Noodle');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_address` varchar(150) NOT NULL,
  `user_phone` varchar(30) NOT NULL,
  `user_notification` tinyint(1) NOT NULL,
  `user_operator` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_password`, `user_email`, `user_address`, `user_phone`, `user_notification`, `user_operator`) VALUES
(1, 'admin', 'admin', 'admin@gmail.com', '99, Jalan 99, Selangor', '013-189 0189', 1, 0),
(2, 'capy', 'loves', 'food@gmail.com', '38, Jalan Capy, Kuala Lumpur', '019-506 6516', 1, 0),
(3, 'zoomer', 'lazyyi', 'zoomer33@gmail.com', '199, Jalan Tun Tan Cheng Lock, 41442, Kuala Lumpur', '018-255 0568', 1, 0),
(4, 'Chef', 'quick22', 'capyba@gmail.com', '20, Jalan KK, 41222, Selangor', '010-223 9402', 0, 1),
(53, 'sfsfs', 'd', 'eazhe99@gmail.com', '1018', '0108100127', 0, 0),
(54, 'adg', 'd', 'eazhe99@gmail.com', '1018', '0108100127', 0, 0),
(55, 'ga', 'dd', 'eazhe99@gmail.com', '1018', '0108100127', 0, 0),
(56, 'ddd', 'dd', 'eazhe99@gmail.com', '1018', '0108100127', 0, 0),
(57, 's', 'd', 'eazhe99@gmail.com', '1018', '0108100127', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`food_id`),
  ADD UNIQUE KEY `food_name` (`food_name`),
  ADD KEY `food_category_id` (`food_category_id`);

--
-- Indexes for table `foodcategory`
--
ALTER TABLE `foodcategory`
  ADD PRIMARY KEY (`food_category_id`),
  ADD UNIQUE KEY `food_category_name` (`food_category_name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `food_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `foodcategory`
--
ALTER TABLE `foodcategory`
  MODIFY `food_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `food`
--
ALTER TABLE `food`
  ADD CONSTRAINT `food_ibfk_1` FOREIGN KEY (`food_category_id`) REFERENCES `foodcategory` (`food_category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
