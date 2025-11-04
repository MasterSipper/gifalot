import { MigrationInterface, QueryRunner } from 'typeorm';

export class File21682321322121 implements MigrationInterface {
  name = 'File21682321322121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "timePerSlide" integer NOT NULL DEFAULT 2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "timePerSlide"`,
    );
  }
}
