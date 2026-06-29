DROP TABLE IF EXISTS heroes;

CREATE TABLE heroes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    date_of_birth DATETIME NOT NULL,
    universe VARCHAR(100) NOT NULL,
    main_power VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_heroes_active_created
    ON heroes (is_active, created_at);

CREATE INDEX idx_heroes_search
    ON heroes (name, nickname);