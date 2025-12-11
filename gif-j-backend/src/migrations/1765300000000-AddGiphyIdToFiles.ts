import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGiphyIdToFiles1765300000000 implements MigrationInterface {
    name = 'AddGiphyIdToFiles1765300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`giphyId\` varchar(255) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_files_giphyId\` ON \`files\` (\`giphyId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_files_giphyId\` ON \`files\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`giphyId\``);
    }
}





