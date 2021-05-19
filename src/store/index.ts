import Vue from "vue";
import Vuex from "vuex";
import { Member, State } from "@/models";

Vue.use(Vuex);

const state: State = {
  members: [],
  tables: [],
  file: null
}

export default new Vuex.Store({
  state,
  mutations: {
    setMembers (state: State, members: Member[]) {
      state.members = members
    },
    setTables (state: State, tables: number[]) {
      state.tables = tables
    },
    setFile (state: State, file: File) {
      state.file = file
    }
  },
  actions: {},
  modules: {},
});
