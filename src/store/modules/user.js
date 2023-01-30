import { getToken, setToken, removeToken, setTimestamp} from "@/utils/auth";
import { login, getInfo, getUserDetailById} from "@/api/user";
import router, { resetRouter } from "@/router";

// 状态
const state = {
  token: getToken(),
  userInfo:{}
};
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
    setTimestamp()
  },
  removeToken(state) {
    state.token = null;
    removeToken();
  },
  setUserInfo(state, userInfo) {
    state.userInfo = {...userInfo};
  },
  removeUserInfo(state) {
    state.userInfo = {}
  },
  
};
// 执行异步
const actions = {
  async login(context, data) {
    const ret = await login(data);
    console.log(ret);
    if (ret) {
      context.commit("setToken", ret);
    }
  },
  logout(context){
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()

    context.commit('permission/setRouter',[],{root:true})

    router.push('/login')
  },
  async getUserInfo(context) {
    const result = await getInfo();
    const baseInfo = await getUserDetailById(result.userId)
    baseInfo.staffPhoto = baseInfo.staffPhoto || ''
    const baseResult = { ...result, ...baseInfo }
    context.commit("setUserInfo", baseResult);
    return baseResult;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
