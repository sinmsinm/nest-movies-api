import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { MovieEntity } from 'src/movie/movie.entity';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,MovieEntity])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
