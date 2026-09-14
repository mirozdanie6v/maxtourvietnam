CREATE TABLE IF NOT EXISTS tours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  duration TEXT,
  price_from INTEGER,
  currency TEXT NOT NULL DEFAULT '₽',
  cover_image TEXT,
  description TEXT,
  program TEXT,
  included TEXT,
  not_included TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tours_published_sort ON tours(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);

CREATE TABLE IF NOT EXISTS site_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  content_json TEXT,
  source_url TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
