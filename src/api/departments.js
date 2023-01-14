import request from '@/utils/request';

export function getDepartments(){
    return request({
        url:'/company/department'
    })
}

export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

export function addDepartments(data){
  return request({
    url:'/company/department',
    method: 'post',
    data
  })
}

export function getDepartmentInfo(id){
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}


export function updateDepartmentInfo(data){
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
