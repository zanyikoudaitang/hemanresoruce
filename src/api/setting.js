import request from '@/utils/request';


export function getRoleList(params){
    return request({
        url: '/sys/role',
        params
    });
}



export function getCompanyInfo(companyId){
    return request({
        url: `/company/${companyId}`,
    });
}



export function delRoleById(id){
    return request({
        url: `/sys/role/${id}`,
        method: 'DELETE'
    });
}



export function getRoleInfoById(id) {
    return request({
      url: `/sys/role/${id}`
    })
  }


  export function updateRoleInfoById(data) {
    return request({
      url: `/sys/role/${data.id}`,
      method:'PUT',
      data
    })
  }





  export function addRole(data) {
    return request({
      url: `/sys/role`,
      method:'POST',
      data
    })
  }


  export function assignPerm(data) {
    return request({
      url: '/sys/role/assignPrem',
      method: 'put',
      data
    })
  }