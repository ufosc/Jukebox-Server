import { Injectable } from '@nestjs/common'
import { Axios, AxiosRequestConfig } from 'axios'
import { NODE_ENV, PROXY_URL } from 'src/config'
import { sleep } from 'src/utils'

@Injectable()
export class NetworkService {
  protected env = NODE_ENV
  protected routes = {
    getUser: `${PROXY_URL}/api/v1/user/me/`,
  }
  private token = ''

  constructor(protected axios: Axios) {}

  public sendRequest = async (
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: AxiosRequestConfig['data'],
    config?: Omit<AxiosRequestConfig, 'data'>,
  ) => {
    if (this.env === 'network' || this.env === 'dev') {
      await sleep(1000)
    }

    const res = await this.axios
      .request({
        method: method || 'GET',
        url,
        headers: {
          Authorization: `Token ${this.token}`,
          'Content-Type': 'application/json',

          ...config?.headers,
        },
        data: body,
        ...config,
      })
      .catch((error) => {
        console.log('caught error:', error)
        return error.response
      })

    return {
      status: res.status,
      description: res.statusText,
      data: res.data,
    }
  }

  setToken(token: string) {
    this.token = token
  }

  async fetchUser(): Promise<IUser> {
    const res = await this.sendRequest(this.routes.getUser)

    return {
      email: res.data.email ?? '',
      firstName: res.data.first_name,
      id: res.data.id,
      lastName: res.data.last_name,
    }
  }
}
