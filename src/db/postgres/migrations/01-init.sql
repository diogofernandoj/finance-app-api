CREATE TABLE IF NOT EXISTS users(
    ID UUID PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS transactions(
    ID UUID PRIMARY KEY,
    user_id UUID REFERENCES users(ID) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type transaction_type NOT NULL
);