import { Entity, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, Column, ManyToMany, OneToMany, UpdateDateColumn, JoinTable } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from "./user.dto";
import { MovieService } from "src/movie/movie.service";
import { MovieEntity } from "src/movie/movie.entity";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @CreateDateColumn() 
    created: Date;

    @UpdateDateColumn () 
    updated: Date;

    @Column({
        type: 'varchar',
        length: '160',
        unique: true,
    }) username: string;
    @Column('text') 
    password: string;
    
    @OneToMany(
        type => MovieEntity,
        movie => movie.publisher
    ) movies: MovieEntity[];

    @ManyToMany(
        type=>MovieEntity,
        {cascade:true}
    )
    @JoinTable()
    favourites: MovieEntity[];

    @BeforeInsert()
    async hashPassword () {
        this.password = await bcrypt.hash (this.password, 10);
    }

    toResponseObject(showToken : boolean = true): UserRO {
        const {id, username, created, token}  = this;

        const user: UserRO = {id, username, created };

        if (showToken) {
            user.token = token;    
        }

        if (this.movies) {
            user.movies = this.movies;
        }

        if (this.favourites) {
            user.favourites = this.favourites;
        }

        return user;
    }

    async comparePassword (attempt: string) {
        return await bcrypt.compare (attempt,this.password);
    }

    private get token () {
        const {id, username} = this;
        return jwt.sign (
            {id, username},
            process.env.SECRET,
            { expiresIn: '7d'}
        );
    }
}