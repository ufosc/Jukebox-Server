import Axios from 'axios'

export const AxiosProvider = {
  provide: Axios.Axios,
  useValue: Axios.create(),
}
