import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { MovieDTO, MovieRO} from './movie.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserRO } from 'src/user/user.dto';
import { Votes } from './votes.enum';
 
@Injectable()
export class MovieService {
    
    constructor (
        @InjectRepository(MovieEntity) private movieRepository: Repository <MovieEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository <UserEntity>) {
    }

    private ensureOwnership (movie: MovieEntity, userId: string) {
        if (movie.publisher.id !== userId) {
            throw new HttpException ('You\'re not allowed to change this movie',HttpStatus.UNAUTHORIZED);
        }
    }
    

    private cleanMovie (movie: MovieEntity): MovieRO | null {
        const movieToClean: any = {...movie, publisher: movie.publisher ? movie.publisher.toResponseObject(false): null};

        if (movieToClean.upvotes) {
            movieToClean.upvotes = movieToClean.upvotes.length;
        }

        if (movieToClean.downvotes) {
            movieToClean.downvotes = movieToClean.downvotes.length;
        }
    
        return movieToClean;
    }

    async showAll(): Promise <MovieRO[]>  {
        const movies = await this.movieRepository.find({ relations: ['publisher','upvotes','downvotes']});
        return movies.map ((movie) => this.cleanMovie(movie));
    }

    async create (data: Partial <MovieDTO>, userId: string): Promise <MovieRO> {
        const user = await this.userRepository.findOne ({where: {id: userId}})
        const movie = await this.movieRepository.create ({...data,publisher: user});

        await this.movieRepository.save(movie);
        return this.cleanMovie(movie);
    }

    async read (id: string): Promise <MovieRO> {
        const movie = await this.movieRepository.findOne ({where: {id}, relations: ['publisher','upvotes','downvotes']});

        if (!movie) {
            throw new HttpException ('Not found', HttpStatus.NOT_FOUND);
        }

        return this.cleanMovie (movie);
    }

    async update (id: string, data: Partial <MovieDTO>,userId): Promise<MovieRO> {
        const movie = await this.movieRepository.findOne ({where: {id}, relations:['publisher']});
        
        if (!movie) {
            throw new HttpException ('Not found', HttpStatus.NOT_FOUND);
        }

        this.ensureOwnership(movie,userId);

        await this.movieRepository.update(id, data);
        return this.cleanMovie (await this.movieRepository.findOne(id));
    }

    async destroy (id: string) {
        const movie = await this.movieRepository.findOne ({where: {id}});
        
        if (!movie) {
            return new HttpException ('Not found', HttpStatus.NOT_FOUND);
        }
        
        await this.movieRepository.delete (id);
        return {deleted: true};
    }

    async addToFavourites (movieId: string, userId: string): Promise <UserRO> {
        const movie = await this.movieRepository.findOne ({where: {movieId}});
        const user = await this.userRepository.findOne ({where: {id: userId}, relations:['favourites']});

        if (!movie) {
            throw new HttpException ('Movie not found', HttpStatus.NOT_FOUND);
        }

        if (user.favourites.filter (favouriteMovie => favouriteMovie.id === movie.id).length < 1) {
            user.favourites.push(movie);
            await this.userRepository.save(user);
        } else{
            throw new HttpException ('Movie already was in favourites', HttpStatus.BAD_REQUEST);   
        }
        
        return user.toResponseObject();
    }

    async deleteFromFavourites (movieId: string, userId: string): Promise <UserRO> {
        const movie = await this.movieRepository.findOne ({where: {movieId}});
        const user = await this.userRepository.findOne ({where: {id: userId}, relations:['favourites']});

        if (!movie) {
            throw new HttpException ('Movie not found', HttpStatus.NOT_FOUND);
        }

        if (user.favourites.filter (favoriteMovie => favoriteMovie.id === movie.id).length > 0) {
            user.favourites = user.favourites.filter (favoriteMovie => favoriteMovie.id !== movie.id);
            await this.userRepository.save(user);
        } else{
            throw new HttpException ('Movie already was in favourites', HttpStatus.BAD_REQUEST);   
        }
        
        return user.toResponseObject();
    }


    private async vote(movie: MovieEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if (
          movie[opposite].filter(voter => voter.id === user.id).length > 0) {
          movie[opposite] = movie[opposite].filter(voter => voter.id !== user.id);
          await this.movieRepository.save(movie);
        } 
        
        if (movie[vote].filter(voter => voter.id === user.id).length > 0) {
            movie[vote] = movie[vote].filter(voter => voter.id !== user.id);
            await this.movieRepository.save(movie);
        } else if (movie[vote].filter(voter => voter.id === user.id).length < 1) {
          movie[vote].push(user);
          await this.movieRepository.save(movie);
        } else {
          throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }
    
        return movie;
      }

    async upvote(id: string, userId: string) {
        let movie = await this.movieRepository.findOne({
          where: { id },
          relations: ['publisher', 'upvotes', 'downvotes'],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        movie = await this.vote(movie, user, Votes.UP);
    
        return this.cleanMovie(movie);
      }
    
      async downvote(id: string, userId: string) {
        let movie = await this.movieRepository.findOne({
          where: { id },
          relations: ['publisher', 'upvotes', 'downvotes'],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        movie = await this.vote(movie, user, Votes.DOWN);
    
        return this.cleanMovie(movie);
      }
}
