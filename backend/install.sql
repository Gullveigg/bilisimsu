-- ============================================================
-- Bilişim Su Arıtma — MySQL Kurulum Scripti
-- phpMyAdmin'de çalıştırın ya da: mysql -u root -p bilisimsuaritma < install.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `bilisimsuaritma`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `bilisimsuaritma`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(32)  NOT NULL,
  `name`          VARCHAR(255) NOT NULL,
  `email`         VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          VARCHAR(32)  NOT NULL DEFAULT 'admin',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id`          VARCHAR(32)  NOT NULL,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id`                VARCHAR(32)   NOT NULL,
  `name`              VARCHAR(255)  NOT NULL,
  `slug`              VARCHAR(255)  NOT NULL,
  `short_description` TEXT          NOT NULL,
  `description`       LONGTEXT      NOT NULL,
  `technical_specs`   TEXT          NOT NULL,
  `price`             VARCHAR(100),
  `image_url`         VARCHAR(1000) NOT NULL,
  `image_gallery`     JSON          NOT NULL,
  `is_featured`       TINYINT(1)    NOT NULL DEFAULT 0,
  `is_active`         TINYINT(1)    NOT NULL DEFAULT 1,
  `whatsapp_enabled`  TINYINT(1)    NOT NULL DEFAULT 1,
  `category_id`       VARCHAR(32)   NOT NULL,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  `id`          VARCHAR(32)  NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL,
  `description` TEXT         NOT NULL,
  `icon`        VARCHAR(100) NOT NULL,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`           VARCHAR(32)   NOT NULL,
  `title`        VARCHAR(500)  NOT NULL,
  `slug`         VARCHAR(500)  NOT NULL,
  `excerpt`      TEXT          NOT NULL,
  `content`      LONGTEXT      NOT NULL,
  `cover_image`  VARCHAR(1000) NOT NULL,
  `is_published` TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pages` (
  `id`           VARCHAR(32)  NOT NULL,
  `title`        VARCHAR(500) NOT NULL,
  `slug`         VARCHAR(500) NOT NULL,
  `excerpt`      TEXT         NOT NULL,
  `content`      LONGTEXT     NOT NULL,
  `is_published` TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id`          VARCHAR(32)   NOT NULL,
  `eyebrow`     VARCHAR(255)  NOT NULL,
  `title`       VARCHAR(500)  NOT NULL,
  `description` TEXT          NOT NULL,
  `href`        VARCHAR(500)  NOT NULL,
  `cta`         VARCHAR(255)  NOT NULL,
  `trust`       JSON          NOT NULL,
  `image_url`   VARCHAR(1000),
  `video_url`   VARCHAR(1000),
  `sort_order`  INT           NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ref_items` (
  `id`          VARCHAR(32)   NOT NULL,
  `name`        VARCHAR(255)  NOT NULL,
  `logo_url`    VARCHAR(1000) NOT NULL,
  `website`     VARCHAR(1000),
  `sort_order`  INT           NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         VARCHAR(32)  NOT NULL,
  `name`       VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `phone`      VARCHAR(50),
  `subject`    VARCHAR(500) NOT NULL,
  `message`    TEXT         NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Varsayılan admin (şifre: Admin123!)
-- Canlıya geçmeden önce şifreyi değiştirin:
--   php -r "echo password_hash('YeniSifre', PASSWORD_BCRYPT);"
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`)
VALUES (
  'cadmin00000000000000000000',
  'Admin',
  'admin@bilisimsuaritma.com',
  '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh',
  'admin'
);
-- Yukarıdaki hash "Admin123!" şifresine karşılık gelir.
