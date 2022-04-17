import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'
import { genSaltSync, hashSync } from 'bcryptjs'

import { BaseService } from '../app/common/base.service'
import { User } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super(repo)
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.repo.findOne({ email })
  }

  async create(entity: CreateUserDto): Promise<InsertResult> {
    const tmpUser: User = new User(entity)
    // const salt = await bcryptjs.genSalt()
    const salt = genSaltSync()
    // const hash = await bcryptjs.hash(entity.password, salt)
    const hash = hashSync(entity.password, salt)
    tmpUser.password = hash
    return this.repo.insert(tmpUser)
  }
}
