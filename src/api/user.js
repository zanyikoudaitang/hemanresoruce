import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/sys/login',
        method: 'post',
        data
    })

  
}

export function getInfo(token) {
    return request({
        url: '/sys/profile',
        method: 'post'
      })
}

export function getUserDetailById(id) {
    return request({
      url: `/sys/user/${id}`
    })
  }

export function logout() {
   
}
