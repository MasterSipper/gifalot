import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'users_favorite_files' })
export class FavoriteFile {
  @PrimaryColumn()
  public userId: number;

  @ManyToOne(() => User, (user) => user.favoriteFiles, { onDelete: 'CASCADE' })
  public user: User;

  @PrimaryColumn()
  public fileId: number;

  @ManyToOne(() => File, (file) => file.favoriteFiles, { onDelete: 'CASCADE' })
  public file: File;

  @ManyToOne(() => User, (user) => user.ownerOf, { onDelete: 'CASCADE' })
  public owner: User;

  @RelationId((favoriteFile: FavoriteFile) => favoriteFile.owner)
  public ownerId: number;

  @CreateDateColumn()
  public createdAt: Date;
}
