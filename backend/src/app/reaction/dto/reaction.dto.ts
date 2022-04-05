import { ApiProperty } from '@nestjs/swagger'

export class ReactionDto implements Readonly<ReactionDto> {
  @ApiProperty({ example: '' })
    user: string

  @ApiProperty({ example: 'like' })
    action: string

  @ApiProperty({ example: '' })
    movie: string
}
