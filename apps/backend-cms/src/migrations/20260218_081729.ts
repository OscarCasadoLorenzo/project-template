import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "positions_highlights" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_uploaded_by_id_users_id_fk";
  DROP INDEX IF EXISTS "media_uploaded_by_idx";
  
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'media' AND column_name = 'prefix'
    ) THEN
      ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'dev';
    END IF;
  END $$;
  
  ALTER TABLE "media" DROP COLUMN IF EXISTS "r2_key";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "uploaded_by_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "positions_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"highlight" varchar NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "r2_key" varchar;
  ALTER TABLE "media" ADD COLUMN "uploaded_by_id" integer;
  ALTER TABLE "positions_highlights" ADD CONSTRAINT "positions_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."positions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "positions_highlights_order_idx" ON "positions_highlights" USING btree ("_order");
  CREATE INDEX "positions_highlights_parent_id_idx" ON "positions_highlights" USING btree ("_parent_id");
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  ALTER TABLE "media" DROP COLUMN "prefix";`)
}
