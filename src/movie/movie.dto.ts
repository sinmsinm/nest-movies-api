import { IsString, IsDate, IsDateString, IsOptional } from 'class-validator'
import { UserEntity } from 'src/user/user.entity';
import { UserRO } from 'src/user/user.dto';

export class MovieDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsDateString()
    released: Date;
}

export class MovieRO {
    id: string;
    title: string;
    released?: Date;
    updated: Date;
    created: Date;
    publisher: UserRO;
    upvotes?: number;
    downvotes?: number;
}