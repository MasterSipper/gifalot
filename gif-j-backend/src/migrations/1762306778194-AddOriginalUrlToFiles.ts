import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalUrlToFiles1762306778194 implements MigrationInterface {
    name = 'AddOriginalUrlToFiles1762306778194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`originalUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`originalUrl\``);
    }

}
