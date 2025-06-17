-- Seed: 001_initial_data
-- Description: Initial data for the home library

-- Добавляем тестовых пользователей
INSERT INTO users (id, login, password, version, created_at, updated_at) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'admin', '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.QAx8K8y', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'user1', '$2b$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDp0.QAx8K8y', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Добавляем исполнителей
INSERT INTO artists (id, name, grammy) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Queen', true),
    ('d290f1ee-6c54-4b01-90e6-d701748f0854', 'The Beatles', true),
    ('d290f1ee-6c54-4b01-90e6-d701748f0855', 'Muse', true);

-- Добавляем альбомы
INSERT INTO albums (id, name, year, artist_id) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0856', 'A Night at the Opera', 1975, 'd290f1ee-6c54-4b01-90e6-d701748f0853'),
    ('d290f1ee-6c54-4b01-90e6-d701748f0857', 'Abbey Road', 1969, 'd290f1ee-6c54-4b01-90e6-d701748f0854'),
    ('d290f1ee-6c54-4b01-90e6-d701748f0858', 'Origin of Symmetry', 2001, 'd290f1ee-6c54-4b01-90e6-d701748f0855');

-- Добавляем треки
INSERT INTO tracks (id, name, artist_id, album_id, duration) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0859', 'Bohemian Rhapsody', 'd290f1ee-6c54-4b01-90e6-d701748f0853', 'd290f1ee-6c54-4b01-90e6-d701748f0856', 354),
    ('d290f1ee-6c54-4b01-90e6-d701748f0860', 'Come Together', 'd290f1ee-6c54-4b01-90e6-d701748f0854', 'd290f1ee-6c54-4b01-90e6-d701748f0857', 259),
    ('d290f1ee-6c54-4b01-90e6-d701748f0861', 'New Born', 'd290f1ee-6c54-4b01-90e6-d701748f0855', 'd290f1ee-6c54-4b01-90e6-d701748f0858', 396);

-- Добавляем избранное
INSERT INTO favorites (id, user_id, artist_id, album_id, track_id) VALUES
    ('d290f1ee-6c54-4b01-90e6-d701748f0862', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'd290f1ee-6c54-4b01-90e6-d701748f0853', NULL, NULL),
    ('d290f1ee-6c54-4b01-90e6-d701748f0863', 'd290f1ee-6c54-4b01-90e6-d701748f0851', NULL, 'd290f1ee-6c54-4b01-90e6-d701748f0856', NULL),
    ('d290f1ee-6c54-4b01-90e6-d701748f0864', 'd290f1ee-6c54-4b01-90e6-d701748f0851', NULL, NULL, 'd290f1ee-6c54-4b01-90e6-d701748f0859'); 