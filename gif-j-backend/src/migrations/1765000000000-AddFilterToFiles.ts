import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilterToFiles1765000000000 implements MigrationInterface {
    name = 'AddFilterToFiles1765000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`filter\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`filter\``);
    }
}

