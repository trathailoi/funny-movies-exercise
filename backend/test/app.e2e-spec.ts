import * as request from 'supertest'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AppModule } from '../src/app.module'
import { User } from '../src/user/user.entity'

const USER_REPOSITORY_TOKEN = getRepositoryToken(User)
const sampleUserCredentials = {
  email: 'somebody@hotmail.com',
  password: 'Y0uKnowWh@tItIs'
}
const sampleMovie = {
  title: 'Movie Title',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  thumbnailPath: 'https://via.placeholder.com/150x150',
  srcPath: '/path/to/movie.mp4'
  // author: '5f36215d-f5c6-4896-087c-f30f3678f607'
}
let userId = ''
let movieId = ''
let token = ''

describe('Main user stories only (sign up --> sign in --> create movie -> like/dislike/unlike)', () => {
  let app: INestApplication
  let httpServer: any
  let userRepository: Repository<User>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {}
        }
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    httpServer = app.getHttpServer()
    userRepository = moduleFixture.get<Repository<User>>(USER_REPOSITORY_TOKEN)

    // clean up database before running tests
    await userRepository.delete({})
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be a healthy backend app #POSITIVE', async () => {
    const response = await request(httpServer)
      .get('/health')
      .expect(200)
    expect(response.status).toEqual(200)
  })

  it('should signup a new user #POSITIVE', async () => {
    const response = await request(httpServer)
      .post('/authen/signup')
      .set('Content-type', 'application/json')
      .send({
        ...sampleUserCredentials,
        confirmPassword: sampleUserCredentials.password
      })
      .expect(201)
    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('id')
    userId = response.body.id
  })

  it('should sign that user in #POSITIVE', async () => {
    const response = await request(httpServer)
      .post('/authen/signin')
      .set('Content-type', 'application/json')
      .send(sampleUserCredentials)
      .expect(200)
    expect(response.status).toEqual(200)
    token = response.body.access_token
  })

  it('should create a movie successfully #POSITIVE', async () => {
    const creatingResponse = await request(httpServer)
      .post('/movies')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleMovie)
      .expect(201)
    expect(creatingResponse.status).toEqual(201)
    expect(creatingResponse.body).toHaveProperty('id')
    movieId = creatingResponse.body.id

    const gettingResponse = await request(httpServer)
      .get(`/movies/${movieId}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(gettingResponse.status).toEqual(200)
    expect(gettingResponse.body).toEqual(expect.objectContaining(sampleMovie))
    expect(gettingResponse.body.id).toBe(movieId)
  })

  it('should get the movies list WITH authorization #POSITIVE', async () => {
    const response = await request(httpServer)
      .get('/movies')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(response.status).toEqual(200)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(sampleMovie)
      ])
    )
  })

  it('should get the movies list WITHOUT authorization #POSITIVE', async () => {
    const response = await request(httpServer)
      .get('/movies')
      .set('Content-type', 'application/json')
      .expect(200)
    expect(response.status).toEqual(200)
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(sampleMovie)
      ])
    )
  })

  it('should dislike a movie successfully #POSITIVE', async () => {
    const creatingResponse = await request(httpServer)
      .patch(`/movies/${movieId}/reactions?action=dislike`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(creatingResponse.status).toEqual(200)
    expect(creatingResponse.body.message).toBe('success')
    expect(creatingResponse.body.dislikes).toEqual(expect.arrayContaining([userId]))
  })

  it('should like a movie successfully #POSITIVE', async () => {
    const creatingResponse = await request(httpServer)
      .patch(`/movies/${movieId}/reactions?action=like`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(creatingResponse.status).toEqual(200)
    expect(creatingResponse.body.message).toBe('success')
    expect(creatingResponse.body.likes).toEqual(expect.arrayContaining([userId]))
  })

  it('should unlike a movie successfully #POSITIVE', async () => {
    const creatingResponse = await request(httpServer)
      .patch(`/movies/${movieId}/reactions?action=like-undo`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(creatingResponse.status).toEqual(200)
    expect(creatingResponse.body.message).toBe('success')
    expect(creatingResponse.body.likes).toEqual(expect.not.arrayContaining([userId]))
  })
})
