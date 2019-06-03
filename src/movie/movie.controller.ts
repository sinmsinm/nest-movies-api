import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards, Logger } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDTO } from './movie.dto';
import { ValidationPipe } from '../shared/validation.pipeline';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('movie')
export class MovieController {
    
    private logger = new Logger ('MovieController');
    
    constructor (private movieService: MovieService) {

    }

    private logData (options: any) {
        options.user && this.logger.log ('USER ' + JSON.stringify(options.user));
        options.data && this.logger.log ('DATA ' + JSON.stringify(options.data));
        options.id && this.logger.log ('MOVIE ' + JSON.stringify(options.id));
    }

    @Get()
    showAllMovies(){
        return this.movieService.showAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    createMovie(@User('id') user: string, @Body() data: MovieDTO){
        this.logData ({user, data});
        return this.movieService.create(data,user);
    }

    @Get(':id') 
    readMovie(@Param('id') id: string){
        return this.movieService.read(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateMovie(@Body() data: MovieDTO, @Param('id') id: string,@User('id') userId){
        return this.movieService.update(id,data,userId);
    }
    
    @Delete (':id')
    deleteMovie(@Param('id') id: string){
        return this.movieService.destroy (id);
    }

    @Post(':id/favourite')
    @UseGuards(new AuthGuard())
    markAsFavourite(@Param('id') movieId: string, @User('id') userId: string) {
        this.logData ('Hello here' + {movieId, userId});
        return this.movieService.addToFavourites (movieId,userId);
    }
    
    @Post(':id/notfavourite')
    @UseGuards(new AuthGuard())
    unmarkAsFavourite(@Param('id') movieId: string, @User('id') userId: string) {
        this.logData ({movieId, userId});
        return this.movieService.deleteFromFavourites (movieId,userId);
    }

    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvote (@Param('id') movieId: string, @User('id') userId: string){
        return this.movieService.upvote(movieId,userId);
    }
    
    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downvote (@Param('id') movieId: string, @User('id') userId: string){
        return this.movieService.downvote(movieId,userId);
    }

}
