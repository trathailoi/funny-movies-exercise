import * as Faker from '@faker-js/faker'
import { define } from 'typeorm-seeding'

import { Reaction, ReactionType } from '../../../modules/reaction/reaction.entity'

define(Reaction, (faker: typeof Faker.faker) => {
  const reaction = new Reaction()
  reaction.action = faker.random.arrayElement([ReactionType.like, ReactionType.dislike])
  return reaction
})
