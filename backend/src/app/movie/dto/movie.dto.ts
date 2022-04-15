import { ApiProperty } from '@nestjs/swagger'

export class MovieDto implements Readonly<MovieDto> {
  @ApiProperty({ example: 'Movie Title' })
    title: string

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' })
    desc: string

  @ApiProperty({ example: 'https://via.placeholder.com/150x150', required: false })
    thumbnailPath?: string

  @ApiProperty({ example: '/path/to/movie.mp4', required: false })
    srcPath?: string

  @ApiProperty({ example: '5f36215d-f5c6-4896-087c-f30f3678f607', required: false })
    author?: string
}
