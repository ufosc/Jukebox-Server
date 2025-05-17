import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SpotifyAuthService } from '../spotify-auth.service'
import { SpotifyAccount } from '../entities/spotify-account.entity'
import { Axios } from 'axios'
import { BadRequestException } from '@nestjs/common'

jest.mock('axios')

describe('SpotifyAuthService', () => {
  let service: SpotifyAuthService
  let repo: Repository<SpotifyAccount>
  let axios: jest.Mocked<Axios>

  beforeEach(async () => {
    axios = {
      post: jest.fn(),
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyAuthService,
        { provide: getRepositoryToken(SpotifyAccount), useClass: Repository },
        { provide: Axios, useValue: axios },
      ],
    }).compile()

    service = module.get<SpotifyAuthService>(SpotifyAuthService)
    repo = module.get<Repository<SpotifyAccount>>(getRepositoryToken(SpotifyAccount))
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

  it('should return a user\'s Spotify accounts', async () => {
    const mockAccounts = [{ user_id: 123, spotify_email: 'test@example.com' }]
    jest.spyOn(repo, 'findBy').mockResolvedValue(mockAccounts as any)

    const result = await service.findUserAccounts(123)

    expect(repo.findBy).toHaveBeenCalledWith({ user_id: 123 })
    expect(result).toEqual(mockAccounts)
  })
})
