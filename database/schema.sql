DROP DATABASE IF EXISTS `shop_db`;

CREATE DATABASE `shop_db`;

USE `shop_db`;

CREATE TABLE `users`(
    `id` varchar(9) unique key not null,
    `first_name` varchar(20),
    `last_name` varchar(20),
    `email` varchar(50) unique key not null check (`email` LIKE '_%@__%.__%'),
    `password` varchar(255) not null,
    `city` varchar(50),
    `street` varchar(50),
    `is_admin` tinyint default 0,
    `picture` varchar(50),
    PRIMARY KEY (`id`)
);

INSERT INTO `users`(`id`, `first_name`, `last_name`, `email`, `password`, `is_admin`, `city`, `street`) 
    VALUES("111111111", "Mr.", "Admin", "admin@gmail.com", "$2b$10$Dw/3MplTbFS3ornPH4UTgeMEBdm5X2N35nzloNYWlQeF6hY0PPoru", 1, null, null),
    ("123456789", "John", "Doe", "user@gmail.com", "$2b$10$Dw/3MplTbFS3ornPH4UTgeMEBdm5X2N35nzloNYWlQeF6hY0PPoru", 0, 'Netanya', 'Hadaliyot 1');


CREATE TABLE `categories`(
    `id` int auto_increment,
    `category` varchar(20) not null,
    PRIMARY KEY (`id`)
);

CREATE TABLE `products`(
    `id` int auto_increment,
    `category_id` int not null,
    `name` varchar(50) not null,
    `price` int not null,
    foreign key (`category_id`) references `categories`(`id`),
    PRIMARY KEY (`id`)
);

INSERT INTO categories(category) VALUES ("jeans"),("pants"),("shirts"),("joggers"),("suits");

INSERT INTO products (id, category_id, name, price) 
VALUES (1, 1, "basic black jeans", 230),
(2, 1, "super skinny jeans orange stripe", 270),
(3, 2, "cargo pants", 150),
(4, 2, "bermuda shorts", 130),
(5, 3, "cotton long sleeve waffle shirt", 50),
(6, 3, "hawaii botton down", 50),
(7, 3, "dark sleeveless", 50),
(8, 4, "grey loungewear joggers", 70), 
(9, 4, "signature joggers", 70), 
(10, 2, "motion flex stretch pants", 50), 
(11, 4, "orange and black tie dye joggers", 50), 
(12, 5, "stretch marl suit", 500), 
(13, 5, "stretch tonic suit", 500), 
(14, 5, "taupe check suit", 500), 
(15, 4, "tommy hilfiger blue basic sweatpants", 90), 
(16, 5, "tuxedo suit", 550), 
(17, 5, "two button black suit", 500); 

CREATE TABLE `product_pictures`(
    `id` int auto_increment,
    `product_id` int not null,
    `picture` varchar(150) not null,
    foreign key (`product_id`) references `products`(`id`) ON DELETE CASCADE,
    PRIMARY KEY (`id`)
);

INSERT INTO product_pictures (product_id, picture) 
VALUES (1, "basic black jeans.jpg"),
(1, "basic black jeans back.jpg"),
(2, "super skinny jeans orange stripe.jpg"), 
(2, "super skinny jeans orange stripe side.jpg"),
(3, "cargo pants.jpg"),
(4, "bermuda shorts.jpg"),
(5, "cotton shirt v.jpeg"),
(6, "hawaii front.jpg"),
(6, "hawaii back.jpg"),
(7, "tank top.jpg"),
(8, "Calvin Klein Grey Loungewear Joggers.jpg"),
(8, "Calvin Klein Grey Loungewear Joggers back.jpg"),
(8, "Calvin Klein Grey Loungewear Joggers full.jpg"),
(9, "Hype. Mens Signature Joggers front.jpg"),
(9, "Hype. Mens Signature Joggers back.jpg"),
(9, "Hype. Mens Signature Joggers full.jpg"),
(9, "Hype. Mens Signature Joggers back full.jpg"),
(10, "Motion Flex Stretch Joggers.jpg"),
(10, "Motion Flex Stretch Joggers back.jpg"),
(11, "Orange and Black Tie Dye Joggers back.jpg"),
(11, "Orange and Black Tie Dye Joggers front.jpg"),
(12, "Stretch Marl Suit.jpg"),
(13, "Stretch Tonic Suit front.jpg"),
(13, "Stretch Tonic Suit full front.jpg"),
(13, "Stretch Tonic Suit full back.jpg"),
(14, "Taupe Check Suit close.jpg"),
(14, "Taupe Check Suit front.jpg"),
(14, "Taupe Check Suit back.jpg"),
(15, "Tommy Hilfiger Blue Basic Branded Sweatpants front.jpg"),
(15, "Tommy Hilfiger Blue Basic Branded Sweatpants back.jpg"),
(16, "Tuxedo Suit.jpg"),
(17, "Two Button black Suit.jpg");

CREATE TABLE `carts`(
    `id` int auto_increment,
    `user_id` varchar(9) not null,
    `creation_date` timestamp default now(),
    `is_active` tinyint default 1,
    foreign key (`user_id`) references `users`(`id`),
    PRIMARY KEY (`id`)
);

INSERT INTO `carts` (user_id) VALUES("123456789");

CREATE TABLE `cart_items`(
    `id` int auto_increment,
    `product_id` int not null,
    `cart_id` int not null,
    `amount` int not null,
    `size` varchar(10) not null,
    foreign key (`product_id`) references `products`(`id`) ON DELETE CASCADE,
    foreign key (`cart_id`) references `carts`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `orders`(
    `id` int auto_increment,
    `user_id` varchar(9) not null,
    `cart_id` int not null,
    `total` int not null,
    `delivery_city` varchar(50) not null,
    `delivery_street` varchar(50) not null,
    `delivery_date` timestamp default now(),
    `order_date` timestamp default now(),
    `payment` varchar(16) not null,
    foreign key (`user_id`) references `users`(`id`),
    foreign key (`cart_id`) references `carts`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `receipts` (
    `id` int auto_increment,
    `user_id` varchar(9) not null,
    `name` varchar(50) not null,
    `order_date` timestamp not null,
    foreign key (`user_id`) references `users`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE `tokens` (
    `id` int auto_increment,
    `token` varchar(255) not null,
    `user_id` varchar(9) not null,
	foreign key (`user_id`) references `users`(`id`),
    PRIMARY KEY (`id`)
);