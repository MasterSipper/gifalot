import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { FavoriteFile } from '../favorite/favorite.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({ type: 'simple-array', nullable: false })
  public roles: string[];

  @OneToMany(() => Collection, (collection) => collection.user)
  public collections: Collection[];

  @OneToMany(() => FavoriteFile, (favorite) => favorite.user)
  public favoriteFiles: FavoriteFile[];

  @OneToMany(() => FavoriteFile, (favorite) => favorite.owner)
  public ownerOf: FavoriteFile[];

  public toAPI() {
    return {
      id: this.id,
      email: this.email,
      roles: this.roles,
    };
  }
}
