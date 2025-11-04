import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ranks1682596160811 implements MigrationInterface {
  name = 'Ranks1682596160811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collections" ADD "ranks" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "ranks"`);
  }
}
