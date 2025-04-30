-- file: seed_test_user.sql
INSERT INTO Users (id, name, email, password, createdAt, updatedAt)
VALUES (1, 'Test User', 'test@example.com', '$2a$10$encryptedpassword', NOW(), NOW());

