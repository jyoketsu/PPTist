import axios from 'axios'

let token: string | null = null

const request = {
  get(path: string, params?: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: 'get',
          url: path,
          params: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data)
        })
        
      }
      catch (error) {
        reject(error)
      }
    })
  },
  post(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: 'post',
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data)

        })
      }
      catch (error) {
        reject(error)
      }
    })
  },
  patch(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: 'patch',
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data)

        })
      }
      catch (error) {
        reject(error)
      }
    })
  },
  delete(path: string, params: object) {
    return new Promise(function(resolve, reject) {
      try {
        axios({
          method: 'delete',
          url: path,
          data: params,
          headers: {
            token: token,
          },
        }).then(function(response) {
          resolve(response.data)

        })
      }
      catch (error) {
        reject(error)
      }
    })
  },
}

export default {
  request,
  setToken: (_token: string) => {
    token = _token
  },
  getToken: () => {
    return token
  }
}
