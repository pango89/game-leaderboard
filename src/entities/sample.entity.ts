import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sample {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  public id?: number;

  @Column({ name: 'symbol', type: 'varchar', length: 50 })
  public symbol: string;

  @Column({ name: 'buy_date', type: 'timestamp' })
  public buyDate: Date;

  @Column({ name: 'buy_price', type: 'decimal' })
  public buyPrice: number;

  @Column({ name: 'days', type: 'integer' })
  public days: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  public created_at: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public updated_at: Date;
}
