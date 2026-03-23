import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOutboxEvent1771900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`
        CREATE TYPE "outbox_event_status_enum" AS ENUM (
          'pending',
          'processing',
          'processed'
        )
      `);

      await queryRunner.query(`
        CREATE TABLE "outbox_event" (
          "id" SERIAL NOT NULL,
          "eventType" character varying NOT NULL,
          "payload" json NOT NULL,
          "status" "outbox_event_status_enum" NOT NULL DEFAULT 'pending',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_outbox_event_id" PRIMARY KEY ("id")
        )
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`
        DROP TABLE "outbox_event"
      `);

      await queryRunner.query(`
        DROP TYPE "outbox_event_status_enum"
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
