import { Factory, Seeder } from 'typeorm-seeding'
// import { Connection } from 'typeorm'

import { User } from '../../../user/user.entity'
import { Movie } from '../../../modules/movie/movie.entity'
import { Reaction } from '../../../modules/reaction/reaction.entity'

export default class InitialDatabaseSeed implements Seeder {
  // public async run(factory: Factory, connection: Connection): Promise<void> {
  public async run(factory: Factory): Promise<void> {
    const users = await factory(User)().createMany(3)
    // console.log('users', users)

    const movies = await factory(Movie)()
      .map(async (movie) => {
        const tmpMovie = movie
        tmpMovie.author = users[Math.floor(Math.random() * users.length)]
        return tmpMovie
      })
      .createMany(3)
    // console.log('movies', movies)

    // TODO: @trathailoi need to find a way to avoid dupliation the unique constraint
    const reactions = await factory(Reaction)()
      .map(async (reaction) => {
        const tmpReaction = reaction
        tmpReaction.user = users[Math.floor(Math.random() * users.length)]
        tmpReaction.movie = movies[Math.floor(Math.random() * movies.length)]
        return tmpReaction
      })
      .createMany(5)
    console.log('reactions', reactions)
  }
}
