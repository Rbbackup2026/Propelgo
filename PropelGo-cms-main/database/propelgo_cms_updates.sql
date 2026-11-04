-- Run this migration only after replacing the API files below.
-- Back up your database before running any DROP COLUMN statements.

ALTER TABLE banks
  DROP COLUMN IF EXISTS website_url;

ALTER TABLE partners
  DROP COLUMN IF EXISTS website_url;

ALTER TABLE accreditations
  DROP COLUMN IF EXISTS website_url;


-- ARTICLES MODULE
CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  image_url VARCHAR(2048) NOT NULL,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_articles_display (display_order, id),
  INDEX idx_articles_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- TEAM MODULE
CREATE TABLE IF NOT EXISTS team_members (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  designation VARCHAR(191) NOT NULL,
  image_url VARCHAR(2048) NOT NULL,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_team_display (display_order, id),
  INDEX idx_team_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ADD THE FOUR DEFAULT STATISTICS IF THEY DO NOT ALREADY EXIST.
-- They start inactive, so placeholder values won't appear on the live site.

INSERT INTO site_statistics
  (label, stat_value, description, icon, display_order, is_active)
SELECT
  'Enterprise customers', '—', 'Add the verified customer count.', 'users', 1, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE label = 'Enterprise customers'
);

INSERT INTO site_statistics
  (label, stat_value, description, icon, display_order, is_active)
SELECT
  'Transactions processed', '—', 'Add the verified transaction count.', 'activity', 2, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE label = 'Transactions processed'
);

INSERT INTO site_statistics
  (label, stat_value, description, icon, display_order, is_active)
SELECT
  'Payment volume', '—', 'Add the verified payment volume.', 'wallet', 3, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE label = 'Payment volume'
);

INSERT INTO site_statistics
  (label, stat_value, description, icon, display_order, is_active)
SELECT
  'Banking & ecosystem partners', '—', 'Add the verified partner count.', 'building', 4, 0
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics
  WHERE label = 'Banking & ecosystem partners'
);