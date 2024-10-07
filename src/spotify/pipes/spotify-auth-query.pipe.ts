import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { SpotifyAuthQueryDto } from '../dto/spotify-auth-query.dto'

@Injectable()
export class SpotifyAuthQueryPipe implements PipeTransform {
  transform(value: SpotifyAuthQueryDto, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value
    }

    return plainToInstance(metatype, value)
  }
}
