import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWidthHeightToFiles1764870814063 implements MigrationInterface {
    name = 'AddWidthHeightToFiles1764870814063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_users_favorite_files_file\``);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_users_favorite_files_owner\``);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_users_favorite_files_user\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_files_collection\``);
        await queryRunner.query(`ALTER TABLE \`collections\` DROP FOREIGN KEY \`FK_collections_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_files_favoritesCount\` ON \`files\``);
        await queryRunner.query(`DROP INDEX \`IDX_collections_private\` ON \`collections\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`width\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`height\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat') NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`rotation\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`rotation\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`template\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`template\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`private\` \`private\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat') NOT NULL DEFAULT 'fadeInOut'`);
        await queryRunner.query(`CREATE INDEX \`IDX_72ef6836aa54c85b0e542505f4\` ON \`files\` (\`favoritesCount\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_236f472000bc27415fdbb5113b\` ON \`collections\` (\`private\`)`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_878df69dcae0c16b52974692848\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_f7e141bc95d7f48b335de9bf4c0\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_f0da1b2b1c9f12d6e29296448ff\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_2b0a7280095e9f022cfaf56036e\` FOREIGN KEY (\`collectionId\`) REFERENCES \`collections\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`collections\` ADD CONSTRAINT \`FK_da613d6625365707f8df0f65d81\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`collections\` DROP FOREIGN KEY \`FK_da613d6625365707f8df0f65d81\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_2b0a7280095e9f022cfaf56036e\``);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_f0da1b2b1c9f12d6e29296448ff\``);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_f7e141bc95d7f48b335de9bf4c0\``);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` DROP FOREIGN KEY \`FK_878df69dcae0c16b52974692848\``);
        await queryRunner.query(`DROP INDEX \`IDX_236f472000bc27415fdbb5113b\` ON \`collections\``);
        await queryRunner.query(`DROP INDEX \`IDX_72ef6836aa54c85b0e542505f4\` ON \`files\``);
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum CHARACTER SET "utf8mb4" COLLATE "utf8mb4_0900_ai_ci" ('dissolve', 'fadeInOut') NOT NULL DEFAULT 'fadeInOut'`);
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`private\` \`private\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`template\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`template\` varchar(10) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_0900_ai_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`rotation\``);
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`rotation\` varchar(10) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_0900_ai_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum CHARACTER SET "utf8mb4" COLLATE "utf8mb4_0900_ai_ci" ('dissolve', 'fadeInOut') NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`height\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`width\``);
        await queryRunner.query(`CREATE INDEX \`IDX_collections_private\` ON \`collections\` (\`private\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_files_favoritesCount\` ON \`files\` (\`favoritesCount\`)`);
        await queryRunner.query(`ALTER TABLE \`collections\` ADD CONSTRAINT \`FK_collections_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_files_collection\` FOREIGN KEY (\`collectionId\`) REFERENCES \`collections\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_users_favorite_files_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_users_favorite_files_owner\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_favorite_files\` ADD CONSTRAINT \`FK_users_favorite_files_file\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}







