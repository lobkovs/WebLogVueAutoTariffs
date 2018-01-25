export const strict = false

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: {
		averageTime: '00:00:00',
		files: null,
		maxTime: '00:00:00',
	},
	mutations: {
		setAverageTime (state, time) {
			state.averageTime = time
		},
		setFiles (state, files) {
			state.files = files
		},
		setMaxTime (state, time) {
			state.maxTime = time
		},
	},
	actions: {
		setAverageTime ({commit}, time) {
			commit('setAverageTime', time)
		},
		setFiles ({commit}, files) {
			commit('setFiles', files)
		},
		setMaxTime ({commit}, time) {
			commit('setMaxTime', time)
		},
	}
})