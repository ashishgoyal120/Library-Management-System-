-- Run this if borrow_records has both member_id and old user_id columns.
-- Symptom: null value in column "user_id" violates not-null constraint.

BEGIN;

ALTER TABLE borrow_records
  DROP CONSTRAINT IF EXISTS fke5k0iaamaypstfhuluoa40yom;

ALTER TABLE borrow_records
  DROP CONSTRAINT IF EXISTS borrow_records_user_id_fkey;

UPDATE borrow_records
SET member_id = user_id
WHERE member_id IS NULL
  AND user_id IS NOT NULL;

ALTER TABLE borrow_records
  ALTER COLUMN member_id SET NOT NULL;

ALTER TABLE borrow_records
  DROP COLUMN IF EXISTS user_id;

ALTER TABLE borrow_records
  DROP CONSTRAINT IF EXISTS borrow_records_member_id_fkey;

ALTER TABLE borrow_records
  ADD CONSTRAINT borrow_records_member_id_fkey
  FOREIGN KEY (member_id)
  REFERENCES members(id);

CREATE INDEX IF NOT EXISTS idx_borrow_records_member_id
  ON borrow_records(member_id);

COMMIT;
