import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalUrlToFiles1762306778194 implements MigrationInterface {
    name = 'AddOriginalUrlToFiles1762306778194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column already exists before adding it
        const table = await queryRunner.getTable('files');
        const originalUrlColumn = table?.findColumnByName('originalUrl');
        
        if (!originalUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`files\` ADD \`originalUrl\` varchar(255) NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('files');
        const originalUrlColumn = table?.findColumnByName('originalUrl');
        
        if (originalUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`originalUrl\``);
        }
    }

}
