import { IsNotEmpty } from "class-validator";
import { MovieEntity } from "src/movie/movie.entity";

export class UserDTO {

    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;
}


export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
    movies?: MovieEntity[];
    favourites?: MovieEntity[];
}