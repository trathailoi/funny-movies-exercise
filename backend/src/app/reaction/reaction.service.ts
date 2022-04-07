import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BaseService } from '../common/base.service'
import { Reaction } from './reaction.entity'

@Injectable()
export class ReactionService extends BaseService<Reaction> {
  constructor(@InjectRepository(Reaction) private readonly repo: Repository<Reaction>) {
    super(repo)
  }

  allowTypes = ['like', 'dislike']

  async react(entity: Reaction): Promise<void> {
    const currentOne = await this.repo.findOne({
      where: {
        user: entity.user,
        movie: entity.movie
      }
    })
    if (this.allowTypes.includes(entity.action)) {
      if (currentOne) {
        if (entity.action === currentOne.action) return
        currentOne.action = entity.action
        await this.repo.save(currentOne)
      } else {
        await this.repo.insert(entity)
      }
    } else if (currentOne) {
      await this.repo.delete(currentOne.id)
    }
  }

  async getReactions(movie: string): Promise<Reaction[]> {
    const result = await this.repo.find({
      where: { movie },
      relations: ['user']
    })
    return result
  }
}
