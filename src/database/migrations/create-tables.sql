CREATE TABLE IF NOT EXISTS "users"
(
    "id"         SERIAL       NOT NULL UNIQUE,
    "email"      VARCHAR(255) NOT NULL UNIQUE,
    "password"   VARCHAR(255) NOT NULL,
    "name"       VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "orders"
(
    "id"               BIGSERIAL      NOT NULL UNIQUE,
    "user_id"          INTEGER        NOT NULL,
    "status"           VARCHAR(255)   NOT NULL,
    "total_price"      NUMERIC(10, 2) NOT NULL DEFAULT 0,
    "shipping_address" TEXT           NOT NULL,
    "created_at"       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "authors"
(
    "id"   SERIAL       NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "genres"
(
    "id"   SERIAL       NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "manga"
(
    "id"          SERIAL       NOT NULL UNIQUE,
    "title"       VARCHAR(255) NOT NULL,
    "description" TEXT         NOT NULL,
    "author_id"   INTEGER      NOT NULL,
    "cover_url"   TEXT         NOT NULL,
    "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "manga_genres"
(
    "manga_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,
    PRIMARY KEY ("manga_id", "genre_id")
);



CREATE TABLE IF NOT EXISTS "volumes"
(
    "id"        SERIAL         NOT NULL UNIQUE,
    "manga_id"  INTEGER        NOT NULL,
    "number"    SMALLINT       NOT NULL,
    "price"     NUMERIC(10, 2) NOT NULL,
    "quantity"  INTEGER        NOT NULL DEFAULT 0,
    "cover_url" TEXT           NOT NULL,
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "carts"
(
    "id"         SERIAL      NOT NULL UNIQUE,
    "user_id"    INTEGER     NOT NULL UNIQUE,
    "updated_at" TIMESTAMPTZ NOT NULL,
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "cart_items"
(
    "id"        SERIAL  NOT NULL UNIQUE,
    "cart_id"   INTEGER NOT NULL,
    "volume_id" INTEGER NOT NULL,
    "quantity"  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);



CREATE TABLE IF NOT EXISTS "order_items"
(
    "id"                SERIAL         NOT NULL UNIQUE,
    "order_id"          INTEGER        NOT NULL,
    "volume_id"         INTEGER        NOT NULL,
    "quantity"          INTEGER        NOT NULL DEFAULT 0,
    "price_at_purchase" NUMERIC(10, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);



ALTER TABLE "manga"
    ADD FOREIGN KEY ("author_id") REFERENCES "authors" ("id")
        ON UPDATE NO ACTION ON DELETE RESTRICT;
ALTER TABLE "volumes"
    ADD FOREIGN KEY ("manga_id") REFERENCES "manga" ("id")
        ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "carts"
    ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")
        ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "cart_items"
    ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id")
        ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "orders"
    ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")
        ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE "order_items"
    ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "order_items"
    ADD FOREIGN KEY ("volume_id") REFERENCES "volumes" ("id")
        ON UPDATE NO ACTION ON DELETE NO ACTION;