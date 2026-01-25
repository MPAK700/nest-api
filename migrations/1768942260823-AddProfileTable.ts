import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileTable1768942260823 implements MigrationInterface {
  name = 'AddProfileTable1768942260823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "jti" character varying NOT NULL, "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "profile_id" integer, CONSTRAINT "UQ_e532a5fe469da358494917ce2bf" UNIQUE ("jti"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "description" character varying(1000) NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_046f2b4c31fc341220622ee2f61" UNIQUE ("login"), CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_f1d60c5653a322f7501fb1d9b90" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_f1d60c5653a322f7501fb1d9b90"`,
    );
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
