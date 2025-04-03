import authService from '../services/auth.service';

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;
const initialState = user && user.token
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return authService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      authService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return authService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    forgotPassword({ commit }, user) {
      return authService.forgotPassword(user).then(
        response => {
          commit('forgotPasswordSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('forgotPasswordSuccess'); // Should be forgotPasswordFailure?
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user; // Now {token, name}
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    forgotPasswordSuccess(state) {
      state.status.loggedIn = false;
    },
    uploadAvatarSuccess(state, avatar) {
      state.user.avatar = avatar;
    }
  },
};