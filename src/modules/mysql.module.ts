import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.ORIGAMI_DB_HOST,
      port: +process.env.ORIGAMI_DB_PORT,
      username: process.env.ORIGAMI_DB_USERNAME,
      password: process.env.ORIGAMI_DB_PASSWORD,
      database: process.env.ORIGAMI_DB_DATABASE,
      entities: ['src/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: false,
    }),
  ],
})
export class MySQLModule {}
