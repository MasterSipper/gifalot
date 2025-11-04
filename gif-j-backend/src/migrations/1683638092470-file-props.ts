import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileProps1683638092470 implements MigrationInterface {
  name = 'FileProps1683638092470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "timePerSlide" integer`);
    await queryRunner.query(
      `CREATE TYPE "public"."files_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD "transitionType" "public"."files_transitiontype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD "rotation" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72ef6836aa54c85b0e542505f4" ON "files" ("favoritesCount") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_72ef6836aa54c85b0e542505f4"`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "rotation"`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "transitionType"`);
    await queryRunner.query(`DROP TYPE "public"."files_transitiontype_enum"`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "timePerSlide"`);
  }
}
