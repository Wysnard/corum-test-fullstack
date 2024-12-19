DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (firstname, lastname, email, password) VALUES
    ('John', 'Doe', 'john.doe@example.com', 'password123'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'password456'),
    ('Michael', 'Johnson', 'michael.j@example.com', 'password789'),
    ('Sarah', 'Williams', 'sarah.w@example.com', 'password321'),
    ('James', 'Brown', 'james.b@example.com', 'password654');
