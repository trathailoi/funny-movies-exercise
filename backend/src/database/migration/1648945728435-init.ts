import {MigrationInterface, QueryRunner} from "typeorm";

export class init1648945728435 implements MigrationInterface {
    name = 'init1648945728435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sample" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creationAccountName" text NOT NULL, "creationHostTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "modificationAccountName" text, "modificationHostTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "modificationTimestamp" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "PK_1e92238b098b5a4d13f6422cba7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "modifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "sample"`);
    }

}
