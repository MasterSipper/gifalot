import { MigrationInterface, QueryRunner } from 'typeorm';

export class FavoriteOwner1683788461422 implements MigrationInterface {
  name = 'FavoriteOwner1683788461422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionIn"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitionin_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionOut"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitionout_enum"`,
    );
    await queryRunner.query(`TRUNCATE TABLE "users_favorite_files" CASCADE`);
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" ADD "ownerId" integer`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_view_enum" AS ENUM('list', 'grid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "view" "public"."collections_view_enum" NOT NULL DEFAULT 'grid'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionType" "public"."collections_transitiontype_enum" NOT NULL DEFAULT 'dissolve'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" ADD CONSTRAINT "FK_f0da1b2b1c9f12d6e29296448ff" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" DROP CONSTRAINT "FK_f0da1b2b1c9f12d6e29296448ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" DROP COLUMN "transitionType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitiontype_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "view"`);
    await queryRunner.query(`DROP TYPE "public"."collections_view_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users_favorite_files" DROP COLUMN "ownerId"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitionout_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionOut" "public"."collections_transitionout_enum" NOT NULL DEFAULT 'dissolve'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitionin_enum" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ADD "transitionIn" "public"."collections_transitionin_enum" NOT NULL DEFAULT 'dissolve'`,
    );
  }
}
