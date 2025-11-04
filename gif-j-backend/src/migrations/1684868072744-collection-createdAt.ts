import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollectionCreatedAt1684868072744 implements MigrationInterface {
  name = 'CollectionCreatedAt1684868072744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "createdAt"`,
    );
  }
}
