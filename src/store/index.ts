import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import videoGames from "./videoGames.module";
import axios from "axios";
import API_URL from "../services/env";

const store = createStore({
  state: {
    axios: axios.create({
      baseURL: API_URL,
      timeout: 5000,
      headers: {'Content-Type': 'application/json'}
    })
  },
  modules: {
    auth, user, videoGames
  },
});
export default store;