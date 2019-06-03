import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';



@Controller()
export class UserController {

constructor (private userService: UserService) {}


@Get('api/users')
@UseGuards(new AuthGuard())
showAllUser(){
    return this.userService.showAllUsers();
}

@Post('login')
@UsePipes(new ValidationPipe())
login (@Body() user: UserDTO) {
    return this.userService.login(user);
}

@Post('register')
@UsePipes(new ValidationPipe())
register(@Body() data: UserDTO){
    return this.userService.register(data);
}


}
