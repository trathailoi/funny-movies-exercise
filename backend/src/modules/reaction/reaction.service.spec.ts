import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Reaction } from './reaction.entity'
import { ReactionDto } from './dto/reaction.dto'
import { ReactionService } from './reaction.service'
import { Mapper } from '../../common/mapper'

const REACTION_REPOSITORY_TOKE = getRepositoryToken(Reaction)

describe('ReactionService', () => {
  let service: ReactionService
  let reactionRepository: Repository<Reaction>
  let mapper: Mapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionService,
        Mapper,
        {
          provide: REACTION_REPOSITORY_TOKE,
          useValue: {
            // from src/common/base.service.ts
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByIds: jest.fn(),
            delete: jest.fn(),
            // from reaction.service.ts
            find: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<ReactionService>(ReactionService)
    reactionRepository = module.get<Repository<Reaction>>(REACTION_REPOSITORY_TOKE)
    mapper = module.get<Mapper>(Mapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('reactionRepository should be defined', () => {
    expect(reactionRepository).toBeDefined()
  })

  describe('react', () => {
    it('should do nothing if the reaction was already made', async () => {
      jest.spyOn(reactionRepository, 'findOne').mockResolvedValueOnce(mapper.map(ReactionDto, Reaction, {
        id: '123',
        movie: '123',
        user: '456',
        action: 'like'
      }))
      await service.react({
        movie: '123',
        user: '456',
        action: 'like'
      })
      expect(reactionRepository.save).not.toHaveBeenCalled()
      expect(reactionRepository.delete).not.toHaveBeenCalled()
    })
    it('should insert new reaction', async () => {
      await service.react({
        movie: '123',
        user: '456',
        action: 'like'
      })
      expect(reactionRepository.save).toBeCalledWith(expect.objectContaining({
        movie: '123',
        user: '456',
        action: 'like'
      }))
    })
    it('should update if user change to another reaction type', async () => {
      jest.spyOn(reactionRepository, 'findOne').mockResolvedValueOnce(mapper.map(ReactionDto, Reaction, {
        id: '123',
        movie: '123',
        user: '456',
        action: 'like'
      }))
      await service.react({
        movie: '123',
        user: '456',
        action: 'dislike'
      })
      expect(reactionRepository.save).toBeCalledWith(expect.objectContaining({
        movie: '123',
        user: '456',
        action: 'dislike'
      }))
    })
    it('should update if user undo the reaction', async () => {
      const mockedReaction = mapper.map(ReactionDto, Reaction, {
        id: '123',
        movie: '123',
        user: '456',
        action: 'like'
      })
      jest.spyOn(reactionRepository, 'findOne').mockResolvedValueOnce(mockedReaction)
      await service.react({
        movie: '123',
        user: '456',
        action: 'like-undo'
      })
      expect(reactionRepository.delete).toBeCalledWith(mockedReaction.id)
    })
  })

  describe('getReactions', () => {
    it('should return all reactions', async () => {
      jest.spyOn(reactionRepository, 'find').mockResolvedValueOnce([
        mapper.map(ReactionDto, Reaction, {
          id: '123',
          movie: '123',
          user: '456',
          action: 'like'
        }),
        mapper.map(ReactionDto, Reaction, {
          id: '456',
          movie: '123',
          user: '789',
          action: 'dislike'
        })
      ])
      const result = await service.getReactions('123')
      expect(result).toHaveLength(2)
      expect(reactionRepository.find).toHaveBeenCalled()
    })
  })
})
