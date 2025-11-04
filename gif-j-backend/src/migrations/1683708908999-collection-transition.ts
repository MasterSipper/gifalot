import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollectionTransition1683708908999 implements MigrationInterface {
  name = 'CollectionTransition1683708908999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitiontype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitionin_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionIn" "public"."collections_transitionin_enum" NOT NULL DEFAULT 'dissolve'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitionout_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionOut" "public"."collections_transitionout_enum" NOT NULL DEFAULT 'dissolve'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionOut"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitionout_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionIn"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitionin_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionType" "public"."collections_transitiontype_enum" NOT NULL DEFAULT 'dissolve'`,
    );
  }
}
