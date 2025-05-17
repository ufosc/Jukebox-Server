import Axios from 'axios'

export const AxiosProvider = {
  provide: Axios.Axios,
  useValue: Axios.create(),
}

export const AxiosMockProvider = {
  provide: Axios.Axios,
  useValue: Axios.create(),
}
