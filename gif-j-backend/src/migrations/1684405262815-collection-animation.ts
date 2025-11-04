import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollectionAnimation1684405262815 implements MigrationInterface {
  name = 'CollectionAnimation1684405262815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" SET DEFAULT 'fadeInOut'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" SET DEFAULT 'dissolve'`,
    );
  }
}
