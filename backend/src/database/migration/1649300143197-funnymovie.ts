import {MigrationInterface, QueryRunner} from "typeorm";

export class funnymovie1649300143197 implements MigrationInterface {
    name = 'funnymovie1649300143197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "modifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "title" character varying(100) NOT NULL, "desc" character varying(500) NOT NULL, "thumbnailPath" character varying(300) NOT NULL, "srcPath" character varying(300) NOT NULL, "createdById" uuid, "modifiedById" uuid, "authorId" uuid, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "modifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "action" character varying(20) NOT NULL, "createdById" uuid, "modifiedById" uuid, "userId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "unique_reaction_index" UNIQUE ("userId", "action", "movieId"), CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "modifiedAt" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_4e9f6e68788d5eae5488a758008" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_dbc0d4129de7b51ec6fc2126883" FOREIGN KEY ("modifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_d9154cda59a72e184b0384776ac" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_04b04a6dea8e433daecacf047eb" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_fd9e52f259ab94dfc047e890d96" FOREIGN KEY ("modifiedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_f2042ec0815a13a471836795e41" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_f2042ec0815a13a471836795e41"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_fd9e52f259ab94dfc047e890d96"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_04b04a6dea8e433daecacf047eb"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_d9154cda59a72e184b0384776ac"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_dbc0d4129de7b51ec6fc2126883"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_4e9f6e68788d5eae5488a758008"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "modifiedAt" SET DEFAULT '2022-04-07 02:54:49.364215+00'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2022-04-07 02:54:49.364215+00'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "reaction"`);
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}
