import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skills_categories" AS ENUM('frontend', 'backend', 'database', 'devops', 'cloud', 'mobile', 'testing', 'security', 'agile', 'tools', 'design', 'architecture', 'ai-ml', 'data-science', 'api', 'version-control', 'ci-cd', 'monitoring', 'performance', 'blockchain');
  CREATE TABLE "skills_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_skills_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  DROP INDEX "skills_category_idx";
  ALTER TABLE "skills_categories" ADD CONSTRAINT "skills_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "skills_categories_order_idx" ON "skills_categories" USING btree ("order");
  CREATE INDEX "skills_categories_parent_idx" ON "skills_categories" USING btree ("parent_id");
  CREATE INDEX "skills_categories_value_idx" ON "skills_categories" USING btree ("value");
  ALTER TABLE "skills" DROP COLUMN "category";
  ALTER TABLE "skills" DROP COLUMN "level";
  DROP TYPE "public"."enum_skills_level";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_skills_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  ALTER TABLE "skills_categories" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "skills_categories" CASCADE;
  ALTER TABLE "skills" ADD COLUMN "category" varchar;
  ALTER TABLE "skills" ADD COLUMN "level" "enum_skills_level";
  CREATE INDEX "skills_category_idx" ON "skills" USING btree ("category");
  DROP TYPE "public"."enum_skills_categories";`)
}
