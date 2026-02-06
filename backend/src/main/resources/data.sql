-- Optional sample data (safe to delete if not needed)
-- Note: IDs are auto-generated; using explicit IDs helps create consistent references.

INSERT INTO authors (id, name, bio, created_at, updated_at)
VALUES
  (1, 'George Orwell', 'English novelist and critic.', NOW(), NOW()),
  (2, 'J.K. Rowling', 'British author, best known for Harry Potter.', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), bio=VALUES(bio), updated_at=NOW();

INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES
  (1, 'Fiction', 'Fictional works.', NOW(), NOW()),
  (2, 'Fantasy', 'Fantasy works.', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), updated_at=NOW();

INSERT INTO users (id, username, password, name, email, phone, address, membership_date, created_at, updated_at)
VALUES
  (1, 'alice', 'password123', 'Alice Johnson', 'alice@example.com', '9999999999', '123 Main St', CURDATE(), NOW(), NOW()),
  (2, 'bob', 'password123', 'Bob Smith', 'bob@example.com', '8888888888', '456 Park Ave', CURDATE(), NOW(), NOW())
ON DUPLICATE KEY UPDATE username=VALUES(username), password=VALUES(password), name=VALUES(name), phone=VALUES(phone), address=VALUES(address), updated_at=NOW();

INSERT INTO books (id, title, isbn, publisher, publication_year, total_copies, available_copies, description, author_id, category_id, created_at, updated_at)
VALUES
  (1, '1984', '9780451524935', 'Secker & Warburg', 1949, 5, 5, 'Dystopian social science fiction novel.', 1, 1, NOW(), NOW()),
  (2, 'Harry Potter and the Philosopher''s Stone', '9780747532699', 'Bloomsbury', 1997, 3, 3, 'First Harry Potter book.', 2, 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title), available_copies=VALUES(available_copies), updated_at=NOW();

