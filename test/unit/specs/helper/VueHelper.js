import Vue from 'vue'
import VueResource from 'vue-resource'

export const getVM = (component) => {
  const Constructor = Vue.extend(component)
  const vm = new Constructor().$mount()
  return vm
}

export const getVMWithPropsData = (component, propsData) => {
  const Constructor = Vue.extend(component)
  const vm = new Constructor({propsData}).$mount()
  return vm
}

export const getCommonVM = (render, components) => {
  return new Vue({
    el: document.createElement('div'),
    render,
    components
  }).$mount()
}

export const initVueResource = () => {
  Vue.config.productionTip = false
  Vue.use(VueResource)
  Vue.http.options.xhr = {withCredentials: true}
}
