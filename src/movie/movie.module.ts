import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieEntity } from './movie.entity';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity,UserEntity])],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule {}
