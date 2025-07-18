-- Tạo và chọn database
CREATE DATABASE IF NOT EXISTS ExploreWorld;
USE ExploreWorld;

-- Bảng: country
CREATE TABLE IF NOT EXISTS country (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO country (id, name) VALUES
(1,'Vietnam'), (2,'Thailand'), (3,'China'), (4,'Korea');

-- Bảng: category
CREATE TABLE IF NOT EXISTS category (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO category (id, name) VALUES
(1,'Noodle'), (2,'Rice'), (3,'Snake'), (4,'Drink');

-- Bảng: city
CREATE TABLE IF NOT EXISTS city (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  country_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_country (country_id),
  CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES country(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO city (id, name, country_id) VALUES
(1,'Hue',1), (2,'Ha Noi',1), (3,'Da Nang',1), (4,'Ho Chi Minh',1);

-- Bảng: dish
CREATE TABLE IF NOT EXISTS dish (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  video_url VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  has_manual_story VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  featured VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  history VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  category_id INT DEFAULT NULL,
  city_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (city_id) REFERENCES city(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO dish (id, name, category_id, city_id) VALUES
(1,'Mỳ Quảng',1,3),
(2,'Cơm gà Hội An',2,3),
(3,'Bánh tráng kẹp',3,3),
(4,'Nước Mót Hội An',4,3);

-- Bảng: dish_image
CREATE TABLE IF NOT EXISTS dish_image (
  id INT NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  caption VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  dish_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (dish_id) REFERENCES dish(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng: restaurant
CREATE TABLE IF NOT EXISTS restaurant (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  address VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  opening_time VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  closing_time VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  latitude FLOAT DEFAULT NULL,
  longitude FLOAT DEFAULT NULL,
  rating FLOAT DEFAULT 0,
  contact_info VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  city_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (city_id) REFERENCES city(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO restaurant (id, name, address, opening_time, closing_time, latitude, longitude, rating, contact_info, city_id)
VALUES (1, 'Chợ Cồn', '12 Trần Phú', '06:30:00', '17:30:00', 16.068342071506926, 108.21429537330187, 4.5, '', 3);

-- Bảng: restaurant_dish
CREATE TABLE IF NOT EXISTS restaurant_dish (
  id INT NOT NULL AUTO_INCREMENT,
  dish_id INT DEFAULT NULL,
  restaurant_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_restaurant_dish (dish_id, restaurant_id),
  FOREIGN KEY (dish_id) REFERENCES dish(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO restaurant_dish (id, dish_id, restaurant_id) VALUES
(1,1,1), (2,2,1), (3,3,1);

-- Bảng: restaurant_image
CREATE TABLE IF NOT EXISTS restaurant_image (
  id INT NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  restaurant_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng: user
CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  email VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  password VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO user (id, username, email, password) VALUES
(1,'hoa123','hoa@gmail.com','$2a$10$/b4.35VzibFnzevqIxJcMe4aXFhI34vLUCM8UeHckFxHVngwbTl0O'),
(2,'ngocthanhvo','vntvlogs@gmail.com','$2a$10$fGd5QlACLZe/qlHC30fB7O5XvxrvpIj5coPmGXohfJaAlkcu6Gt5W');

-- Bảng: review
CREATE TABLE IF NOT EXISTS review (
  id INT NOT NULL AUTO_INCREMENT,
  comment TEXT COLLATE utf8mb4_unicode_ci,
  rating FLOAT DEFAULT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  restaurant_id INT DEFAULT NULL,
  user_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurant(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO review (id, comment, rating, created_date, restaurant_id, user_id) VALUES
(1,'Ngon vãi', 4.5, '2025-01-12 15:30:12', 1, 1);
