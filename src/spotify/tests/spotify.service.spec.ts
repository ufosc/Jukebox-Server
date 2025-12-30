import { HttpService } from '@nestjs/axios'
import { BadRequestException } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import type { Axios } from 'axios'
import { DatabaseModule } from 'src/config/database.module'
import { DataSource, type Repository } from 'typeorm'
import { SpotifyAccount } from '../entities/spotify-account.entity'
import { SpotifyAuthService } from '../spotify-auth.service'

jest.mock('axios')

describe('SpotifyAuthService', () => {
  let module: TestingModule
  let service: SpotifyAuthService
  let repo: Repository<SpotifyAccount>
  let axios: jest.Mocked<Axios>

  beforeEach(async () => {
    axios = {
      post: jest.fn(),
    } as any

    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([SpotifyAccount])],
      providers: [SpotifyAuthService, { provide: HttpService, useValue: { axiosRef: axios } }],
    }).compile()

    service = module.get<SpotifyAuthService>(SpotifyAuthService)
    repo = module.get<Repository<SpotifyAccount>>(getRepositoryToken(SpotifyAccount))
  })

  afterEach(async () => {
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
  })

  it('should return a valid Spotify redirect URI', () => {
    const userId = 123
    const redirectUri = service.getSpotifyRedirectUri(userId)

    expect(redirectUri).toContain('https://accounts.spotify.com/authorize')
    expect(redirectUri).toContain('response_type=code')
    expect(redirectUri).toContain(`state=${encodeURIComponent(JSON.stringify({ userId }))}`)
  })

  it('should handle authentication errors gracefully', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error_description: 'Invalid authorization code' } },
    })

    await expect(service['authenticateSpotify']('invalid-code')).rejects.toThrow(
      new BadRequestException('Invalid authorization code'),
    )
  })

  it("should return a user's Spotify accounts", async () => {
    const mockAccounts = [{ user_id: 123, spotify_email: 'test@example.com' }]
    jest.spyOn(repo, 'findBy').mockResolvedValue(mockAccounts as any)

    const result = await service.findUserAccounts(123)

    expect(repo.findBy).toHaveBeenCalledWith({ user_id: 123 })
    expect(result).toEqual(mockAccounts)
  })
})
