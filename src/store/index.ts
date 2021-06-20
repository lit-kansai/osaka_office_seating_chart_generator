import Vue from "vue";
import Vuex from "vuex";
import { State } from "@/models";
import { Tkms } from "@/models/tkms";

Vue.use(Vuex);

const state: State = {
  tkms: null,
  tables: [],
  file: null
}

export default new Vuex.Store({
  state,
  mutations: {
    setTkms (state: State, tkms: Tkms) {
      state.tkms = tkms
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
