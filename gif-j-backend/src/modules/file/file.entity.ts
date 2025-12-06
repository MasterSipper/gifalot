import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { FavoriteFile } from '../favorite/favorite.entity';
import { TransitionType } from 'src/shared/enums';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public ext: string;

  @Column()
  public mimeType: string;

  @Index()
  @Column({ default: 0 })
  public favoritesCount: number;

  @Column({ type: 'integer', nullable: true })
  public timePerSlide: number | null;

  @Column({
    type: 'enum',
    enum: TransitionType,
    nullable: true,
  })
  public transitionType: TransitionType | null;

  @Column({ type: 'varchar', nullable: true })
  public rotation: string | null;

  @Column({ type: 'varchar', nullable: true })
  public template: string | null;

  @Column({ type: 'varchar', nullable: true })
  public filter: string | null;

  @Column({ type: 'varchar', nullable: true })
  public originalUrl: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  public giphyId: string | null;

  @Column({ type: 'integer', nullable: true })
  public width: number | null;

  @Column({ type: 'integer', nullable: true })
  public height: number | null;

  @ManyToOne(() => Collection, (collection) => collection.files, {
    onDelete: 'CASCADE',
  })
  public collection: Collection;

  @OneToMany(() => FavoriteFile, (favorite) => favorite.file)
  public favoriteFiles: FavoriteFile[];

  @RelationId((file: File) => file.collection)
  public collectionId: number;

  public toAPI(url?: string, favoriteDate?: Date) {
    return {
      id: this.id,
      name: this.name,
      favoritesCount: this.favoritesCount,
      mimeType: this.mimeType,
      timePerSlide: this.timePerSlide,
      transitionType: this.transitionType,
      rotation: this.rotation,
      template: this.template,
      filter: this.filter,
      width: this.width,
      height: this.height,
      isFavorite: !!favoriteDate,
      favoriteDate: favoriteDate ?? null,
      url: url ?? null,
    };
  }
}
