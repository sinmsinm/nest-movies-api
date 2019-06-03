import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { LoggingInterceptor } from './shared/loggin.iterceptio';
import { UserModule } from './user/user.module';





@Module({
  imports: [TypeOrmModule.forRoot(), MovieModule, UserModule],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor
      },
  ],
})
export class AppModule {}
