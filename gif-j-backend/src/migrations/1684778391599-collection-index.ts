import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollectionIndex1684778391599 implements MigrationInterface {
  name = 'CollectionIndex1684778391599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_236f472000bc27415fdbb5113b" ON "collections" ("private") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_236f472000bc27415fdbb5113b"`,
    );
  }
}
