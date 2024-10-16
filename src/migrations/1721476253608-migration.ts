import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migration11721476253608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stock_recommendation',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'strategy',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'symbol',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'horizon',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'buy_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'buy_price',
            type: 'decimal',
            precision: 20,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'target_price',
            type: 'decimal',
            precision: 20,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'sell_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'sell_price',
            type: 'decimal',
            precision: 20,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'days',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'gain_percent',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stock_recommendation');
  }
}
