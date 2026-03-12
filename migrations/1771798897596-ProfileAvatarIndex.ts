import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileAvatarIndex1771798897596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
          CREATE INDEX idx_profile_active_age
          ON profile (age, id)
          WHERE "deletedAt" IS NULL
              AND "description" IS NOT NULL
          `);

      await queryRunner.query(`
          CREATE INDEX idx_avatar_profile_created_desc
          ON avatar (profile_id, "createdAt" DESC)
          WHERE "deletedAt" IS NULL
          `);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
          DROP INDEX idx_avatar_profile_created_desc
          `);

      await queryRunner.query(`
          DROP INDEX idx_profile_active_age
          `);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
