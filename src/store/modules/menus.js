import { queryMenus } from '@/api/menu'
import router, { resetRouter } from '@/router'

const state = {
  menus : []
}

const mutations = {
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
}

const actions = {
   queryMenus({ commit,state }) {
     return new Promise((resolve, reject) => {
       queryMenus(state.token).then(response => {
        const data = response
        
        resolve(data)
       }).catch(error => {
         reject(error)
       })
     })
   }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
