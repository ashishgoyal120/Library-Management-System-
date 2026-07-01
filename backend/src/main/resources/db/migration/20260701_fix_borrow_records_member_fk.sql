-- Run this once in Supabase SQL Editor after separating admin users from members.
-- It fixes old databases where borrow_records.user_id still references users(id).

BEGIN;

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS country_code varchar(255);

-- If the old users table has member rows, preserve them in the new members table.
INSERT INTO members (id, name, email, country_code, phone, address, membership_date, created_at, updated_at)
SELECT
  u.id,
  u.name,
  u.email,
  '+91',
  u.phone,
  u.address,
  COALESCE(u.membership_date, CURRENT_DATE),
  COALESCE(u.created_at, NOW()),
  COALESCE(u.updated_at, NOW())
FROM users u
WHERE NOT EXISTS (
  SELECT 1
  FROM members m
  WHERE m.id = u.id
);

-- Drop any old foreign keys on borrow_records that point to the old users table.
DO $$
DECLARE
  constraint_name text;
BEGIN
  FOR constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_class r ON r.oid = c.confrelid
    WHERE c.contype = 'f'
      AND t.relname = 'borrow_records'
      AND r.relname = 'users'
  LOOP
    EXECUTE format('ALTER TABLE borrow_records DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END LOOP;
END $$;

-- Rename old user_id to member_id, or merge it if member_id already exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'borrow_records'
      AND column_name = 'user_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'borrow_records'
        AND column_name = 'member_id'
    ) THEN
      ALTER TABLE borrow_records RENAME COLUMN user_id TO member_id;
    ELSE
      UPDATE borrow_records
      SET member_id = user_id
      WHERE member_id IS NULL;

      ALTER TABLE borrow_records DROP COLUMN user_id;
    END IF;
  END IF;
END $$;

ALTER TABLE borrow_records
  ALTER COLUMN member_id SET NOT NULL;

ALTER TABLE borrow_records
  DROP CONSTRAINT IF EXISTS borrow_records_member_id_fkey;

ALTER TABLE borrow_records
  ADD CONSTRAINT borrow_records_member_id_fkey
  FOREIGN KEY (member_id)
  REFERENCES members(id);

CREATE INDEX IF NOT EXISTS idx_borrow_records_member_id
  ON borrow_records(member_id);

COMMIT;
