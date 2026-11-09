import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_gallery_order_idx\` ON \`products_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_parent_id_idx\` ON \`products_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_image_idx\` ON \`products_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`buy_type\` text DEFAULT 'link',
  	\`buy_url\` text,
  	\`slug\` text,
  	\`featured\` integer,
  	\`order\` numeric DEFAULT 0,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products_image_idx\` ON \`products\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`products_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`price\` text,
  	\`old_price\` text,
  	\`badge\` text,
  	\`buy_button_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_locales_locale_parent_id_unique\` ON \`products_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_locales_parent_id_idx\` ON \`products_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_texts_order_parent\` ON \`products_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_order_idx\` ON \`_products_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_parent_id_idx\` ON \`_products_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_image_idx\` ON \`_products_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_image_id\` integer,
  	\`version_buy_type\` text DEFAULT 'link',
  	\`version_buy_url\` text,
  	\`version_slug\` text,
  	\`version_featured\` integer,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_image_idx\` ON \`_products_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_snapshot_idx\` ON \`_products_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_published_locale_idx\` ON \`_products_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_price\` text,
  	\`version_old_price\` text,
  	\`version_badge\` text,
  	\`version_buy_button_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_products_v_locales_locale_parent_id_unique\` ON \`_products_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_locales_parent_id_idx\` ON \`_products_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_texts_order_parent\` ON \`_products_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`bookings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`event_type\` text,
  	\`event_date\` text,
  	\`city\` text,
  	\`venue\` text,
  	\`guests\` numeric,
  	\`budget\` text,
  	\`message\` text,
  	\`locale\` text,
  	\`status\` text DEFAULT 'new',
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`bookings_updated_at_idx\` ON \`bookings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`bookings_created_at_idx\` ON \`bookings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`products_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`products_page_locales\` (
  	\`title\` text NOT NULL,
  	\`lead\` text,
  	\`empty\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_page_locales_locale_parent_id_unique\` ON \`products_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_page_locales_parent_id_idx\` ON \`products_page_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_kicker\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_page_v_created_at_idx\` ON \`_products_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_page_v_updated_at_idx\` ON \`_products_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_products_page_v_locales\` (
  	\`version_title\` text NOT NULL,
  	\`version_lead\` text,
  	\`version_empty\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_products_page_v_locales_locale_parent_id_unique\` ON \`_products_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_page_v_locales_parent_id_idx\` ON \`_products_page_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`booking_page_event_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`booking_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`booking_page_event_types_order_idx\` ON \`booking_page_event_types\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`booking_page_event_types_parent_id_idx\` ON \`booking_page_event_types\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`booking_page_event_types_locale_idx\` ON \`booking_page_event_types\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`booking_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`booking_page_locales\` (
  	\`title\` text NOT NULL,
  	\`lead\` text,
  	\`intro\` text,
  	\`success_title\` text,
  	\`success_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`booking_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`booking_page_locales_locale_parent_id_unique\` ON \`booking_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`booking_page_locales_parent_id_idx\` ON \`booking_page_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_booking_page_v_version_event_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_booking_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_booking_page_v_version_event_types_order_idx\` ON \`_booking_page_v_version_event_types\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_booking_page_v_version_event_types_parent_id_idx\` ON \`_booking_page_v_version_event_types\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_booking_page_v_version_event_types_locale_idx\` ON \`_booking_page_v_version_event_types\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_booking_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_kicker\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_booking_page_v_created_at_idx\` ON \`_booking_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_booking_page_v_updated_at_idx\` ON \`_booking_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_booking_page_v_locales\` (
  	\`version_title\` text NOT NULL,
  	\`version_lead\` text,
  	\`version_intro\` text,
  	\`version_success_title\` text,
  	\`version_success_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_booking_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_booking_page_v_locales_locale_parent_id_unique\` ON \`_booking_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_booking_page_v_locales_parent_id_idx\` ON \`_booking_page_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`bookings_id\` integer REFERENCES bookings(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products_gallery\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_locales\`;`)
  await db.run(sql`DROP TABLE \`products_texts\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`_products_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_products_v_texts\`;`)
  await db.run(sql`DROP TABLE \`bookings\`;`)
  await db.run(sql`DROP TABLE \`products_page\`;`)
  await db.run(sql`DROP TABLE \`products_page_locales\`;`)
  await db.run(sql`DROP TABLE \`_products_page_v\`;`)
  await db.run(sql`DROP TABLE \`_products_page_v_locales\`;`)
  await db.run(sql`DROP TABLE \`booking_page_event_types\`;`)
  await db.run(sql`DROP TABLE \`booking_page\`;`)
  await db.run(sql`DROP TABLE \`booking_page_locales\`;`)
  await db.run(sql`DROP TABLE \`_booking_page_v_version_event_types\`;`)
  await db.run(sql`DROP TABLE \`_booking_page_v\`;`)
  await db.run(sql`DROP TABLE \`_booking_page_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`downloads_id\` integer,
  	\`materials_id\` integer,
  	\`pages_id\` integer,
  	\`media_id\` integer,
  	\`files_id\` integer,
  	\`users_id\` integer,
  	\`groups_id\` integer,
  	\`requests_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`downloads_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`materials_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`files_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`requests_id\`) REFERENCES \`requests\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "downloads_id", "materials_id", "pages_id", "media_id", "files_id", "users_id", "groups_id", "requests_id") SELECT "id", "order", "parent_id", "path", "downloads_id", "materials_id", "pages_id", "media_id", "files_id", "users_id", "groups_id", "requests_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_downloads_id_idx\` ON \`payload_locked_documents_rels\` (\`downloads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_materials_id_idx\` ON \`payload_locked_documents_rels\` (\`materials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_files_id_idx\` ON \`payload_locked_documents_rels\` (\`files_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`requests_id\`);`)
}
