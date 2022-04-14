import { ApiProperty } from '@nestjs/swagger'

export class ReactionDto {
  @ApiProperty({ example: '' })
    id?: string

  @ApiProperty({ example: '' })
    user: string

  @ApiProperty({ example: 'like' })
    action: string

  @ApiProperty({ example: '' })
    movie: string
}
