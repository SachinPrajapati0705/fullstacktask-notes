INSERT INTO users (name, email, password)
SELECT 'Admin', 'admin@test.com', '123456'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@test.com'
);

INSERT INTO users (name, email, password)
SELECT 'Riya', 'riya@test.com', 'riya123'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'riya@test.com'
);

INSERT INTO notes (title, content, user_id)
SELECT 'Welcome Note', 'This note belongs to Admin user.', id
FROM users
WHERE email = 'admin@test.com'
  AND NOT EXISTS (
      SELECT 1 FROM notes WHERE title = 'Welcome Note'
  );
