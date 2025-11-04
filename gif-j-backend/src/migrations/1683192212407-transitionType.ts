import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransitionType1683192212407 implements MigrationInterface {
  name = 'TransitionType1683192212407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionType" "public"."collections_transitiontype_enum" NOT NULL DEFAULT 'dissolve'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitiontype_enum"`,
    );
  }
}
