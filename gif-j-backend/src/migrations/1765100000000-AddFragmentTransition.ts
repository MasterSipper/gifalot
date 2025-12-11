import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFragmentTransition1765100000000 implements MigrationInterface {
    name = 'AddFragmentTransition1765100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'fragment' to the files.transitionType enum
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment') NULL`);
        
        // Add 'fragment' to the collections.transitionType enum
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment') NOT NULL DEFAULT 'fadeInOut'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove 'fragment' from the files.transitionType enum
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat') NULL`);
        
        // Remove 'fragment' from the collections.transitionType enum
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat') NOT NULL DEFAULT 'fadeInOut'`);
    }
}


