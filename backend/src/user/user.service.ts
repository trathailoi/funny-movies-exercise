import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email })
  }

  async insert(u) {
    return this.repository.insert(u)
  }

  async create(entity: User): Promise<InsertResult> {
    const tmpUser: User = entity
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(entity.password, salt)
    tmpUser.password = hash
    return this.repository.insert(tmpUser)
  }
}
