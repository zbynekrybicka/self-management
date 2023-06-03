<template>
  <div>
    <h5 class="font-weight-bold mt-5 mb-4 text-center">Úkoly</h5>

    <h3 class="font-weight-bold" v-if="vybranyUkol" v-html="nazev" />

    <div v-if="vybranyUkol">
      <div class="form-group">
        <input class="form-control" type="text" v-model="vybranyUkol.nazev" @change="ulozitPopis"/>
      </div>
      <div class="form-group">
        <textarea class="form-control" v-model="vybranyUkol.popis" rows="5" @change="ulozitPopis"/>
      </div>
      <div class="form-group">
        <input class="form-control" type="text" @keyup.enter="pridatPoznamku" placeholder="Přidat poznámku..."/>
      </div>
      <ul class="list-group">
        <li v-for="poznamka of poznamky" class="list-group-item">
          <div class="row">
            <div class="col-12">
              {{ poznamka.zapsano.getDate() }}. 
              {{ poznamka.zapsano.getMonth() }}. 
              {{ poznamka.zapsano.getFullYear() }}
              {{ poznamka.zapsano.getHours() }}:{{ (poznamka.zapsano.getMinutes()+"").padStart(2, "0") }}
            </div>
            <div class="col-12 font-weight-bold">{{ poznamka.poznamka }}</div>
          </div>
        </li>
      </ul>      

      <hr />

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
        <div class="mr-2 mb-2">
          <button class="btn btn-primary" @click="prevestNaProjekt">Převést na projekt</button>
        </div>
        <div class="mr-2 mb-2" v-if="!jeRutina">
          <button class="btn btn-primary" @click="oznacitZaRutinu">Označit jako rutinu</button>
        </div>
        <div class="mr-2 mb-2" v-if="jeRutina">
          <button class="btn btn-danger" @click="zrusitRutinu">Zrušit rutinu</button>
        </div>
      </div>
    </div>

    <hr v-if="vybranyUkol" />

    <SeznamUkolu :id="vybranyUkol ? vybranyUkol.id : null" :rozbaleno="false" :root="true" />

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
    poznamky() {
      return this.$store.getters.poznamkyById(this.id)
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
    },
    jeRutina() {
      return !!this.$store.getters.specificke_ukoly.find(su => su.ukol_id === this.id && su.typ === "rutina")
    }
  },
  methods: {
    pridatPoznamku(e) {
      if (e.target.value.length > 0) {
        this.$store.dispatch('postPoznamky', { ukol_id: this.id, poznamka: e.target.value }).then(() => {
          e.target.value = ""
        })
      }
    },
    oznacitZaRutinu() {
      this.$store.dispatch('postSpecifickeUkoly', { ukol_id: this.id, typ: "rutina" })
    },
    zrusitRutinu() {
      this.$store.dispatch('deleteSpecifickeUkoly', { ukol_id: this.id, typ: "rutina" })
    },
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
    },
    prevestNaProjekt() {
      this.$store.dispatch('putUkolPresunout', { 
          id: parseInt(this.$route.params.id),
          ukol_id: null 
      })
    }
  }
}
</script>
