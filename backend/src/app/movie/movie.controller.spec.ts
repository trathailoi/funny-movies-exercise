import { Test, TestingModule } from '@nestjs/testing'

import { User } from '../../user/user.entity'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'
import { ReactionService } from '../reaction/reaction.service'
import { Reaction, ReactionType } from '../reaction/reaction.entity'
import { Mapper } from '../common/mapper'

describe('MovieController', () => {
  let movieController: MovieController
  // let movieService: MovieService
  let reactionService: ReactionService

  beforeEach(async () => {
    const movie: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        Mapper,
        // ReactionService,
        {
          provide: MovieService,
          useValue: {
            // from src/app/common/base.service.ts
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByIds: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: ReactionService,
          useValue: {
            // from src/app/common/base.service.ts
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByIds: jest.fn(),
            delete: jest.fn(),
            react: jest.fn(),
            getReactions: jest.fn()
          }
        }
      ]
    }).compile()

    movieController = movie.get<MovieController>(MovieController)
    // movieService = movie.get<MovieService>(MovieService)
    reactionService = movie.get<ReactionService>(ReactionService)
  })

  it('should be defined', () => {
    expect(movieController).toBeDefined()
  })

  describe('reactMovie', () => {
    const sampleReactions = [
      new Reaction({
        id: '123',
        user: new User({
          id: '456_like_1',
          email: 'zxc@zxc.zxc'
        }),
        action: ReactionType.like
      }),
      new Reaction({
        id: '123',
        user: new User({
          id: '456_dislike_1',
          email: 'zxc@zxc.zxc'
        }),
        action: ReactionType.dislike
      }),
      new Reaction({
        id: '123',
        user: new User({
          id: '456_dislike_2',
          email: 'zxc@zxc.zxc'
        }),
        action: ReactionType.dislike
      }),
      new Reaction({
        id: '123',
        user: new User({
          id: '456_like_2',
          email: 'zxc@zxc.zxc'
        }),
        action: ReactionType.like
      })
    ]
    it('should "like" successfully', async () => {
      jest.spyOn(reactionService, 'react').mockResolvedValueOnce(null)
      jest.spyOn(reactionService, 'getReactions').mockResolvedValueOnce([
        ...sampleReactions,
        new Reaction({
          id: '123',
          user: new User({
            id: '234',
            email: 'zxc@zxc.zxc'
          }),
          action: ReactionType.like
        })
      ])

      // Like
      const result = await movieController.reactMovie('123', 'like', { user: { id: '234' } })

      expect(reactionService.react).toBeCalledWith({ movie: '123', action: 'like', user: '234' })
      expect(reactionService.getReactions).toBeCalledWith('123')

      expect(result.message).toBe('success')

      expect(result.likes.length).toBe(3)
      expect(result.likes).toContain('234')
      expect(result.likes).toEqual(expect.arrayContaining(['234']))

      expect(result.dislikes.length).toBe(2)
      expect(result.dislikes).toEqual(expect.arrayContaining(['456_dislike_1', '456_dislike_2']))
    })

    it('should "dislike" successfully', async () => {
      jest.spyOn(reactionService, 'react').mockResolvedValueOnce(null)
      jest.spyOn(reactionService, 'getReactions').mockResolvedValueOnce([
        ...sampleReactions,
        new Reaction({
          id: '123',
          user: new User({
            id: '234',
            email: 'zxc@zxc.zxc'
          }),
          action: ReactionType.dislike
        })
      ])

      // Like
      const result = await movieController.reactMovie('123', 'dislike', { user: { id: '234' } })

      expect(reactionService.react).toBeCalledWith({ movie: '123', action: 'dislike', user: '234' })
      expect(reactionService.getReactions).toBeCalledWith('123')

      expect(result.message).toBe('success')

      expect(result.likes.length).toBe(2)
      expect(result.likes).toEqual(expect.arrayContaining(['456_like_1', '456_like_2']))

      expect(result.dislikes.length).toBe(3)
      expect(result.dislikes).toContain('234')
      expect(result.dislikes).toEqual(expect.arrayContaining(['456_dislike_1', '456_dislike_2', '234']))
    })

    it('should "undo the like" successfully', async () => {
      jest.spyOn(reactionService, 'react').mockResolvedValueOnce(null)
      const cloneSampleReactions = [...sampleReactions]
      const theUnlinkedReaction = cloneSampleReactions.pop()
      jest.spyOn(reactionService, 'getReactions').mockResolvedValueOnce(cloneSampleReactions)

      // Like
      const result = await movieController.reactMovie('123', 'like-undo', { user: { id: theUnlinkedReaction.user.id } })

      expect(reactionService.react).toBeCalledWith({ movie: '123', action: 'like-undo', user: theUnlinkedReaction.user.id })
      expect(reactionService.getReactions).toBeCalledWith('123')

      expect(result.message).toBe('success')

      expect(result.likes.length).toBe(1)
      expect(result.likes).toEqual(expect.not.arrayContaining([theUnlinkedReaction.user.id]))

      expect(result.dislikes.length).toBe(2)
      expect(result.dislikes).toEqual(expect.arrayContaining(['456_dislike_1', '456_dislike_2']))
    })
  })
})
