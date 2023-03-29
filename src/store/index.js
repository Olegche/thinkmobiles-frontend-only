import Vue from 'vue'
import Vuex from 'vuex'
import {
  v4 as uuidv4
} from 'uuid';


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    usersListData: [{
        _id: '1',
        firstName: 'Jo',
        lastName: 'Cow',
        email: 'email@jo',
        phoneNumber: '777',
        events: []
      },
      {
        _id: '2',
        firstName: 'Steven',
        lastName: 'Bear',
        email: 'email@steven',
        phoneNumber: '778',
        events: []
      },
      {
        _id: '3',
        firstName: 'Dan',
        lastName: 'Goat',
        email: 'email@dan',
        phoneNumber: '889',
        events: []
      },
    ],

  },
  mutations: {
    addUserToList(state, data) {
      state.usersListData.push({
        _id: uuidv4(),
        ...data,
        events: []
      })
    },
    updateUser(state, userData) {
      const userIndex = state.usersListData.findIndex((user) =>
        user._id == userData._id)
      state.usersListData[userIndex] = userData
    },

    addEventToUser(state, { userId, event }) {
      const user = state.usersListData.find(user => user._id === userId)
      if (user) {
        user.events.push({
          _id: uuidv4(),
          ...event
        })
      }
    },

  


    

  },
  actions: {
    addUserAction({
      commit
    }, userData) {
      commit('addUserToList', userData)
    },

    updateUserAction({
      commit
    }, user) {
      commit('updateUser', user)
    },

    addEventToUserAction({ commit }, { userId, event }) {
      commit('addEventToUser', { userId, event })
    },

   

  },
  getters: {

    getUsersListData: (state) => state.usersListData,

    getUserById: (state) => (id) => {
      return state.usersListData.find((item) => item._id == id)
    },
    
    getUserEvents: (state) => (userId) => {
      const user = state.usersListData.find(user => user._id === userId)
      if (user) {
        return user.events
      } else {
        return []
      }
    }
  }
})


export default store
