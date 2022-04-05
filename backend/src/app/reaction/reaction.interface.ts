import { IUser } from '../../user/user.interface'
import { IMovie } from '../movie/movie.interface'

export interface IReaction {
  id: string
  action: string
  user: IUser
  movie: IMovie
}
