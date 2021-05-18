import Vue from "vue";
import Vuex from "vuex";
import { Member, State } from "@/models";

Vue.use(Vuex);

const state: State = {
  members: []
}

export default new Vuex.Store({
  state,
  mutations: {
    setMembers (state: State, members: Member[]) {
      state.members = members
    }
  },
  actions: {},
  modules: {},
});
