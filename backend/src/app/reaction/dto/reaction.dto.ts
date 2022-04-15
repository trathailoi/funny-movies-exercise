import { ApiProperty } from '@nestjs/swagger'
import { ReactionType } from '../reaction.entity'

export class ReactionDto {
  @ApiProperty({ example: '' })
    id?: string

  @ApiProperty({ example: '' })
    user: string

  @ApiProperty({ example: ReactionType.like })
    action: string

  @ApiProperty({ example: '' })
    movie: string
}
