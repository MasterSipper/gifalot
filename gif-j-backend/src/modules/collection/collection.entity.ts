import { TransitionType } from 'src/shared/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';

export enum CollectionView {
  LIST = 'list',
  GRID = 'grid',
}

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({
    type: 'enum',
    enum: CollectionView,
    default: CollectionView.GRID,
  })
  public view: CollectionView;

  @Index()
  @Column({ default: true })
  public private: boolean;

  @Column({ default: 5000 })
  public timePerSlide: number;

  @Column({
    type: 'enum',
    enum: TransitionType,
    default: TransitionType.FADE_IN_OUT,
  })
  public transitionType: TransitionType;

  @Column({ type: 'varchar', nullable: true })
  public coverImageKey: string | null;

  @Column({ type: 'simple-array', nullable: true })
  public ranks: number[] | null;

  @OneToMany(() => File, (file) => file.collection, { onDelete: 'CASCADE' })
  public files: File[];

  @ManyToOne(() => User, (user) => user.collections, { onDelete: 'CASCADE' })
  public user: User;

  @RelationId((collection: Collection) => collection.user)
  public userId: number;

  @CreateDateColumn()
  public createdAt: Date;

  public toAPI(url?: string) {
    return {
      id: this.id,
      name: this.name,
      view: this.view,
      private: this.private,
      timePerSlide: this.timePerSlide,
      transitionType: this.transitionType,
      coverImageUrl: url ?? null,
      ranks: (this.ranks ?? []).map(Number),
    };
  }
}
