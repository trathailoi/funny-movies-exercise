import * as Faker from '@faker-js/faker'
import { define } from 'typeorm-seeding'

import { Movie } from '../../../modules/movie/movie.entity'

define(Movie, (faker: typeof Faker.faker) => {
  const movie = new Movie()
  movie.title = faker.lorem.sentence()
  movie.desc = faker.lorem.paragraph()
  movie.thumbnailPath = faker.image.imageUrl()
  movie.srcPath = faker.image.imageUrl()
  // movie.author = ''
  // movie.reactions = []
  return movie
})
