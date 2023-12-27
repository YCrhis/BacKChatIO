CREATE TABLE messages(
    id INT PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    datesend Date
)