-- Optional sample data (safe to delete if not needed)
-- Note: IDs are auto-generated; using explicit IDs helps create consistent references.

INSERT INTO authors (id, name, bio, created_at, updated_at)
VALUES
  (1, 'George Orwell', 'English novelist and critic.', NOW(), NOW()),
  (2, 'J.K. Rowling', 'British author, best known for Harry Potter.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES
  (1, 'Fiction', 'Fictional works.', NOW(), NOW()),
  (2, 'Fantasy', 'Fantasy works.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO admin_users (id, username, password, name, email, country_code, phone, address, role, created_at, updated_at)
VALUES
  (1, 'admin', 'admin', 'System Admin', 'admin@example.com', '+91', NULL, NULL, 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  country_code = EXCLUDED.country_code,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  role = EXCLUDED.role,
  updated_at = NOW();

INSERT INTO members (id, name, email, country_code, phone, address, membership_date, created_at, updated_at)
VALUES
  (1, 'Alice Johnson', 'alice@example.com', '+91', '9999999999', '123 Main St', CURRENT_DATE, NOW(), NOW()),
  (2, 'Bob Smith', 'bob@example.com', '+91', '8888888888', '456 Park Ave', CURRENT_DATE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  country_code = EXCLUDED.country_code,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  updated_at = NOW();

INSERT INTO books (id, title, isbn, publisher, publication_year, total_copies, available_copies, description, author_id, category_id, created_at, updated_at)
VALUES
  (1, '1984', '9780451524935', 'Secker & Warburg', 1949, 5, 5, 'Dystopian social science fiction novel.', 1, 1, NOW(), NOW()),
  (2, 'Harry Potter and the Philosopher''s Stone', '9780747532699', 'Bloomsbury', 1997, 3, 3, 'First Harry Potter book.', 2, 2, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  isbn = EXCLUDED.isbn,
  publisher = EXCLUDED.publisher,
  publication_year = EXCLUDED.publication_year,
  total_copies = EXCLUDED.total_copies,
  available_copies = EXCLUDED.available_copies,
  description = EXCLUDED.description,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  updated_at = NOW();

SELECT setval(pg_get_serial_sequence('authors', 'id'), COALESCE((SELECT MAX(id) FROM authors), 1), true);
SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE((SELECT MAX(id) FROM categories), 1), true);
SELECT setval(pg_get_serial_sequence('admin_users', 'id'), COALESCE((SELECT MAX(id) FROM admin_users), 1), true);
SELECT setval(pg_get_serial_sequence('members', 'id'), COALESCE((SELECT MAX(id) FROM members), 1), true);
SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 1), true);
