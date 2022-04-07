import { Injectable, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { classToPlain } from 'class-transformer'

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

import { IAuthUser } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password)
      if (isMatch) {
        return classToPlain(user)
      }
    }
    return null
  }

  async signup(entity) { // : Promise<InsertResult>
    if (entity.password !== entity.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }
    // delete entity.confirmPassword
    const tmpUser: User = entity
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(entity.password, salt)
    tmpUser.password = hash
    return this.userService.insert(tmpUser)
  }

  async login(user: IAuthUser) {
    const payload: IAuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName
    }
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: payload
    }
  }
}
