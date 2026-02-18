import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "skills" DROP CONSTRAINT IF EXISTS "skills_icon_id_media_id_fk";
  DROP INDEX IF EXISTS "skills_icon_idx";
  DROP INDEX IF EXISTS "skills_name_idx";
  CREATE UNIQUE INDEX "skills_name_idx" ON "skills" USING btree ("name");
  ALTER TABLE "skills" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "skills" DROP COLUMN IF EXISTS "icon_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "skills_name_idx";
  ALTER TABLE "skills" ADD COLUMN "description" varchar;
  ALTER TABLE "skills" ADD COLUMN "icon_id" integer;
  ALTER TABLE "skills" ADD CONSTRAINT "skills_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "skills_icon_idx" ON "skills" USING btree ("icon_id");
  CREATE INDEX "skills_name_idx" ON "skills" USING btree ("name");`)
}
