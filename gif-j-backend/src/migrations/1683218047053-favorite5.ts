import { MigrationInterface, QueryRunner } from 'typeorm';

export class Favorite51683218047053 implements MigrationInterface {
  name = 'Favorite51683218047053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_favorite_files" ("userId" integer NOT NULL, "fileId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b803412a5b40d13704dddd90386" PRIMARY KEY ("userId", "fileId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD "favoritesCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" ADD CONSTRAINT "FK_878df69dcae0c16b52974692848" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" ADD CONSTRAINT "FK_f7e141bc95d7f48b335de9bf4c0" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_favorites_count()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE files
        SET "favoritesCount" = "favoritesCount" + 1
        WHERE id = NEW."fileId";
      ELSIF TG_OP = 'DELETE' THEN
        UPDATE files
        SET "favoritesCount" = "favoritesCount" - 1
        WHERE id = OLD."fileId";
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER update_favorites_count
    AFTER INSERT OR DELETE ON "public"."users_favorite_files"
    FOR EACH ROW
    EXECUTE FUNCTION update_favorites_count();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" DROP CONSTRAINT "FK_f7e141bc95d7f48b335de9bf4c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" DROP CONSTRAINT "FK_878df69dcae0c16b52974692848"`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "favoritesCount"`);
    await queryRunner.query(`
    DROP TRIGGER IF EXISTS update_favorites_count ON users_favorite_files;
    DROP FUNCTION IF EXISTS update_favorites_count();`);
    await queryRunner.query(`DROP TABLE "users_favorite_files"`);
  }
}
