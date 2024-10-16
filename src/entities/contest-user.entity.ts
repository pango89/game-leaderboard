import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export class DecimalColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity('contest_user')
export class ContestUser {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  public id?: number;

  @Column({ name: 'contest_id', type: 'integer' })
  public contestId: number;

  @Column({ name: 'user_id', type: 'integer' })
  public userId: number;

  @Column({ name: 'username', type: 'varchar', length: 100 })
  public username: string;

  @Column({
    name: 'score',
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  public score: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  public created_at?: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public updated_at?: Date;
}
