import { createStore } from 'vuex'
import axios from 'axios'

const dnes = (...hodina) => {
  let dnes = new Date()
  dnes.setHours(...hodina)
  return dnes
}

export default createStore({
  state: {
    authToken: null,
    preloader: false,
    success: false,
    error: false,
    data: null,
    filtrace: {
      zacatek: dnes(0, 0, 0, 0),
      konec: dnes(23, 59, 0, 0),
    }
  },
  getters: {
    predchoziUkol(state) {
      let rozpracovanyCas = state.data.casy.filter(c => c.konec !== null)
      rozpracovanyCas = rozpracovanyCas[rozpracovanyCas.length - 1]
      return state.data.ukoly.find(u => u.id === rozpracovanyCas.ukol_id)
    },
    dokonceneUkoly(state) {
      return state.data.ukoly.filter(u => u.stav_id === 2)
    },  
    skupiny(state) {
      return state.data.ukoly.filter(u => u.ukol_id === null)
    },
    filtrace(state) {
      return state.filtrace
    },
    prvniCas(state) {
      return state.data.casy.find(c => c.zacatek)
    },
    ukolyVeFronte(state) {
      if (state.data) {
        return state.data.prioritni_fronta
          .filter(pf => state.data.ukoly.find(u => u.stav_id === 1 && pf.ukol_id === u.id))
          .map(pf => state.data.ukoly.find(u => pf.ukol_id === u.id))
          .reverse()
      } else {
        return []
      }
    },
    casNaUkolech(state) {
      let _casy = state.data.casy.filter(c => {
        const zacatek = new Date(c.zacatek * 1000)
        const konec = new Date(c.konec * 1000)
        return zacatek > state.filtrace.zacatek && zacatek < state.filtrace.konec ||
          konec > state.filtrace.zacatek && konec < state.filtrace.konec
      })
      let casy = _casy.map(c => ({ ukol_id: c.ukol_id, cas: c.konec - c.zacatek }))
      let groups = {}
      for (const cas of casy) {
        if (!(cas.ukol_id in groups)) {
          groups[cas.ukol_id] = 0
        }
        groups[cas.ukol_id] += cas.cas
      }
      const getPodrizeneUkoly = (id) => {
        let ukoly = state.data.ukoly.filter(u => u.ukol_id === id)
        for (const ukol of ukoly) {
          ukoly = [...ukoly, ...getPodrizeneUkoly(ukol.id)]
        }
        return ukoly
      }
      return state.data.ukoly.map(u => {
        let nazevArr = []
        let ukol = state.data.ukoly.find(nu => nu.id == u.id)
        while (ukol) {
          nazevArr.push(ukol.nazev)
          ukol = state.data.ukoly.find(nu => nu.id == ukol.ukol_id)
        }
        let cas = _casy
          .filter(c => c.ukol_id === u.id && c.konec !== null)
          .map(c => c.konec - c.zacatek)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        for (const ukol of getPodrizeneUkoly(u.id)) {
          cas += _casy
            .filter(c => c.ukol_id === ukol.id && c.konec !== null)
            .map(c => c.konec - c.zacatek)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        }
        if (cas === 0) {
          const ukolyIds = getPodrizeneUkoly(u.id).map(u => u.id)
          ukolyIds.push(u.id)
          const historickeCasy = state.data.casy.filter(c => ukolyIds.includes(c.ukol_id))
          if (historickeCasy.length > 0) {
            let posledniAkce = historickeCasy[historickeCasy.length - 1].konec
            if (!posledniAkce) {
              cas = '-- ještě nikdy --'
            } else {
              posledniAkce = new Date(posledniAkce * 1000)
              cas = posledniAkce.getDate() + ". " + 
                (posledniAkce.getMonth() + 1) + ". " + 
                posledniAkce.getFullYear() + 
                " " + 
                (posledniAkce.getHours()+"").padStart(2, "0") + ":" +
                (posledniAkce.getMinutes()+"").padStart(2, "0")
            }
          } else {
            cas = '-- ještě nikdy --'
          }
        } else {
          cas = "<b>" + (Math.floor(cas / 3600 / 24)+"").padStart(2, "0") + ":" + 
            (Math.floor(cas / 3600 % 24)+"").padStart(2, "0") + ":" + 
            (Math.floor(cas / 60 % 60)+"").padStart(2, "0") + ":" + 
            ((cas % 60)+"").padStart(2, "0") + "</b>"
        }
        return {
          id: u.id,
          nazev: nazevArr.reverse().join(' &ndash; '),
          cas
        }
      })
    },
    rozpracovanyUkol(state) {
      let rozpracovanyCas = state.data.casy.find(c => c.konec === null)
      if (rozpracovanyCas) {
        return state.data.ukoly.find(u => u.id === rozpracovanyCas.ukol_id)
      }
      return null
    },
    casyByUkolId: (state) => (id) => {
      return state.data.casy.filter(c => c.ukol_id === id)
    },
    vybranyUkol: (state) => (id) => {
      return state.data.ukoly.find(u => u.id === id)
    },
    ukolyByUkolId: (state) => (id, stav = 1) => {
      return state.data.ukoly.filter(u => u.ukol_id === id && u.stav_id === stav)
    },
    isLoggedIn(state) {
      return !!state.authToken && !!state.data
    }
  },  
  mutations: {
    putUkolPresunout(state, data) {
      const ukol = state.data.ukoly.find(u => u.id === data.id);
      ukol.ukol_id = data.ukol_id
    },
    setFiltrace(state, filtrace) {
        state.filtrace.zacatek = new Date(filtrace.zacatek)
        state.filtrace.konec = new Date(filtrace.konec)
    },
    deletePrioritniFronta(state, id) {
      const index = state.data.prioritni_fronta.findIndex(pf => pf.ukol_id === id)
      state.data.prioritni_fronta.splice(index, 1)
    },
    postPrioritniFronta(state, data) {
      state.data.prioritni_fronta.push(data)
    },
    postPrepnoutUkol(state, data) {
      let cas = state.data.casy.find(c => c.konec === null)
      cas.konec = data.konec
      state.data.casy.push(data.novyZacatek)
    },
    putUkolyDokonceno(state, id) {
      let ukol = state.data.ukoly.find(u => u.id === id)
      ukol.stav_id = 2
    },
    putUkolyZruseno(state, id) {
      let ukol = state.data.ukoly.find(u => u.id === id)
      ukol.stav_id = 3
    },
    postCasy(state, data) {
      state.data.casy.push(data)
    },
    putCasySkoncit(state, data) {
      let cas = state.data.casy.find(c => c.konec === null)
      cas.konec = data.konec
    },
    postUkol(state, data) {
      state.data.ukoly.push(data)
    },
    getAll(state, data) {
      state.data = data
    },    
    logout(state) {
      localStorage.removeItem('self-management-authToken')
      state.authToken = null
    },
    success(state, status) {
      setTimeout(() => state.success = false, 3000)
      state.success = status
    },
    setError(state, status) {
      setTimeout(() => state.success = false, 3000)
      state.error = status
    },
    setLoading(state, isLoading) {
      state.preloader = isLoading
    },
    authenticate(state, authToken) {
      localStorage.setItem('self-management-authToken', authToken)
      state.authToken = authToken
    }
  },
  actions: {
    putUkolPresunout({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/ukoly-presunout', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putUkolPresunout", data)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    deletePrioritniFronta({ commit, state }, ukol) {
      commit('setLoading', true)
      return axios
        .delete(window.API_URL + '/prioritni-fronta/' + ukol.id, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("success", response.status)
          commit("deletePrioritniFronta", ukol.id)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    postPrioritniFronta({ commit, state }, ukol) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/prioritni-fronta', { id: ukol.id }, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("success", response.status)
          commit("postPrioritniFronta", response.data)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    postPrepnoutUkol({ commit, state }, ukol) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/casy-prepnout', ukol, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("success", response.status)
          commit("postPrepnoutUkol", response.data)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    putUkoly({ commit, state }, ukol) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/ukoly', ukol, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    postCasy({ commit, state }, ukol_id) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/casy', { ukol_id }, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postCasy", response.data)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    putCasySkoncit({ commit, state }) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/casy', {}, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putCasySkoncit", response.data)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    putUkolyDokonceno({ commit, state }, id) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/ukoly-dokonceno', { id }, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putUkolyDokonceno", id)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    putUkolyZruseno({ commit, state }, id) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/ukoly-zruseno', { id }, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putUkolyZruseno", id)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    postUkol({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/ukoly', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postUkol", response.data)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    getAll({ commit, state }) {
      commit('setLoading', true)
      return axios
        .get(window.API_URL + '/all', { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("getAll", response.data)
          commit("success", response.status)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    authenticate({ commit, dispatch }, code) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/authenticate', { code })
        .then((response) => {
          commit("authenticate", response.data)
          commit("success", response.status)
          dispatch("getAll")
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    loadAuthToken({ commit, dispatch }) {
      let authToken = localStorage.getItem('self-management-authToken')
      if (authToken) {
        commit("authenticate", authToken)
        dispatch("getAll")
      }
    },
},
  modules: {
  }
})
