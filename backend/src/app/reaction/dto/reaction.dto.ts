import { ApiProperty } from '@nestjs/swagger'
import { ReactionType } from '../reaction.entity'

export class ReactionDto {
  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
    id?: string

  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
    user: string

  @ApiProperty({ example: ReactionType.like })
    action: string

  @ApiProperty({ format: 'uuid', example: 'f620a1bf-d317-4bcb-a190-0213bede890b' })
    movie: string
}
