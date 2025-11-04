import { MigrationInterface, QueryRunner } from 'typeorm';

export class File31682323842481 implements MigrationInterface {
  name = 'File31682323842481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" SET DEFAULT '2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
