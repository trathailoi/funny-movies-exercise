import { IUser } from '../../user/user.interface'

export interface IMovie {
  id: string;
  title: string;
  desc: string;
  thumbnailPath: string;
  srcPath: string;
  author: IUser;
}
