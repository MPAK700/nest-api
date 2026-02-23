import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProfileRefreshTokenAvatar1700000000000 implements MigrationInterface {
  name = 'InitProfileRefreshTokenAvatar1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "profile" (
        "id" SERIAL NOT NULL,
        "login" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "age" INTEGER NOT NULL,
        "description" VARCHAR(1000) NOT NULL,
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_profile_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_profile_login" UNIQUE ("login"),
        CONSTRAINT "UQ_profile_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_token" (
        "id" SERIAL NOT NULL,
        "jti" VARCHAR NOT NULL,
        "tokenHash" VARCHAR NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "revoked" BOOLEAN NOT NULL DEFAULT false,
        "profile_id" INTEGER,
        CONSTRAINT "PK_refresh_token_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_token_jti" UNIQUE ("jti"),
        CONSTRAINT "FK_refresh_token_profile"
          FOREIGN KEY ("profile_id")
          REFERENCES "profile"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "avatar" (
        "id" SERIAL NOT NULL,
        "fileName" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "profile_id" INTEGER,
        CONSTRAINT "PK_avatar_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_avatar_profile"
          FOREIGN KEY ("profile_id")
          REFERENCES "profile"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "avatar"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
