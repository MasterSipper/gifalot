import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTurbulentDissolveTransition1765200000000 implements MigrationInterface {
    name = 'AddTurbulentDissolveTransition1765200000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'turbulentDissolve' to the files.transitionType enum
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment', 'turbulentDissolve') NULL`);
        
        // Add 'turbulentDissolve' to the collections.transitionType enum
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment', 'turbulentDissolve') NOT NULL DEFAULT 'fadeInOut'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove 'turbulentDissolve' from the files.transitionType enum
        await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment') NULL`);
        
        // Remove 'turbulentDissolve' from the collections.transitionType enum
        await queryRunner.query(`ALTER TABLE \`collections\` CHANGE \`transitionType\` \`transitionType\` enum ('dissolve', 'fadeIn', 'fadeInOut', 'flash', 'rubberBand', 'shakeX', 'shakeY', 'wobble', 'jello', 'heartBeat', 'fragment') NOT NULL DEFAULT 'fadeInOut'`);
    }
}
