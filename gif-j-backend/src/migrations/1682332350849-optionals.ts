import { MigrationInterface, QueryRunner } from 'typeorm';

export class Optionals1682332350849 implements MigrationInterface {
  name = 'Optionals1682332350849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "private" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" SET DEFAULT '3000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "private" DROP DEFAULT`,
    );
  }
}
