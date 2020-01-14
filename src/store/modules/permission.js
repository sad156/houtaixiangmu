import { constantRoutes } from '@/router'
import { queryMenus } from '@/api/menu'
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}


export function traverseRoutes(menus){
  let routes = menus.map( menu =>{
    if(menu.component){
      let name = menu.component;
      menu.component = ()=> import(`@/${name}`)
    }

    if(menu.children && menu.children.length){
      menu.children = traverseRoutes(menu.children);
    }
    return menu;
  })
  return routes;
}



const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      queryMenus().then(response => {
      let accessedRoutes
       if(response.code !== 200){
         console.log("菜单加载异常")
       }else{
          const menus = response.data
          let remoteroutes = traverseRoutes(menus)
          commit('SET_ROUTES', remoteroutes)
          resolve(remoteroutes)
       }
      }).catch(error => {
        console.log(error)
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
