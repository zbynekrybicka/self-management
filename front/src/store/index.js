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
    mojeZmena: false,
    authenticationData: null,
    filtrace: {
      zacatek: dnes(0, 0, 0, 0),
      konec: dnes(23, 59, 0, 0),
    }
  },
  getters: {
    authenticationData(state) {
      return state.authenticationData
    },
    pocetPodukolu: (state, getters) => id => {
      const ukoly = state.data.ukoly.filter(u => u.ukol_id === id && u.dokonceno === null && u.uzivatel_id)
      let pocet = ukoly.length
      for (const ukol of ukoly) {
        pocet += getters.pocetPodukolu(ukol.id)
      }
      return pocet
    },
    nazev: state => (ukol, oddelovac) => {
        let nazev = [];
        while (ukol) {
            nazev.push(ukol.nazev);
            ukol = state.data.ukoly.find(u => u.id === ukol.ukol_id)
        }
        return nazev.reverse().join(oddelovac);
    },
    kvotyByUkolId: state => id => {
      return state.data.kvoty.filter(k => k.ukol_id === id).sort((a, b) => a.datum > b.datum ? 1 : 0)
    },
    plan: state => (den = null) => {
      const kvoty = state.data.kvoty
      .filter(k => {
        if (den) {
          return den === k.datum
        } else {
          const datum = new Date(k.datum)
          return state.filtrace.zacatek <= datum && state.filtrace.konec > datum
        }
      })
      const result = []
      for (const kvota of kvoty) {
        let item = result.find(r => r.ukol_id === kvota.ukol_id)
        if (!item) {
          item = { ukol_id: kvota.ukol_id, cas: 0 }
          result.push(item)
        }
        item.cas += kvota.cas
      }
      let aktualniKonec = null
      return result.map(r => {
        const casy = state.data.casy.filter(c => {
          const zacatek = new Date(c.zacatek * 1000)
          const konec = new Date(c.konec * 1000)
          let zacatekFiltrace
          let konecFiltrace
          if (den) {
            zacatekFiltrace = new Date(den + " 00:00:00")
            konecFiltrace = new Date(den + " 23:59:59")
          } else {
            zacatekFiltrace = state.filtrace.zacatek
            konecFiltrace = state.filtrace.konec
          }
          return zacatek > zacatekFiltrace && zacatek < konecFiltrace ||
            konec > zacatekFiltrace && konec < konecFiltrace
        })
  
        const cas = casy
          .filter(c => c.ukol_id === r.ukol_id)
          .reduce((prev, cur) => {
            let konec = cur.konec ? new Date(cur.konec * 1000) : new Date()
            if (!cur.konec) {
              aktualniKonec = new Date()
            }
            konec = Math.floor(konec.getTime() / 1000)
            return prev + (konec - cur.zacatek)
          }, 0)

        let splneno = Math.ceil(cas / r.cas * 100 / 60)
        if (splneno > 100) {
          splneno = 100
        }

        return {
          ...r,
          cas: Math.floor(r.cas / 60) + ":" + ((r.cas % 60)+"").padStart(2, "0"),
          odpracovano: Math.floor(cas / 60 / 60) + ":" + ((Math.floor(cas / 60) % 60 )+"").padStart(2, "0") + ":" + (Math.floor(cas % 60)+"").padStart(2, "0"),
          ukol: state.data.ukoly.find(u => u.id === r.ukol_id),
          splneno,
          progresbar: `linear-gradient(to right, #CFC 0%, #CFC ${splneno}%, white ${splneno}%, white 100%)`,
          aktualniKonec
        }
      })
    },
    poznamkyById: state => ukol_id => {
      return state.data.poznamky.filter(p => p.ukol_id === ukol_id).map(p => ({
        ...p,
        zapsano: new Date(p.zapsano * 1000)
      })).reverse()
    },
    specifickeUkolyByTyp: state => typ => {
      return state.data.specificke_ukoly.filter(su => su.typ === typ).map(su => state.data.ukoly.find(u => u.id === su.ukol_id))
    },
    specificke_ukoly(state) {
      return state.data.specificke_ukoly
    },
    predchoziUkol(state, getters) {
      let rozpracovanyCas = state.data.casy.filter(c => c.konec !== null)
      let projekt = getters.projektById(getters.rozpracovanyUkol.id)
      let i
      for (i = rozpracovanyCas.length; i > 0; i--) {
        let druhyProjekt = getters.projektById(rozpracovanyCas[i - 1].ukol_id)
        if (projekt.id !== druhyProjekt.id) {
          break;
        }
      }
      return state.data.ukoly.find(u => u.id === rozpracovanyCas[i - 1].ukol_id)
    },
    projektById: state => id => {
      let ukol = state.data.ukoly.find(u => u.id === id)
      while (ukol.ukol_id) {
        ukol = state.data.ukoly.find(u => u.id === ukol.ukol_id)
      }
      return ukol
    },
    dokonceneUkoly(state) {
      return state.data.ukoly.filter(u => u.dokonceno && u.dokonceno !== 1000)
    },  
    skupinaByUkolId: state => ukol => {
      while (ukol.ukol_id !== null) {
        ukol = state.data.ukoly.find(u => u.id === ukol.ukol_id)
      }
      return ukol      
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
        const fronta = state.data.specificke_ukoly.filter(su => su.typ === "prioritni").map(su => su.ukol_id)
        return Array.from(new Set(fronta)).map(id => state.data.ukoly.find(u => id === u.id && !u.dokonceno))
          .filter(u => u && u.ukol_id !== null)
          .reverse()
        
      } else {
        return []
      }
    },
    casy(state) {
      return state.data.casy.filter(c => {
        const zacatek = new Date(c.zacatek * 1000)
        const konec = new Date(c.konec * 1000)
        return zacatek > state.filtrace.zacatek && zacatek < state.filtrace.konec ||
          konec > state.filtrace.zacatek && konec < state.filtrace.konec
      })
    },
    ukolyPodleCasu(state, getters) {
      return getters.casy.map(c => ({
        ...c,
        zacatek: new Date(c.zacatek * 1000),
        konec: new Date(c.konec * 1000),
        ukol: state.data.ukoly.find(u => u.id === c.ukol_id)
      }))
    },
    casNaUkolech(state, getters) {
      let _casy = getters.casy
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
    ukolyByUkolId: (state) => (id, dokonceno = false) => {
      return state.data.ukoly.filter(u => u.ukol_id === id && !!u.dokonceno === dokonceno)
    },
    isLoggedIn(state) {
      return !!state.authToken && !!state.data
    }
  },  
  mutations: {
    putUkolVratit(state, id) {
      const ukol = state.data.ukoly.find(u => u.id === id)
      ukol.dokonceno = null
    },
    postKvotyKopiruj(state, kvoty) {
      state.data.kvoty = [...state.data.kvoty, ...kvoty]
    },
    deleteKvoty(state, id) {
      const index = state.data.kvoty.findIndex(k => k.id === id)
      state.data.kvoty.splice(index, 1)
    },
    postKvoty(state, data) {
      state.data.kvoty.push(data)
    },
    postPoznamky(state, data) {
      state.data.poznamky.push(data)
    },
    deleteSpecifickeUkoly(state, data) {
      const index = state.data.specificke_ukoly.findIndex(su => su.ukol_id === data.ukol_id && su.typ === data.typ)
      state.data.specificke_ukoly.splice(index, 1)
    },
    postSpecifickeUkoly(state, data) {
      state.data.specificke_ukoly.push(data)
    },
    putCasyPosunout(state, data) {
      const predchozi = state.data.casy.find(c => c.id === data.predchozi.id)
      predchozi.konec = data.predchozi.konec
      const aktualni = state.data.casy.find(c => c.id === data.aktualni.id)
      aktualni.zacatek = data.aktualni.zacatek
    },
    putUkolPresunout(state, data) {
      const ukol = state.data.ukoly.find(u => u.id === data.id);
      ukol.ukol_id = data.ukol_id
    },
    setFiltrace(state, filtrace) {
        state.filtrace.zacatek = new Date(filtrace.zacatek)
        state.filtrace.konec = new Date(filtrace.konec)
    },
    postPrepnoutUkol(state, data) {
      let cas = state.data.casy.find(c => c.konec === null)
      cas.konec = data.konec
      state.data.casy.push(data.novyZacatek)
    },
    putUkolyDokonceno(state, id) {
      let ukol = state.data.ukoly.find(u => u.id === id)
      ukol.dokonceno = Math.floor(new Date().getTime() / 1000)
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
      state.mojeZmena = true
    },
    casoveRazitko(state, posledni_update) {
      state.data.system.posledni_update = posledni_update
      state.mojeZmena = false
    },
    setError(state, status) {
      setTimeout(() => state.error = false, 3000)
      state.error = status
    },
    setLoading(state, isLoading) {
      state.preloader = isLoading
    },
    setAuthenticationData(state, authenticationData) {
      state.authenticationData = authenticationData
    },
    authenticate(state, authToken) {
      localStorage.setItem('self-management-authToken', authToken)
      state.authToken = authToken
    }
  },
  actions: {
    putUkolVratit({ commit, state }, { id }) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/ukoly-vratit', { id }, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putUkolVratit", id)
          commit("success", response.status)
          return id
        })
        .catch((error) => {
          console.error(error)
          commit("setError", error.response.status)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    postKvotyKopiruj({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/kvoty-kopiruj', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postKvotyKopiruj", response.data)
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
    deleteKvoty({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .delete(window.API_URL + '/kvoty/' + data.id, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("deleteKvoty", data.id)
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
    postKvoty({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/kvoty', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postKvoty", response.data)
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
    postPoznamky({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/poznamky', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postPoznamky", response.data)
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
    deleteSpecifickeUkoly({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .delete(window.API_URL + '/specificke-ukoly/' + Object.values(data).join('-'), { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("deleteSpecifickeUkoly", data)
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
    postSpecifickeUkoly({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/specificke-ukoly', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("postSpecifickeUkoly", data)
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
    putCasyPosunout({ commit, state }, data) {
      commit('setLoading', true)
      return axios
        .put(window.API_URL + '/casy-presunout', data, { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("putCasyPosunout", response.data)
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
          if (response.data) {
            commit("postPrepnoutUkol", response.data)
          }
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
      return axios
        .get(window.API_URL + '/all', { headers: { Authorization: `Bearer ${state.authToken}` }})
        .then((response) => {
          commit("getAll", response.data)
        })
        .catch((error) => {
          console.error(error)
          commit("setError", "POZOR! Nemáš aktuální data.")
        })
    },
    login({ commit }, { email, password }) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/login', { email, password })
        .then((response) => {
          commit('setAuthenticationData', response.data)
          commit("success")
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    authenticate({ commit, dispatch, state }, code) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/authenticate', { code, ...state.authenticationData })
        .then((response) => {
          commit('authenticate', response.data)
          commit("success")
          dispatch('getAll')
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    },
    register({ commit, dispatch }, data) {
      commit('setLoading', true)
      return axios
        .post(window.API_URL + '/register', data)
        .then((response) => {
          commit('register', response.data)
          commit("success")
          dispatch('getAll')
        })
        .catch((error) => {
          console.error(error)
          alert(error.response.data)
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
    sync({ state, dispatch, getters, commit }) {
      if (getters.isLoggedIn) {
        return axios.get(window.API_URL + '/system/posledni_update', { headers: { Authorization: `Bearer ${state.authToken}` }} )
          .then((response) => {
            if (state.data.system.posledni_update !== response.data && !state.mojeZmena) {
              dispatch("getAll")
            } else if (state.mojeZmena) {
              commit("casoveRazitko", response.data)          
            }
          })
      }
  }
  },
  modules: {
  }
})
