import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contest')
export class Contest {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  public id?: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  public name: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  public created_at?: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  public updated_at?: Date;
}
