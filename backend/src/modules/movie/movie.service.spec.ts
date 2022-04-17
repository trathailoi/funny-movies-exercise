import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Mapper } from '../../common/mapper'

import { Movie } from './movie.entity'
import { MovieService } from './movie.service'

const MOVIE_REPOSITORY_TOKEN = getRepositoryToken(Movie)

describe('MovieService', () => {
  let service: MovieService
  let movieRepository: Repository<Movie>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Mapper,
        MovieService,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<MovieService>(MovieService)
    movieRepository = module.get<Repository<Movie>>(MOVIE_REPOSITORY_TOKEN)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should define movieRepository', () => {
    expect(movieRepository).toBeDefined()
  })

  describe('findOne', () => {
    it('shoud be working', async () => {
      jest.spyOn(movieRepository, 'findOne').mockResolvedValueOnce(undefined)
      await service.findOne('123')
      expect(movieRepository.findOne).toBeCalled()
    })
  })
})
