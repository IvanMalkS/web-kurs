CREATE DATABASE IF NOT EXISTS lab3
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lab3;

SET NAMES utf8mb4;

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    specialty VARCHAR(255),
    photo VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255),
    phone VARCHAR(50),
    doctor_id INT,
    visit_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO news (title, content) VALUES
('Скидка на приём', 'Скидка 20% на первичный приём терапевта'),
('Новое оборудование', 'Установлен новый УЗИ аппарат'),
('Забота о детях', 'Бесплатная вакцинация для детей до 7 лет по субботам'),
('Акция', 'Скидка 10% на все услуги в декабре'),
('Новый врач', 'В нашем центре появился новый врач - кардиолог');

INSERT INTO doctors (name, specialty, photo) VALUES
('Иванов И.И.', 'Терапевт', 'doctor-1.jpg'),
('Петрова А.В.', 'Кардиолог', 'doctor-2.jpg'),
('Сидорова Д.М.', 'Невролог', 'doctor-3.jpg');