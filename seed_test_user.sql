INSERT INTO Users (name, email, password, createdAt, updatedAt)
VALUES (
  'CI Test User',
  'test@example.com',
  '$2a$10$XQG/huj4hUL5lY1cbqEPeuj0VVKHe7vRRZqDU9ZRMfRhLdPVUYJWa', -- bcrypt for "P@ssw0rd123"
  NOW(),
  NOW()
);
