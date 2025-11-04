import { MigrationInterface, QueryRunner } from 'typeorm';

export class File1682024038731 implements MigrationInterface {
  name = 'File1682024038731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "ext" character varying NOT NULL, "mimeType" character varying NOT NULL, "collectionId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" TYPE text`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_2b0a7280095e9f022cfaf56036e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "roles" TYPE character varying`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
