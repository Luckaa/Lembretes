import Vue from 'vue'
import Router from 'vue-router'
import Livro from '@/components/Livro'
import Lembrete from '@/components/Lembrete'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Livro',
      component: Livro
    },
    {
    path: '/lembrete',
    name: 'Lembrete',
    component: Lembrete
    }
  ]
})
