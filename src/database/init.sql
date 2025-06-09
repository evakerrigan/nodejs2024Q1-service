CREATE TABLE users (
    id UUID PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE artists (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grammy BOOLEAN NOT NULL
);

CREATE TABLE albums (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    artist_id UUID REFERENCES artists(id)
);

CREATE TABLE tracks (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    artist_id UUID REFERENCES artists(id),
    album_id UUID REFERENCES albums(id),
    duration INTEGER NOT NULL
);

CREATE TABLE favorites (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    artist_id UUID REFERENCES artists(id),
    album_id UUID REFERENCES albums(id),
    track_id UUID REFERENCES tracks(id)
);