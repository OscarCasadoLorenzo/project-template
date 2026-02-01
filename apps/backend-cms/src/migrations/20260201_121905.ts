import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skills_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TABLE "positions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"skills_id" integer
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"level" "enum_skills_level",
  	"description" varchar,
  	"icon_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "positions_skills" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "positions_skills" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "skills_id" integer;
  ALTER TABLE "positions_rels" ADD CONSTRAINT "positions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "positions_rels" ADD CONSTRAINT "positions_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills" ADD CONSTRAINT "skills_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "positions_rels_order_idx" ON "positions_rels" USING btree ("order");
  CREATE INDEX "positions_rels_parent_idx" ON "positions_rels" USING btree ("parent_id");
  CREATE INDEX "positions_rels_path_idx" ON "positions_rels" USING btree ("path");
  CREATE INDEX "positions_rels_skills_id_idx" ON "positions_rels" USING btree ("skills_id");
  CREATE INDEX "skills_name_idx" ON "skills" USING btree ("name");
  CREATE INDEX "skills_category_idx" ON "skills" USING btree ("category");
  CREATE INDEX "skills_icon_idx" ON "skills" USING btree ("icon_id");
  CREATE INDEX "skills_updated_at_idx" ON "skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "skills" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("skills_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "positions_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skill" varchar NOT NULL
  );
  
  ALTER TABLE "positions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "skills" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "positions_rels" CASCADE;
  DROP TABLE "skills" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_skills_fk";
  
  DROP INDEX "payload_locked_documents_rels_skills_id_idx";
  ALTER TABLE "positions_skills" ADD CONSTRAINT "positions_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."positions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "positions_skills_order_idx" ON "positions_skills" USING btree ("_order");
  CREATE INDEX "positions_skills_parent_id_idx" ON "positions_skills" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "skills_id";
  DROP TYPE "public"."enum_skills_level";`)
}
