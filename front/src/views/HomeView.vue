<template>
  <div>
    <h1 class="font-weight-bold mt-5 mb-4">Úkoly</h1>

    <h3 class="font-weight-bold" v-if="vybranyUkol" v-html="nazev" />

    <div v-if="vybranyUkol">
      <div class="form-group">
        <input class="form-control" type="text" v-model="vybranyUkol.nazev" @change="ulozitPopis"/>
      </div>
      <div class="form-group">
        <textarea class="form-control" v-model="vybranyUkol.popis" rows="5" @change="ulozitPopis"/>
      </div>
      <div class="form-inline">
        <div class="mr-2 mb-2">
          <button class="btn btn-primary" @click="zacitSPraci">Začít</button>
        </div>
        <div class="mr-2 mb-2">
          <button class="btn btn-success" @click="dokonceno">Dokončeno</button>
        </div>
        <div class="mr-2 mb-2">
          <button class="btn btn-danger" @click="zrusit">Zrušit</button>
        </div>
        <div class="mr-2 mb-2" v-if="!jeVeFronte">
          <button class="btn btn-primary" @click="pridatDoFronty">Přidat do fronty</button>
        </div>
        <div class="mr-2 mb-2" v-if="jeVeFronte">
          <button class="btn btn-danger" @click="odebratZFronty">Odebrat z fronty</button>
        </div>
        <div class="mr-2 mb-2">
          <button class="btn btn-primary" @click="presunoutUkol = true">Přesunout</button>
        </div>
      </div>
    </div>

    <hr v-if="vybranyUkol" />

    <SeznamUkolu :id="vybranyUkol ? vybranyUkol.id : null" :rozbaleno="false" />

    <hr />

    <NovyUkol @novy-ukol="prejdiNaNovyProjekt" />
    <PresunoutUkol v-if="presunoutUkol" @close="presunoutUkol = false" />
  </div>
</template>

<script>
import NovyUkol from '@/components/NovyUkol.vue' 
import SeznamUkolu from '@/components/SeznamUkolu.vue' 
import PresunoutUkol from '@/components/PresunoutUkol.vue' 

export default {
  name: 'HomeView',
  components: { NovyUkol, SeznamUkolu, PresunoutUkol },
  data: () => ({
    vybranyProjekt: 0,
    presunoutUkol: false
  }),
  computed: {
    id() {
      return parseInt(this.$route.params.id)
    },
    prace() {
      return this.$store.getters.casyByUkolId(this.id)
    },
    vybranyUkol() {
      return this.$store.getters.vybranyUkol(this.id)
    },
    projekty() {
      return this.$store.getters.ukolyByUkolId(null)
    },
    nazev() {      
      let nazev = []
      let vybranyUkol = this.vybranyUkol
      while (vybranyUkol) {
        nazev.push(vybranyUkol.nazev)
        vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
      }
      return nazev.reverse().join(' &ndash; ')
    },
    jeVeFronte() {
      return this.$store.getters.ukolyVeFronte.includes(this.vybranyUkol)
    }
  },
  methods: {
    ulozitNadpis(e) {
      console.log(e.target.innerText)
      this.vybranyUkol.nazev = e.target.innerText
      this.$store.dispatch('putUkoly', this.vybranyUkol)
    },
    ulozitPopis() {
      this.$store.dispatch('putUkoly', this.vybranyUkol)
    },
    zacitSPraci() {
      this.$store.dispatch('postPrepnoutUkol', this.vybranyUkol)
      // this.$store.dispatch('postCasy', this.id)
    },
    dokonceno() {
      this.$store.dispatch('putUkolyDokonceno', this.id).then(() => {
        let ukol_id = this.vybranyUkol.ukol_id
        this.$router.push('/ukoly/' + (ukol_id ? ukol_id : ''))
      })
    },
    zrusit() {
      this.$store.dispatch('putUkolyZruseno', this.id).then(() => {
        let ukol_id = this.vybranyUkol.ukol_id
        this.$router.push('/ukoly/' + (ukol_id ? ukol_id : ''))
      })
    },
    prejdiNaNovyProjekt() {
      if (!this.vybranyUkol) {
        this.vybranyProjekt = this.projekty.length
      }
    },
    pridatDoFronty() {
      this.$store.dispatch('postPrioritniFronta', this.vybranyUkol)
    },
    odebratZFronty() {
      this.$store.dispatch('deletePrioritniFronta', this.vybranyUkol)
    }
  }
}
</script>
