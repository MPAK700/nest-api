import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceNumeric1771858291358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profile"
            ADD COLUMN "balance" NUMERIC(12,2) NOT NULL DEFAULT 0
            CHECK ("balance" >= 0)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profile"
            DROP COLUMN "balance"
        `);
  }
}
