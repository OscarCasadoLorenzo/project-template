import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_visibility" AS ENUM('public', 'private');
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_skills_categories" AS ENUM('frontend', 'backend', 'database', 'devops', 'cloud', 'mobile', 'testing', 'security', 'agile', 'tools', 'design', 'architecture', 'ai-ml', 'data-science', 'api', 'version-control', 'ci-cd', 'monitoring', 'performance', 'blockchain');
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"status" "enum_blog_posts_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"author_id" integer NOT NULL,
  	"reading_time" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "skills_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_skills_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  DROP INDEX "media_filename_idx";
  DROP INDEX "skills_category_idx";
  ALTER TABLE "media" ALTER COLUMN "filename" SET NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "mime_type" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "r2_key" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "file_size" numeric NOT NULL;
  ALTER TABLE "media" ADD COLUMN "duration" numeric;
  ALTER TABLE "media" ADD COLUMN "visibility" "enum_media_visibility" DEFAULT 'public' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "uploaded_by_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_posts_id" integer;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_texts" ADD CONSTRAINT "blog_posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_categories" ADD CONSTRAINT "skills_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_cover_image_idx" ON "blog_posts" USING btree ("cover_image_id");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "blog_posts_texts_order_parent" ON "blog_posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "skills_categories_order_idx" ON "skills_categories" USING btree ("order");
  CREATE INDEX "skills_categories_parent_idx" ON "skills_categories" USING btree ("parent_id");
  CREATE INDEX "skills_categories_value_idx" ON "skills_categories" USING btree ("value");
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_r2_key_idx" ON "media" USING btree ("r2_key");
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  ALTER TABLE "media" DROP COLUMN "url";
  ALTER TABLE "media" DROP COLUMN "thumbnail_u_r_l";
  ALTER TABLE "media" DROP COLUMN "filesize";
  ALTER TABLE "media" DROP COLUMN "focal_x";
  ALTER TABLE "media" DROP COLUMN "focal_y";
  ALTER TABLE "skills" DROP COLUMN "category";
  ALTER TABLE "skills" DROP COLUMN "level";
  DROP TYPE "public"."enum_skills_level";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skills_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  ALTER TABLE "blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skills_categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_texts" CASCADE;
  DROP TABLE "skills_categories" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_uploaded_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_posts_fk";
  
  DROP INDEX "media_r2_key_idx";
  DROP INDEX "media_uploaded_by_idx";
  DROP INDEX "payload_locked_documents_rels_blog_posts_id_idx";
  ALTER TABLE "media" ALTER COLUMN "filename" DROP NOT NULL;
  ALTER TABLE "media" ALTER COLUMN "mime_type" DROP NOT NULL;
  ALTER TABLE "media" ADD COLUMN "url" varchar;
  ALTER TABLE "media" ADD COLUMN "thumbnail_u_r_l" varchar;
  ALTER TABLE "media" ADD COLUMN "filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_x" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_y" numeric;
  ALTER TABLE "skills" ADD COLUMN "category" varchar;
  ALTER TABLE "skills" ADD COLUMN "level" "enum_skills_level";
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "skills_category_idx" ON "skills" USING btree ("category");
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "media" DROP COLUMN "r2_key";
  ALTER TABLE "media" DROP COLUMN "file_size";
  ALTER TABLE "media" DROP COLUMN "duration";
  ALTER TABLE "media" DROP COLUMN "visibility";
  ALTER TABLE "media" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_posts_id";
  DROP TYPE "public"."enum_media_visibility";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum_skills_categories";`)
}
