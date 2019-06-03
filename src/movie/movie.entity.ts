import { Entity,  Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
 
@Entity('Movies')
export class MovieEntity {
    @PrimaryGeneratedColumn('uuid') 
    id: string;
 
    @Column({length: 160}) 
    title: string;
 
    @Column({length: 100}) 
    description: string;

    @Column({
        nullable: true,
        default: null
    }) 
    released: Date;

    @CreateDateColumn() 
    created: Date;
    
    @UpdateDateColumn() 
    updated: Date;

    @ManyToOne (
        type => UserEntity, 
        publisher => publisher.movies
    ) 
    publisher: UserEntity;

    @ManyToMany(
        type=>UserEntity,
        {cascade:true}
    )
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(
        type=>UserEntity,
        {cascade:true}
    )
    @JoinTable()
    downvotes: UserEntity[];

 
}




