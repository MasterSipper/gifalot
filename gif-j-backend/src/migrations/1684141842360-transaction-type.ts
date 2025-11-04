import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionType1684141842360 implements MigrationInterface {
  name = 'TransactionType1684141842360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."files_transitiontype_enum" RENAME TO "files_transitiontype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."files_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "transitionType" TYPE "public"."files_transitiontype_enum" USING "transitionType"::"text"::"public"."files_transitiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."files_transitiontype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."collections_transitiontype_enum" RENAME TO "collections_transitiontype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitiontype_enum" AS ENUM('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" TYPE "public"."collections_transitiontype_enum" USING "transitionType"::"text"::"public"."collections_transitiontype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" SET DEFAULT 'dissolve'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitiontype_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."collections_transitiontype_enum_old" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" TYPE "public"."collections_transitiontype_enum_old" USING "transitionType"::"text"::"public"."collections_transitiontype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collections" ALTER COLUMN "transitionType" SET DEFAULT 'dissolve'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."collections_transitiontype_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."collections_transitiontype_enum_old" RENAME TO "collections_transitiontype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."files_transitiontype_enum_old" AS ENUM('dissolve', 'fadeIn', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat')`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "transitionType" TYPE "public"."files_transitiontype_enum_old" USING "transitionType"::"text"::"public"."files_transitiontype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."files_transitiontype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."files_transitiontype_enum_old" RENAME TO "files_transitiontype_enum"`,
    );
  }
}
