ALTER TABLE tours ADD COLUMN adult_price INTEGER;
ALTER TABLE tours ADD COLUMN child_price INTEGER;
ALTER TABLE tours ADD COLUMN badge TEXT;
ALTER TABLE tours ADD COLUMN category TEXT;
ALTER TABLE tours ADD COLUMN popular INTEGER NOT NULL DEFAULT 0;

UPDATE tours SET currency = '$' WHERE currency IS NULL OR currency = '₽';
