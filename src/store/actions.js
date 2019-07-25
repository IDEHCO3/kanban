import axios from 'axios'

export default {

  GETPROJECTS ({ commit }) {
    axios.get(`project-list/`)
      .then(res => commit('projectsList', res.data))
  },

  GETCONTINUOUS ({ commit }) {
    axios.get(`type-continuous-activity-list/`)
      .then(res => commit('continuousActivityList', res.data))
  },

  GETIMPEDIMENTS ({ commit }) {
    axios.get(`impediment-list/`)
      .then(res => commit('impedimentsList', res.data))
  },

  GETUSERS ({ commit }) {
    axios.get(`user-list/`)
      .then(res => commit('usersList', res.data))
  },

  GETSPRINTS ({ commit }) {
    axios.get(`sprint-list/`)
      .then(res => commit('sprintsList', res.data))
  },

  GETTASKS ({ commit }) {
    axios.get(`task-list/`)
      .then(res => commit('tasksList', res.data))
  }

}
