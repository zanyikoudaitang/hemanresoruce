import request from '@/utils/request';


export function getEmployeeSample(){
    return request({
        url: '/sys/user/simple',
        method: 'get',
    });

}


export function getEmployeeList(params){
    return request({
        url: '/sys/user',
        params
    });

}



export function delEmployee(id) {
    return request({
      url: `/sys/user/${id}`,
      method: 'delete'
    })
  }




  export function addEmployee(data) {
    return request({
      method: 'post',
      url: '/sys/user',
      data
    })
  }




  export function importEmployee(data) { //接口要求data必须是数组类型
    return request({
      url: '/sys/user/batch',
      method: 'post',
      data
    })
  }


  export function getEmployeeDetailById(data) {
    return request({
      url: `/sys/user/${data.id}`,
      method: 'put',
      data
    })
  }



  /** *
 *  读取用户详情的基础信息（获取个人信息的详情信息，个人信息的基本信息已经处理过了）
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
/** *
 *  更新用户详情的基础信息（修改个人信息的详情信息）
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}
/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}




export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}




