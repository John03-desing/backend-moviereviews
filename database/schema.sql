CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'user',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('user', 'admin'))
);


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,

    movie_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,

    rating INTEGER NOT NULL,

    comment TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'published',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT reviews_rating_check
        CHECK (rating >= 1 AND rating <= 10),

    CONSTRAINT reviews_status_check
        CHECK (status IN ('published', 'hidden')),

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_movie_review
        UNIQUE (user_id, movie_id)
);


CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    movie_id INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_movie_favorite
        UNIQUE (user_id, movie_id)
);