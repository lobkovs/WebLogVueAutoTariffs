import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Show from '@/components/Show'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Index',
			component: Index
		},
		{
			path: '/show/:name',
			name: 'Show',
			component: Show,
			props: true,
		},
	],
})