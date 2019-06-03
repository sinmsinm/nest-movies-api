import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    request.user =  await this.validateToken(request.headers.authorization);
    return true;
  }


  async validateToken (auth: string) {
      if (auth.split(' ')[0] !== 'Bearer') {
          throw new HttpException (
              'Invalid authorization token',
              HttpStatus.BAD_REQUEST
          );
    
      }

      const token = auth.split(' ')[1];
      try {
        const decode = await jwt.decode (
            token,
            process.env.SECRET
        );
        return decode;

      } catch (err) {
        throw new HttpException (
            'Invalid authorization token:' + (err.message || err.name),
            HttpStatus.FORBIDDEN
        );

      }

  }

}