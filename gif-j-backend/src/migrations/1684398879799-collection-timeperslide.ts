import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollectionTimeperslide1684398879799 implements MigrationInterface {
  name = 'CollectionTimeperslide1684398879799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" SET DEFAULT '4000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "timePerSlide" SET DEFAULT '3000'`,
    );
  }
}
