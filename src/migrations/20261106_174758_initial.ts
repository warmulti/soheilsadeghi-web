import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`downloads_platforms\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`downloads_platforms_order_idx\` ON \`downloads_platforms\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`downloads_platforms_parent_idx\` ON \`downloads_platforms\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`downloads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`cover_id\` integer,
  	\`source\` text DEFAULT 'file',
  	\`file_id\` integer,
  	\`external_url\` text,
  	\`file_size\` text,
  	\`preview_id\` integer,
  	\`genre\` text,
  	\`bpm\` numeric,
  	\`musical_key\` text,
  	\`duration\` text,
  	\`version\` text,
  	\`license\` text,
  	\`slug\` text,
  	\`visibility\` text DEFAULT 'public',
  	\`featured\` integer,
  	\`published_at\` text,
  	\`download_count\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`preview_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`downloads_category_idx\` ON \`downloads\` (\`category\`);`)
  await db.run(sql`CREATE INDEX \`downloads_cover_idx\` ON \`downloads\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`downloads_file_idx\` ON \`downloads\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`downloads_preview_idx\` ON \`downloads\` (\`preview_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`downloads_slug_idx\` ON \`downloads\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`downloads_updated_at_idx\` ON \`downloads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`downloads_created_at_idx\` ON \`downloads\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`downloads__status_idx\` ON \`downloads\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`downloads_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`description\` text,
  	\`tracklist\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`downloads_locales_locale_parent_id_unique\` ON \`downloads_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`downloads_locales_parent_id_idx\` ON \`downloads_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`downloads_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`downloads_texts_order_parent\` ON \`downloads_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`downloads_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`groups_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`downloads_rels_order_idx\` ON \`downloads_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`downloads_rels_parent_idx\` ON \`downloads_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`downloads_rels_path_idx\` ON \`downloads_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`downloads_rels_groups_id_idx\` ON \`downloads_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE TABLE \`_downloads_v_version_platforms\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_downloads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_platforms_order_idx\` ON \`_downloads_v_version_platforms\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_platforms_parent_idx\` ON \`_downloads_v_version_platforms\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_downloads_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_category\` text,
  	\`version_cover_id\` integer,
  	\`version_source\` text DEFAULT 'file',
  	\`version_file_id\` integer,
  	\`version_external_url\` text,
  	\`version_file_size\` text,
  	\`version_preview_id\` integer,
  	\`version_genre\` text,
  	\`version_bpm\` numeric,
  	\`version_musical_key\` text,
  	\`version_duration\` text,
  	\`version_version\` text,
  	\`version_license\` text,
  	\`version_slug\` text,
  	\`version_visibility\` text DEFAULT 'public',
  	\`version_featured\` integer,
  	\`version_published_at\` text,
  	\`version_download_count\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`downloads\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_file_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_preview_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_downloads_v_parent_idx\` ON \`_downloads_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_category_idx\` ON \`_downloads_v\` (\`version_category\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_cover_idx\` ON \`_downloads_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_file_idx\` ON \`_downloads_v\` (\`version_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_preview_idx\` ON \`_downloads_v\` (\`version_preview_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_slug_idx\` ON \`_downloads_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_updated_at_idx\` ON \`_downloads_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version_created_at_idx\` ON \`_downloads_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_version_version__status_idx\` ON \`_downloads_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_created_at_idx\` ON \`_downloads_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_updated_at_idx\` ON \`_downloads_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_snapshot_idx\` ON \`_downloads_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_published_locale_idx\` ON \`_downloads_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_latest_idx\` ON \`_downloads_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_downloads_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_description\` text,
  	\`version_tracklist\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_downloads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_downloads_v_locales_locale_parent_id_unique\` ON \`_downloads_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_locales_parent_id_idx\` ON \`_downloads_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_downloads_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_downloads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_downloads_v_texts_order_parent\` ON \`_downloads_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_downloads_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`groups_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_downloads_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_downloads_v_rels_order_idx\` ON \`_downloads_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_rels_parent_idx\` ON \`_downloads_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_rels_path_idx\` ON \`_downloads_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_downloads_v_rels_groups_id_idx\` ON \`_downloads_v_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE TABLE \`materials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`course\` text DEFAULT 'general',
  	\`video_url\` text,
  	\`video_id\` integer,
  	\`audience\` text DEFAULT 'groups',
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`video_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`materials_video_idx\` ON \`materials\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`materials_updated_at_idx\` ON \`materials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`materials_created_at_idx\` ON \`materials\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`materials__status_idx\` ON \`materials\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`materials_locales\` (
  	\`title\` text,
  	\`summary\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`materials_locales_locale_parent_id_unique\` ON \`materials_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`materials_locales_parent_id_idx\` ON \`materials_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`materials_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`files_id\` integer,
  	\`groups_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`files_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`materials_rels_order_idx\` ON \`materials_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`materials_rels_parent_idx\` ON \`materials_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`materials_rels_path_idx\` ON \`materials_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`materials_rels_files_id_idx\` ON \`materials_rels\` (\`files_id\`);`)
  await db.run(sql`CREATE INDEX \`materials_rels_groups_id_idx\` ON \`materials_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE TABLE \`_materials_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_course\` text DEFAULT 'general',
  	\`version_video_url\` text,
  	\`version_video_id\` integer,
  	\`version_audience\` text DEFAULT 'groups',
  	\`version_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`materials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_video_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_materials_v_parent_idx\` ON \`_materials_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_version_version_video_idx\` ON \`_materials_v\` (\`version_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_version_version_updated_at_idx\` ON \`_materials_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_version_version_created_at_idx\` ON \`_materials_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_version_version__status_idx\` ON \`_materials_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_created_at_idx\` ON \`_materials_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_updated_at_idx\` ON \`_materials_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_snapshot_idx\` ON \`_materials_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_published_locale_idx\` ON \`_materials_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_latest_idx\` ON \`_materials_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_materials_v_locales\` (
  	\`version_title\` text,
  	\`version_summary\` text,
  	\`version_body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_materials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_materials_v_locales_locale_parent_id_unique\` ON \`_materials_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_locales_parent_id_idx\` ON \`_materials_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_materials_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`files_id\` integer,
  	\`groups_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_materials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`files_id\`) REFERENCES \`files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_materials_v_rels_order_idx\` ON \`_materials_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_rels_parent_idx\` ON \`_materials_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_rels_path_idx\` ON \`_materials_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_rels_files_id_idx\` ON \`_materials_v_rels\` (\`files_id\`);`)
  await db.run(sql`CREATE INDEX \`_materials_v_rels_groups_id_idx\` ON \`_materials_v_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_order_idx\` ON \`pages_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_parent_id_idx\` ON \`pages_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_path_idx\` ON \`pages_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_locale_idx\` ON \`pages_blocks_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_order_idx\` ON \`pages_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_parent_id_idx\` ON \`pages_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_path_idx\` ON \`pages_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_locale_idx\` ON \`pages_blocks_image\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_image_idx\` ON \`pages_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_locale_idx\` ON \`pages_blocks_cta\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`q\` text,
  	\`a\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_order_idx\` ON \`pages_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_parent_id_idx\` ON \`pages_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_items_locale_idx\` ON \`pages_blocks_faq_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_locale_idx\` ON \`pages_blocks_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_locale_idx\` ON \`pages_blocks_video\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_locales\` (
  	\`title\` text,
  	\`kicker\` text,
  	\`lead\` text,
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_locales_parent_id_idx\` ON \`pages_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_order_idx\` ON \`_pages_v_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_parent_id_idx\` ON \`_pages_v_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_path_idx\` ON \`_pages_v_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_locale_idx\` ON \`_pages_v_blocks_content\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_order_idx\` ON \`_pages_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_parent_id_idx\` ON \`_pages_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_path_idx\` ON \`_pages_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_locale_idx\` ON \`_pages_v_blocks_image\` (\`_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_image_idx\` ON \`_pages_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_href\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_locale_idx\` ON \`_pages_v_blocks_cta\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`q\` text,
  	\`a\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_order_idx\` ON \`_pages_v_blocks_faq_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_parent_id_idx\` ON \`_pages_v_blocks_faq_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_items_locale_idx\` ON \`_pages_v_blocks_faq_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_locale_idx\` ON \`_pages_v_blocks_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`url\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_locale_idx\` ON \`_pages_v_blocks_video\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_locales\` (
  	\`version_title\` text,
  	\`version_kicker\` text,
  	\`version_lead\` text,
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_locales_parent_id_idx\` ON \`_pages_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumb_url\` text,
  	\`sizes_thumb_width\` numeric,
  	\`sizes_thumb_height\` numeric,
  	\`sizes_thumb_mime_type\` text,
  	\`sizes_thumb_filesize\` numeric,
  	\`sizes_thumb_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumb_sizes_thumb_filename_idx\` ON \`media\` (\`sizes_thumb_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_locales_parent_id_idx\` ON \`media_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`files\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`files_updated_at_idx\` ON \`files\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`files_created_at_idx\` ON \`files\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`files_filename_idx\` ON \`files\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'student',
  	\`phone\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`users_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`groups_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`groups_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_rels_order_idx\` ON \`users_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_parent_idx\` ON \`users_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_path_idx\` ON \`users_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_groups_id_idx\` ON \`users_rels\` (\`groups_id\`);`)
  await db.run(sql`CREATE TABLE \`groups\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`course\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`groups_updated_at_idx\` ON \`groups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`groups_created_at_idx\` ON \`groups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`groups_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`groups_locales_locale_parent_id_unique\` ON \`groups_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`groups_locales_parent_id_idx\` ON \`groups_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`requests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`contact\` text NOT NULL,
  	\`service\` text,
  	\`format\` text,
  	\`time\` text,
  	\`message\` text,
  	\`locale\` text,
  	\`status\` text DEFAULT 'new',
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`requests_updated_at_idx\` ON \`requests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`requests_created_at_idx\` ON \`requests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
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
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_services_order_idx\` ON \`home_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_services_parent_id_idx\` ON \`home_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_services_locale_idx\` ON \`home_services\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_timeline_order_idx\` ON \`home_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_timeline_parent_id_idx\` ON \`home_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_timeline_locale_idx\` ON \`home_timeline\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home_techniques\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`subtitle\` text,
  	\`level\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_techniques_order_idx\` ON \`home_techniques\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_techniques_parent_id_idx\` ON \`home_techniques\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_techniques_locale_idx\` ON \`home_techniques\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`home_locales\` (
  	\`hero_primary\` text NOT NULL,
  	\`hero_secondary\` text NOT NULL,
  	\`scroll_hint\` text,
  	\`services_kicker\` text,
  	\`services_title\` text,
  	\`services_accent\` text,
  	\`services_lead\` text,
  	\`more_info\` text,
  	\`tt_kicker\` text,
  	\`tt_title\` text,
  	\`tt_title_accent\` text,
  	\`tt_intro\` text,
  	\`techniques_title\` text,
  	\`techniques_accent\` text,
  	\`techniques_lead\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`home_locales_locale_parent_id_unique\` ON \`home_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_locales_parent_id_idx\` ON \`home_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_texts_order_parent\` ON \`home_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_texts_locale_parent\` ON \`home_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_services_order_idx\` ON \`_home_v_version_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_services_parent_id_idx\` ON \`_home_v_version_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_services_locale_idx\` ON \`_home_v_version_services\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_timeline_order_idx\` ON \`_home_v_version_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_timeline_parent_id_idx\` ON \`_home_v_version_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_timeline_locale_idx\` ON \`_home_v_version_timeline\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_techniques\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`subtitle\` text,
  	\`level\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_techniques_order_idx\` ON \`_home_v_version_techniques\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_techniques_parent_id_idx\` ON \`_home_v_version_techniques\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_techniques_locale_idx\` ON \`_home_v_version_techniques\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_home_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_created_at_idx\` ON \`_home_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_updated_at_idx\` ON \`_home_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_locales\` (
  	\`version_hero_primary\` text NOT NULL,
  	\`version_hero_secondary\` text NOT NULL,
  	\`version_scroll_hint\` text,
  	\`version_services_kicker\` text,
  	\`version_services_title\` text,
  	\`version_services_accent\` text,
  	\`version_services_lead\` text,
  	\`version_more_info\` text,
  	\`version_tt_kicker\` text,
  	\`version_tt_title\` text,
  	\`version_tt_title_accent\` text,
  	\`version_tt_intro\` text,
  	\`version_techniques_title\` text,
  	\`version_techniques_accent\` text,
  	\`version_techniques_lead\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_v_locales_locale_parent_id_unique\` ON \`_home_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_locales_parent_id_idx\` ON \`_home_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_texts_order_parent\` ON \`_home_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_texts_locale_parent\` ON \`_home_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_tiers_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_highlights_order_idx\` ON \`djing_course_tiers_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_highlights_parent_id_idx\` ON \`djing_course_tiers_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_highlights_locale_idx\` ON \`djing_course_tiers_highlights\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_tiers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service_id\` text NOT NULL,
  	\`latin\` text,
  	\`title\` text NOT NULL,
  	\`level\` text,
  	\`sessions\` numeric NOT NULL,
  	\`minutes\` numeric NOT NULL,
  	\`format\` text,
  	\`audience\` text,
  	\`price\` text,
  	\`featured\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_order_idx\` ON \`djing_course_tiers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_parent_id_idx\` ON \`djing_course_tiers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_tiers_locale_idx\` ON \`djing_course_tiers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_syllabus_modules_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course_syllabus_modules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_topics_order_idx\` ON \`djing_course_syllabus_modules_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_topics_parent_id_idx\` ON \`djing_course_syllabus_modules_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_topics_locale_idx\` ON \`djing_course_syllabus_modules_topics\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_syllabus_modules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sessions\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course_syllabus\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_order_idx\` ON \`djing_course_syllabus_modules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_parent_id_idx\` ON \`djing_course_syllabus_modules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_modules_locale_idx\` ON \`djing_course_syllabus_modules\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_syllabus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`summary\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_order_idx\` ON \`djing_course_syllabus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_parent_id_idx\` ON \`djing_course_syllabus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_syllabus_locale_idx\` ON \`djing_course_syllabus\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_method\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_method_order_idx\` ON \`djing_course_method\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_method_parent_id_idx\` ON \`djing_course_method\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_method_locale_idx\` ON \`djing_course_method\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`q\` text NOT NULL,
  	\`a\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`djing_course_faq_order_idx\` ON \`djing_course_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_faq_parent_id_idx\` ON \`djing_course_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_faq_locale_idx\` ON \`djing_course_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`djing_course\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`djing_course_locales\` (
  	\`kicker\` text,
  	\`title\` text NOT NULL,
  	\`title_accent\` text,
  	\`lead\` text NOT NULL,
  	\`primary_cta\` text,
  	\`secondary_cta\` text,
  	\`tiers_kicker\` text,
  	\`tiers_title\` text,
  	\`tiers_lead\` text,
  	\`featured_badge\` text,
  	\`book_label\` text,
  	\`syllabus_kicker\` text,
  	\`syllabus_title\` text,
  	\`method_kicker\` text,
  	\`method_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`djing_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`djing_course_locales_locale_parent_id_unique\` ON \`djing_course_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`djing_course_locales_parent_id_idx\` ON \`djing_course_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_tiers_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v_version_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_highlights_order_idx\` ON \`_djing_course_v_version_tiers_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_highlights_parent_id_idx\` ON \`_djing_course_v_version_tiers_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_highlights_locale_idx\` ON \`_djing_course_v_version_tiers_highlights\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_tiers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`service_id\` text NOT NULL,
  	\`latin\` text,
  	\`title\` text NOT NULL,
  	\`level\` text,
  	\`sessions\` numeric NOT NULL,
  	\`minutes\` numeric NOT NULL,
  	\`format\` text,
  	\`audience\` text,
  	\`price\` text,
  	\`featured\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_order_idx\` ON \`_djing_course_v_version_tiers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_parent_id_idx\` ON \`_djing_course_v_version_tiers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_tiers_locale_idx\` ON \`_djing_course_v_version_tiers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_syllabus_modules_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v_version_syllabus_modules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_topics_order_idx\` ON \`_djing_course_v_version_syllabus_modules_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_topics_parent_id_idx\` ON \`_djing_course_v_version_syllabus_modules_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_topics_locale_idx\` ON \`_djing_course_v_version_syllabus_modules_topics\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_syllabus_modules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sessions\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v_version_syllabus\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_order_idx\` ON \`_djing_course_v_version_syllabus_modules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_parent_id_idx\` ON \`_djing_course_v_version_syllabus_modules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_modules_locale_idx\` ON \`_djing_course_v_version_syllabus_modules\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_syllabus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`summary\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_order_idx\` ON \`_djing_course_v_version_syllabus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_parent_id_idx\` ON \`_djing_course_v_version_syllabus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_syllabus_locale_idx\` ON \`_djing_course_v_version_syllabus\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_method\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_method_order_idx\` ON \`_djing_course_v_version_method\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_method_parent_id_idx\` ON \`_djing_course_v_version_method\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_method_locale_idx\` ON \`_djing_course_v_version_method\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_version_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`q\` text NOT NULL,
  	\`a\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_faq_order_idx\` ON \`_djing_course_v_version_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_faq_parent_id_idx\` ON \`_djing_course_v_version_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_version_faq_locale_idx\` ON \`_djing_course_v_version_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_djing_course_v_created_at_idx\` ON \`_djing_course_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_updated_at_idx\` ON \`_djing_course_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_djing_course_v_locales\` (
  	\`version_kicker\` text,
  	\`version_title\` text NOT NULL,
  	\`version_title_accent\` text,
  	\`version_lead\` text NOT NULL,
  	\`version_primary_cta\` text,
  	\`version_secondary_cta\` text,
  	\`version_tiers_kicker\` text,
  	\`version_tiers_title\` text,
  	\`version_tiers_lead\` text,
  	\`version_featured_badge\` text,
  	\`version_book_label\` text,
  	\`version_syllabus_kicker\` text,
  	\`version_syllabus_title\` text,
  	\`version_method_kicker\` text,
  	\`version_method_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_djing_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_djing_course_v_locales_locale_parent_id_unique\` ON \`_djing_course_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_djing_course_v_locales_parent_id_idx\` ON \`_djing_course_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_tracks_modules_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course_tracks_modules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_topics_order_idx\` ON \`ableton_course_tracks_modules_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_topics_parent_id_idx\` ON \`ableton_course_tracks_modules_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_topics_locale_idx\` ON \`ableton_course_tracks_modules_topics\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_tracks_modules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sessions\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course_tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_order_idx\` ON \`ableton_course_tracks_modules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_parent_id_idx\` ON \`ableton_course_tracks_modules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_modules_locale_idx\` ON \`ableton_course_tracks_modules\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_tracks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`summary\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_order_idx\` ON \`ableton_course_tracks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_parent_id_idx\` ON \`ableton_course_tracks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_tracks_locale_idx\` ON \`ableton_course_tracks\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_outcomes_order_idx\` ON \`ableton_course_outcomes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_outcomes_parent_id_idx\` ON \`ableton_course_outcomes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_outcomes_locale_idx\` ON \`ableton_course_outcomes\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_requirements_order_idx\` ON \`ableton_course_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_requirements_parent_id_idx\` ON \`ableton_course_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_requirements_locale_idx\` ON \`ableton_course_requirements\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`q\` text NOT NULL,
  	\`a\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_faq_order_idx\` ON \`ableton_course_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_faq_parent_id_idx\` ON \`ableton_course_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_faq_locale_idx\` ON \`ableton_course_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ableton_course_locales\` (
  	\`kicker\` text,
  	\`title\` text NOT NULL,
  	\`title_accent\` text,
  	\`lead\` text NOT NULL,
  	\`primary_cta\` text,
  	\`secondary_cta\` text,
  	\`meta_sessions\` numeric,
  	\`meta_minutes\` numeric,
  	\`meta_format\` text,
  	\`meta_level\` text,
  	\`curriculum_kicker\` text,
  	\`curriculum_title\` text,
  	\`curriculum_lead\` text,
  	\`outcomes_kicker\` text,
  	\`outcomes_title\` text,
  	\`requirements_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`ableton_course_locales_locale_parent_id_unique\` ON \`ableton_course_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_locales_parent_id_idx\` ON \`ableton_course_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ableton_course_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ableton_course\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ableton_course_texts_order_parent\` ON \`ableton_course_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ableton_course_texts_locale_parent\` ON \`ableton_course_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_tracks_modules_topics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v_version_tracks_modules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_topics_order_idx\` ON \`_ableton_course_v_version_tracks_modules_topics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_topics_parent_id_idx\` ON \`_ableton_course_v_version_tracks_modules_topics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_topics_locale_idx\` ON \`_ableton_course_v_version_tracks_modules_topics\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_tracks_modules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sessions\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v_version_tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_order_idx\` ON \`_ableton_course_v_version_tracks_modules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_parent_id_idx\` ON \`_ableton_course_v_version_tracks_modules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_modules_locale_idx\` ON \`_ableton_course_v_version_tracks_modules\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_tracks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`summary\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_order_idx\` ON \`_ableton_course_v_version_tracks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_parent_id_idx\` ON \`_ableton_course_v_version_tracks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_tracks_locale_idx\` ON \`_ableton_course_v_version_tracks\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_outcomes_order_idx\` ON \`_ableton_course_v_version_outcomes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_outcomes_parent_id_idx\` ON \`_ableton_course_v_version_outcomes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_outcomes_locale_idx\` ON \`_ableton_course_v_version_outcomes\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_requirements_order_idx\` ON \`_ableton_course_v_version_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_requirements_parent_id_idx\` ON \`_ableton_course_v_version_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_requirements_locale_idx\` ON \`_ableton_course_v_version_requirements\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_version_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`q\` text NOT NULL,
  	\`a\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_faq_order_idx\` ON \`_ableton_course_v_version_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_faq_parent_id_idx\` ON \`_ableton_course_v_version_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_version_faq_locale_idx\` ON \`_ableton_course_v_version_faq\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_created_at_idx\` ON \`_ableton_course_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_updated_at_idx\` ON \`_ableton_course_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_locales\` (
  	\`version_kicker\` text,
  	\`version_title\` text NOT NULL,
  	\`version_title_accent\` text,
  	\`version_lead\` text NOT NULL,
  	\`version_primary_cta\` text,
  	\`version_secondary_cta\` text,
  	\`version_meta_sessions\` numeric,
  	\`version_meta_minutes\` numeric,
  	\`version_meta_format\` text,
  	\`version_meta_level\` text,
  	\`version_curriculum_kicker\` text,
  	\`version_curriculum_title\` text,
  	\`version_curriculum_lead\` text,
  	\`version_outcomes_kicker\` text,
  	\`version_outcomes_title\` text,
  	\`version_requirements_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_ableton_course_v_locales_locale_parent_id_unique\` ON \`_ableton_course_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_locales_parent_id_idx\` ON \`_ableton_course_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ableton_course_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_ableton_course_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_texts_order_parent\` ON \`_ableton_course_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ableton_course_v_texts_locale_parent\` ON \`_ableton_course_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_controllers_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers_controllers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_points_order_idx\` ON \`buying_guide_tiers_controllers_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_points_parent_id_idx\` ON \`buying_guide_tiers_controllers_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_points_locale_idx\` ON \`buying_guide_tiers_controllers_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_controllers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_order_idx\` ON \`buying_guide_tiers_controllers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_parent_id_idx\` ON \`buying_guide_tiers_controllers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_controllers_locale_idx\` ON \`buying_guide_tiers_controllers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_headphones_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers_headphones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_points_order_idx\` ON \`buying_guide_tiers_headphones_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_points_parent_id_idx\` ON \`buying_guide_tiers_headphones_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_points_locale_idx\` ON \`buying_guide_tiers_headphones_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_headphones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_order_idx\` ON \`buying_guide_tiers_headphones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_parent_id_idx\` ON \`buying_guide_tiers_headphones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_headphones_locale_idx\` ON \`buying_guide_tiers_headphones\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_monitors_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers_monitors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_points_order_idx\` ON \`buying_guide_tiers_monitors_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_points_parent_id_idx\` ON \`buying_guide_tiers_monitors_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_points_locale_idx\` ON \`buying_guide_tiers_monitors_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers_monitors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_order_idx\` ON \`buying_guide_tiers_monitors\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_parent_id_idx\` ON \`buying_guide_tiers_monitors\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_monitors_locale_idx\` ON \`buying_guide_tiers_monitors\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_tiers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tier_id\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`budget\` text,
  	\`who\` text,
  	\`tip\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_order_idx\` ON \`buying_guide_tiers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_parent_id_idx\` ON \`buying_guide_tiers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_tiers_locale_idx\` ON \`buying_guide_tiers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_laptop_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`min\` text,
  	\`rec\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_rows_order_idx\` ON \`buying_guide_laptop_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_rows_parent_id_idx\` ON \`buying_guide_laptop_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_rows_locale_idx\` ON \`buying_guide_laptop_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_laptop_windows_tips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_windows_tips_order_idx\` ON \`buying_guide_laptop_windows_tips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_windows_tips_parent_id_idx\` ON \`buying_guide_laptop_windows_tips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_windows_tips_locale_idx\` ON \`buying_guide_laptop_windows_tips\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_laptop_mac_tips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_mac_tips_order_idx\` ON \`buying_guide_laptop_mac_tips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_mac_tips_parent_id_idx\` ON \`buying_guide_laptop_mac_tips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_laptop_mac_tips_locale_idx\` ON \`buying_guide_laptop_mac_tips\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_checklist_order_idx\` ON \`buying_guide_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_checklist_parent_id_idx\` ON \`buying_guide_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_checklist_locale_idx\` ON \`buying_guide_checklist\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`buying_guide_locales\` (
  	\`kicker\` text,
  	\`title\` text NOT NULL,
  	\`title_accent\` text,
  	\`lead\` text,
  	\`filter_label\` text,
  	\`budget_label\` text,
  	\`price_note\` text,
  	\`categories_controllers\` text,
  	\`categories_headphones\` text,
  	\`categories_monitors\` text,
  	\`laptop_kicker\` text,
  	\`laptop_title\` text,
  	\`laptop_lead\` text,
  	\`laptop_min_label\` text,
  	\`laptop_rec_label\` text,
  	\`laptop_windows_title\` text,
  	\`laptop_mac_title\` text,
  	\`checklist_title\` text,
  	\`consult_cta\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`buying_guide_locales_locale_parent_id_unique\` ON \`buying_guide_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_locales_parent_id_idx\` ON \`buying_guide_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`buying_guide_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`buying_guide\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`buying_guide_texts_order_parent\` ON \`buying_guide_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`buying_guide_texts_locale_parent\` ON \`buying_guide_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_controllers_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers_controllers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_points_order_idx\` ON \`_buying_guide_v_version_tiers_controllers_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_points_parent_id_idx\` ON \`_buying_guide_v_version_tiers_controllers_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_points_locale_idx\` ON \`_buying_guide_v_version_tiers_controllers_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_controllers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_order_idx\` ON \`_buying_guide_v_version_tiers_controllers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_parent_id_idx\` ON \`_buying_guide_v_version_tiers_controllers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_controllers_locale_idx\` ON \`_buying_guide_v_version_tiers_controllers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_headphones_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers_headphones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_points_order_idx\` ON \`_buying_guide_v_version_tiers_headphones_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_points_parent_id_idx\` ON \`_buying_guide_v_version_tiers_headphones_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_points_locale_idx\` ON \`_buying_guide_v_version_tiers_headphones_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_headphones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_order_idx\` ON \`_buying_guide_v_version_tiers_headphones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_parent_id_idx\` ON \`_buying_guide_v_version_tiers_headphones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_headphones_locale_idx\` ON \`_buying_guide_v_version_tiers_headphones\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_monitors_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers_monitors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_points_order_idx\` ON \`_buying_guide_v_version_tiers_monitors_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_points_parent_id_idx\` ON \`_buying_guide_v_version_tiers_monitors_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_points_locale_idx\` ON \`_buying_guide_v_version_tiers_monitors_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers_monitors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`brand\` text NOT NULL,
  	\`kind\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v_version_tiers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_order_idx\` ON \`_buying_guide_v_version_tiers_monitors\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_parent_id_idx\` ON \`_buying_guide_v_version_tiers_monitors\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_monitors_locale_idx\` ON \`_buying_guide_v_version_tiers_monitors\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_tiers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tier_id\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`latin\` text,
  	\`budget\` text,
  	\`who\` text,
  	\`tip\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_order_idx\` ON \`_buying_guide_v_version_tiers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_parent_id_idx\` ON \`_buying_guide_v_version_tiers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_tiers_locale_idx\` ON \`_buying_guide_v_version_tiers\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_laptop_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`min\` text,
  	\`rec\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_rows_order_idx\` ON \`_buying_guide_v_version_laptop_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_rows_parent_id_idx\` ON \`_buying_guide_v_version_laptop_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_rows_locale_idx\` ON \`_buying_guide_v_version_laptop_rows\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_laptop_windows_tips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_windows_tips_order_idx\` ON \`_buying_guide_v_version_laptop_windows_tips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_windows_tips_parent_id_idx\` ON \`_buying_guide_v_version_laptop_windows_tips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_windows_tips_locale_idx\` ON \`_buying_guide_v_version_laptop_windows_tips\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_laptop_mac_tips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_mac_tips_order_idx\` ON \`_buying_guide_v_version_laptop_mac_tips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_mac_tips_parent_id_idx\` ON \`_buying_guide_v_version_laptop_mac_tips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_laptop_mac_tips_locale_idx\` ON \`_buying_guide_v_version_laptop_mac_tips\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_version_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_checklist_order_idx\` ON \`_buying_guide_v_version_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_checklist_parent_id_idx\` ON \`_buying_guide_v_version_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_version_checklist_locale_idx\` ON \`_buying_guide_v_version_checklist\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_created_at_idx\` ON \`_buying_guide_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_updated_at_idx\` ON \`_buying_guide_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_locales\` (
  	\`version_kicker\` text,
  	\`version_title\` text NOT NULL,
  	\`version_title_accent\` text,
  	\`version_lead\` text,
  	\`version_filter_label\` text,
  	\`version_budget_label\` text,
  	\`version_price_note\` text,
  	\`version_categories_controllers\` text,
  	\`version_categories_headphones\` text,
  	\`version_categories_monitors\` text,
  	\`version_laptop_kicker\` text,
  	\`version_laptop_title\` text,
  	\`version_laptop_lead\` text,
  	\`version_laptop_min_label\` text,
  	\`version_laptop_rec_label\` text,
  	\`version_laptop_windows_title\` text,
  	\`version_laptop_mac_title\` text,
  	\`version_checklist_title\` text,
  	\`version_consult_cta\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_buying_guide_v_locales_locale_parent_id_unique\` ON \`_buying_guide_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_locales_parent_id_idx\` ON \`_buying_guide_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_buying_guide_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_buying_guide_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_texts_order_parent\` ON \`_buying_guide_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_buying_guide_v_texts_locale_parent\` ON \`_buying_guide_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`biography_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_story_order_idx\` ON \`biography_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_story_parent_id_idx\` ON \`biography_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_story_locale_idx\` ON \`biography_story\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography_chapters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_chapters_order_idx\` ON \`biography_chapters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_chapters_parent_id_idx\` ON \`biography_chapters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_chapters_locale_idx\` ON \`biography_chapters\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography_philosophy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_philosophy_order_idx\` ON \`biography_philosophy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_philosophy_parent_id_idx\` ON \`biography_philosophy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_philosophy_locale_idx\` ON \`biography_philosophy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography_stage\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_stage_order_idx\` ON \`biography_stage\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_stage_parent_id_idx\` ON \`biography_stage\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_stage_locale_idx\` ON \`biography_stage\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography_teaching\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_teaching_order_idx\` ON \`biography_teaching\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_teaching_parent_id_idx\` ON \`biography_teaching\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_teaching_locale_idx\` ON \`biography_teaching\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography_setup\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_setup_order_idx\` ON \`biography_setup\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`biography_setup_parent_id_idx\` ON \`biography_setup\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_setup_locale_idx\` ON \`biography_setup\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`biography\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`biography_locales\` (
  	\`kicker\` text,
  	\`title\` text NOT NULL,
  	\`lead\` text,
  	\`story_title\` text,
  	\`chapters_kicker\` text,
  	\`chapters_title\` text,
  	\`philosophy_kicker\` text,
  	\`philosophy_title\` text,
  	\`quote\` text,
  	\`stage_kicker\` text,
  	\`stage_title\` text,
  	\`stage_lead\` text,
  	\`teaching_kicker\` text,
  	\`teaching_title\` text,
  	\`setup_kicker\` text,
  	\`setup_title\` text,
  	\`setup_note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`biography_locales_locale_parent_id_unique\` ON \`biography_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_locales_parent_id_idx\` ON \`biography_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`biography_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`biography\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`biography_texts_order_parent\` ON \`biography_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`biography_texts_locale_parent\` ON \`biography_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_story_order_idx\` ON \`_biography_v_version_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_story_parent_id_idx\` ON \`_biography_v_version_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_story_locale_idx\` ON \`_biography_v_version_story\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_chapters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_chapters_order_idx\` ON \`_biography_v_version_chapters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_chapters_parent_id_idx\` ON \`_biography_v_version_chapters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_chapters_locale_idx\` ON \`_biography_v_version_chapters\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_philosophy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_philosophy_order_idx\` ON \`_biography_v_version_philosophy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_philosophy_parent_id_idx\` ON \`_biography_v_version_philosophy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_philosophy_locale_idx\` ON \`_biography_v_version_philosophy\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_stage\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_stage_order_idx\` ON \`_biography_v_version_stage\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_stage_parent_id_idx\` ON \`_biography_v_version_stage\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_stage_locale_idx\` ON \`_biography_v_version_stage\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_teaching\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_teaching_order_idx\` ON \`_biography_v_version_teaching\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_teaching_parent_id_idx\` ON \`_biography_v_version_teaching\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_teaching_locale_idx\` ON \`_biography_v_version_teaching\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_version_setup\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`group\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_version_setup_order_idx\` ON \`_biography_v_version_setup\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_setup_parent_id_idx\` ON \`_biography_v_version_setup\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_version_setup_locale_idx\` ON \`_biography_v_version_setup\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_created_at_idx\` ON \`_biography_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_updated_at_idx\` ON \`_biography_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_locales\` (
  	\`version_kicker\` text,
  	\`version_title\` text NOT NULL,
  	\`version_lead\` text,
  	\`version_story_title\` text,
  	\`version_chapters_kicker\` text,
  	\`version_chapters_title\` text,
  	\`version_philosophy_kicker\` text,
  	\`version_philosophy_title\` text,
  	\`version_quote\` text,
  	\`version_stage_kicker\` text,
  	\`version_stage_title\` text,
  	\`version_stage_lead\` text,
  	\`version_teaching_kicker\` text,
  	\`version_teaching_title\` text,
  	\`version_setup_kicker\` text,
  	\`version_setup_title\` text,
  	\`version_setup_note\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_biography_v_locales_locale_parent_id_unique\` ON \`_biography_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_locales_parent_id_idx\` ON \`_biography_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_biography_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_biography_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_biography_v_texts_order_parent\` ON \`_biography_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_biography_v_texts_locale_parent\` ON \`_biography_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_form_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service_id\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_form_services_order_idx\` ON \`contact_page_form_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_form_services_parent_id_idx\` ON \`contact_page_form_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_form_services_locale_idx\` ON \`contact_page_form_services\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`contact_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`contact_page_locales\` (
  	\`kicker\` text,
  	\`title\` text NOT NULL,
  	\`title_accent\` text,
  	\`lead\` text,
  	\`channels_title\` text,
  	\`channels_telegram_label\` text,
  	\`channels_telegram_action\` text,
  	\`channels_whatsapp_label\` text,
  	\`channels_whatsapp_action\` text,
  	\`channels_instagram_label\` text,
  	\`channels_instagram_action\` text,
  	\`response_label\` text,
  	\`hours_label\` text,
  	\`form_title\` text,
  	\`form_lead\` text,
  	\`form_name\` text,
  	\`form_contact\` text,
  	\`form_contact_hint\` text,
  	\`form_service\` text,
  	\`form_format\` text,
  	\`form_time\` text,
  	\`form_message\` text,
  	\`form_message_hint\` text,
  	\`form_submit\` text,
  	\`form_sending\` text,
  	\`form_required\` text,
  	\`form_success_title\` text,
  	\`form_success_text\` text,
  	\`form_fallback_title\` text,
  	\`form_fallback_text\` text,
  	\`form_new_request\` text,
  	\`form_message_header\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`contact_page_locales_locale_parent_id_unique\` ON \`contact_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_locales_parent_id_idx\` ON \`contact_page_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_texts_order_parent\` ON \`contact_page_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_texts_locale_parent\` ON \`contact_page_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_form_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`service_id\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_form_services_order_idx\` ON \`_contact_page_v_version_form_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_form_services_parent_id_idx\` ON \`_contact_page_v_version_form_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_form_services_locale_idx\` ON \`_contact_page_v_version_form_services\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_created_at_idx\` ON \`_contact_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_updated_at_idx\` ON \`_contact_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_locales\` (
  	\`version_kicker\` text,
  	\`version_title\` text NOT NULL,
  	\`version_title_accent\` text,
  	\`version_lead\` text,
  	\`version_channels_title\` text,
  	\`version_channels_telegram_label\` text,
  	\`version_channels_telegram_action\` text,
  	\`version_channels_whatsapp_label\` text,
  	\`version_channels_whatsapp_action\` text,
  	\`version_channels_instagram_label\` text,
  	\`version_channels_instagram_action\` text,
  	\`version_response_label\` text,
  	\`version_hours_label\` text,
  	\`version_form_title\` text,
  	\`version_form_lead\` text,
  	\`version_form_name\` text,
  	\`version_form_contact\` text,
  	\`version_form_contact_hint\` text,
  	\`version_form_service\` text,
  	\`version_form_format\` text,
  	\`version_form_time\` text,
  	\`version_form_message\` text,
  	\`version_form_message_hint\` text,
  	\`version_form_submit\` text,
  	\`version_form_sending\` text,
  	\`version_form_required\` text,
  	\`version_form_success_title\` text,
  	\`version_form_success_text\` text,
  	\`version_form_fallback_title\` text,
  	\`version_form_fallback_text\` text,
  	\`version_form_new_request\` text,
  	\`version_form_message_header\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_contact_page_v_locales_locale_parent_id_unique\` ON \`_contact_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_locales_parent_id_idx\` ON \`_contact_page_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_texts_order_parent\` ON \`_contact_page_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_texts_locale_parent\` ON \`_contact_page_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text NOT NULL,
  	\`photo_id\` integer,
  	\`photo_eye_line\` numeric DEFAULT 0.47,
  	\`telegram\` text,
  	\`instagram\` text,
  	\`whatsapp\` text,
  	\`email\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_photo_idx\` ON \`settings\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_locales\` (
  	\`name_local\` text NOT NULL,
  	\`bio_short\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`footer_text\` text,
  	\`photo_alt\` text,
  	\`response_time\` text,
  	\`hours\` text,
  	\`cta_band_title\` text,
  	\`cta_band_title_accent\` text,
  	\`cta_band_title_end\` text,
  	\`cta_band_text\` text,
  	\`cta_band_primary\` text,
  	\`cta_band_secondary\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`settings_locales_locale_parent_id_unique\` ON \`settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_locales_parent_id_idx\` ON \`settings_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_texts_order_parent\` ON \`settings_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_brand_name\` text NOT NULL,
  	\`version_photo_id\` integer,
  	\`version_photo_eye_line\` numeric DEFAULT 0.47,
  	\`version_telegram\` text,
  	\`version_instagram\` text,
  	\`version_whatsapp\` text,
  	\`version_email\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_version_version_photo_idx\` ON \`_settings_v\` (\`version_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_created_at_idx\` ON \`_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_updated_at_idx\` ON \`_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_locales\` (
  	\`version_name_local\` text NOT NULL,
  	\`version_bio_short\` text NOT NULL,
  	\`version_description\` text NOT NULL,
  	\`version_footer_text\` text,
  	\`version_photo_alt\` text,
  	\`version_response_time\` text,
  	\`version_hours\` text,
  	\`version_cta_band_title\` text,
  	\`version_cta_band_title_accent\` text,
  	\`version_cta_band_title_end\` text,
  	\`version_cta_band_text\` text,
  	\`version_cta_band_primary\` text,
  	\`version_cta_band_secondary\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_settings_v_locales_locale_parent_id_unique\` ON \`_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_settings_v_locales_parent_id_idx\` ON \`_settings_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_settings_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_settings_v_texts_order_parent\` ON \`_settings_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_children_order_idx\` ON \`navigation_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_children_parent_id_idx\` ON \`navigation_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_children_locale_idx\` ON \`navigation_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`navigation_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`short\` text,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_items_order_idx\` ON \`navigation_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_parent_id_idx\` ON \`navigation_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`navigation_items_locale_idx\` ON \`navigation_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_items_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_children_order_idx\` ON \`_navigation_v_version_items_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_children_parent_id_idx\` ON \`_navigation_v_version_items_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_children_locale_idx\` ON \`_navigation_v_version_items_children\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`short\` text,
  	\`href\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_order_idx\` ON \`_navigation_v_version_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_parent_id_idx\` ON \`_navigation_v_version_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_items_locale_idx\` ON \`_navigation_v_version_items\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`chat_settings_presets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chat_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_settings_presets_order_idx\` ON \`chat_settings_presets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_presets_parent_id_idx\` ON \`chat_settings_presets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_presets_locale_idx\` ON \`chat_settings_presets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`chat_settings_kb_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chat_settings_kb\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_steps_order_idx\` ON \`chat_settings_kb_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_steps_parent_id_idx\` ON \`chat_settings_kb_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_steps_locale_idx\` ON \`chat_settings_kb_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`chat_settings_kb\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kb_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`outro\` text,
  	\`escalate\` text DEFAULT 'none',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chat_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_order_idx\` ON \`chat_settings_kb\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_parent_id_idx\` ON \`chat_settings_kb\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_kb_locale_idx\` ON \`chat_settings_kb\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`chat_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`chat_settings_locales\` (
  	\`launcher\` text,
  	\`title\` text,
  	\`mode_ai\` text,
  	\`mode_builtin\` text,
  	\`greeting\` text,
  	\`presets_title\` text,
  	\`placeholder\` text,
  	\`send\` text,
  	\`close\` text,
  	\`typing\` text,
  	\`direct\` text,
  	\`error\` text,
  	\`summary_title\` text,
  	\`summary_hint\` text,
  	\`send_telegram\` text,
  	\`send_whatsapp\` text,
  	\`copy\` text,
  	\`copied\` text,
  	\`back_to_chat\` text,
  	\`escalation_hardware\` text,
  	\`escalation_registration\` text,
  	\`escalation_routing\` text,
  	\`escalation_unresolved\` text,
  	\`escalation_complex\` text,
  	\`escalation_manual\` text,
  	\`summary_greeting\` text,
  	\`summary_topic\` text,
  	\`summary_default_topic\` text,
  	\`summary_problem\` text,
  	\`summary_details\` text,
  	\`summary_gear\` text,
  	\`summary_tried\` text,
  	\`summary_no_messages\` text,
  	\`replies_hello\` text,
  	\`replies_thanks\` text,
  	\`replies_unresolved\` text,
  	\`replies_followup\` text,
  	\`replies_fallback\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`chat_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`chat_settings_locales_locale_parent_id_unique\` ON \`chat_settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_locales_parent_id_idx\` ON \`chat_settings_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`chat_settings_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`chat_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_settings_texts_order_parent\` ON \`chat_settings_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_settings_texts_locale_parent\` ON \`chat_settings_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v_version_presets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_chat_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_presets_order_idx\` ON \`_chat_settings_v_version_presets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_presets_parent_id_idx\` ON \`_chat_settings_v_version_presets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_presets_locale_idx\` ON \`_chat_settings_v_version_presets\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v_version_kb_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_chat_settings_v_version_kb\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_steps_order_idx\` ON \`_chat_settings_v_version_kb_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_steps_parent_id_idx\` ON \`_chat_settings_v_version_kb_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_steps_locale_idx\` ON \`_chat_settings_v_version_kb_steps\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v_version_kb\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kb_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`outro\` text,
  	\`escalate\` text DEFAULT 'none',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_chat_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_order_idx\` ON \`_chat_settings_v_version_kb\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_parent_id_idx\` ON \`_chat_settings_v_version_kb\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_version_kb_locale_idx\` ON \`_chat_settings_v_version_kb\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_created_at_idx\` ON \`_chat_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_updated_at_idx\` ON \`_chat_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v_locales\` (
  	\`version_launcher\` text,
  	\`version_title\` text,
  	\`version_mode_ai\` text,
  	\`version_mode_builtin\` text,
  	\`version_greeting\` text,
  	\`version_presets_title\` text,
  	\`version_placeholder\` text,
  	\`version_send\` text,
  	\`version_close\` text,
  	\`version_typing\` text,
  	\`version_direct\` text,
  	\`version_error\` text,
  	\`version_summary_title\` text,
  	\`version_summary_hint\` text,
  	\`version_send_telegram\` text,
  	\`version_send_whatsapp\` text,
  	\`version_copy\` text,
  	\`version_copied\` text,
  	\`version_back_to_chat\` text,
  	\`version_escalation_hardware\` text,
  	\`version_escalation_registration\` text,
  	\`version_escalation_routing\` text,
  	\`version_escalation_unresolved\` text,
  	\`version_escalation_complex\` text,
  	\`version_escalation_manual\` text,
  	\`version_summary_greeting\` text,
  	\`version_summary_topic\` text,
  	\`version_summary_default_topic\` text,
  	\`version_summary_problem\` text,
  	\`version_summary_details\` text,
  	\`version_summary_gear\` text,
  	\`version_summary_tried\` text,
  	\`version_summary_no_messages\` text,
  	\`version_replies_hello\` text,
  	\`version_replies_thanks\` text,
  	\`version_replies_unresolved\` text,
  	\`version_replies_followup\` text,
  	\`version_replies_fallback\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_chat_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_chat_settings_v_locales_locale_parent_id_unique\` ON \`_chat_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_locales_parent_id_idx\` ON \`_chat_settings_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_chat_settings_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_chat_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_texts_order_parent\` ON \`_chat_settings_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chat_settings_v_texts_locale_parent\` ON \`_chat_settings_v_texts\` (\`locale\`,\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`downloads_platforms\`;`)
  await db.run(sql`DROP TABLE \`downloads\`;`)
  await db.run(sql`DROP TABLE \`downloads_locales\`;`)
  await db.run(sql`DROP TABLE \`downloads_texts\`;`)
  await db.run(sql`DROP TABLE \`downloads_rels\`;`)
  await db.run(sql`DROP TABLE \`_downloads_v_version_platforms\`;`)
  await db.run(sql`DROP TABLE \`_downloads_v\`;`)
  await db.run(sql`DROP TABLE \`_downloads_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_downloads_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_downloads_v_rels\`;`)
  await db.run(sql`DROP TABLE \`materials\`;`)
  await db.run(sql`DROP TABLE \`materials_locales\`;`)
  await db.run(sql`DROP TABLE \`materials_rels\`;`)
  await db.run(sql`DROP TABLE \`_materials_v\`;`)
  await db.run(sql`DROP TABLE \`_materials_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_materials_v_rels\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`files\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`users_rels\`;`)
  await db.run(sql`DROP TABLE \`groups\`;`)
  await db.run(sql`DROP TABLE \`groups_locales\`;`)
  await db.run(sql`DROP TABLE \`requests\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`home_services\`;`)
  await db.run(sql`DROP TABLE \`home_timeline\`;`)
  await db.run(sql`DROP TABLE \`home_techniques\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`home_locales\`;`)
  await db.run(sql`DROP TABLE \`home_texts\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_services\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_timeline\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_techniques\`;`)
  await db.run(sql`DROP TABLE \`_home_v\`;`)
  await db.run(sql`DROP TABLE \`_home_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_v_texts\`;`)
  await db.run(sql`DROP TABLE \`djing_course_tiers_highlights\`;`)
  await db.run(sql`DROP TABLE \`djing_course_tiers\`;`)
  await db.run(sql`DROP TABLE \`djing_course_syllabus_modules_topics\`;`)
  await db.run(sql`DROP TABLE \`djing_course_syllabus_modules\`;`)
  await db.run(sql`DROP TABLE \`djing_course_syllabus\`;`)
  await db.run(sql`DROP TABLE \`djing_course_method\`;`)
  await db.run(sql`DROP TABLE \`djing_course_faq\`;`)
  await db.run(sql`DROP TABLE \`djing_course\`;`)
  await db.run(sql`DROP TABLE \`djing_course_locales\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_tiers_highlights\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_tiers\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_syllabus_modules_topics\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_syllabus_modules\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_syllabus\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_method\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_version_faq\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v\`;`)
  await db.run(sql`DROP TABLE \`_djing_course_v_locales\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_tracks_modules_topics\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_tracks_modules\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_tracks\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_outcomes\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_requirements\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_faq\`;`)
  await db.run(sql`DROP TABLE \`ableton_course\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_locales\`;`)
  await db.run(sql`DROP TABLE \`ableton_course_texts\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_tracks_modules_topics\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_tracks_modules\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_tracks\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_outcomes\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_requirements\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_version_faq\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_ableton_course_v_texts\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_controllers_points\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_controllers\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_headphones_points\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_headphones\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_monitors_points\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers_monitors\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_tiers\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_laptop_rows\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_laptop_windows_tips\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_laptop_mac_tips\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_checklist\`;`)
  await db.run(sql`DROP TABLE \`buying_guide\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_locales\`;`)
  await db.run(sql`DROP TABLE \`buying_guide_texts\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_controllers_points\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_controllers\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_headphones_points\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_headphones\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_monitors_points\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers_monitors\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_tiers\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_laptop_rows\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_laptop_windows_tips\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_laptop_mac_tips\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_version_checklist\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_buying_guide_v_texts\`;`)
  await db.run(sql`DROP TABLE \`biography_story\`;`)
  await db.run(sql`DROP TABLE \`biography_chapters\`;`)
  await db.run(sql`DROP TABLE \`biography_philosophy\`;`)
  await db.run(sql`DROP TABLE \`biography_stage\`;`)
  await db.run(sql`DROP TABLE \`biography_teaching\`;`)
  await db.run(sql`DROP TABLE \`biography_setup\`;`)
  await db.run(sql`DROP TABLE \`biography\`;`)
  await db.run(sql`DROP TABLE \`biography_locales\`;`)
  await db.run(sql`DROP TABLE \`biography_texts\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_story\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_chapters\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_philosophy\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_stage\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_teaching\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_version_setup\`;`)
  await db.run(sql`DROP TABLE \`_biography_v\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_biography_v_texts\`;`)
  await db.run(sql`DROP TABLE \`contact_page_form_services\`;`)
  await db.run(sql`DROP TABLE \`contact_page\`;`)
  await db.run(sql`DROP TABLE \`contact_page_locales\`;`)
  await db.run(sql`DROP TABLE \`contact_page_texts\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_form_services\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_texts\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`DROP TABLE \`settings_locales\`;`)
  await db.run(sql`DROP TABLE \`settings_texts\`;`)
  await db.run(sql`DROP TABLE \`_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_settings_v_texts\`;`)
  await db.run(sql`DROP TABLE \`navigation_items_children\`;`)
  await db.run(sql`DROP TABLE \`navigation_items\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_items_children\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_items\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`chat_settings_presets\`;`)
  await db.run(sql`DROP TABLE \`chat_settings_kb_steps\`;`)
  await db.run(sql`DROP TABLE \`chat_settings_kb\`;`)
  await db.run(sql`DROP TABLE \`chat_settings\`;`)
  await db.run(sql`DROP TABLE \`chat_settings_locales\`;`)
  await db.run(sql`DROP TABLE \`chat_settings_texts\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v_version_presets\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v_version_kb_steps\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v_version_kb\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_chat_settings_v_texts\`;`)
}
