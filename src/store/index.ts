import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import videoGames from "./videoGames.module";

const store = createStore({
   modules: {
       auth, user, videoGames
   },
});

export default store;
