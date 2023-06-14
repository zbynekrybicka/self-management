<template>
  <div>
    <h3 class="font-weight-bold" v-if="vybranyUkol" v-html="nazev" />

    <div v-if="vybranyUkol">
      <div class="form-inline">
        <div class="mr-2 mb-2" v-if="muzeEvidovatCasy">
          <button class="btn btn-primary" @click="zacitSPraci">Začít</button>
        </div>
        <div class="mr-2 mb-2">
          <button class="btn btn-success" @click="dokonceno">Dokončeno</button>
        </div>

        <div class="mr-2 mb-2">
          <button class="btn btn-primary" @click="presunoutUkol = true">Přesunout</button>
        </div>
        <div class="mr-2 mb-2">
          <button class="btn btn-primary" @click="prevestNaProjekt">Převést na projekt</button>
        </div>

        <div class="mr-2 mb-2">
          <span v-for="(tag, index) of tagy" :key="index" class="badge badge-success mr-2" @click="odstranitTag(tag)">{{ tag }}</span>
          <input type="text" class="form-control" @keyup.enter="pridatTag" list="dostupneTagy" placeholder="Přidat tag...">
          <datalist id="dostupneTagy">
            <option v-for="(tag, index) of dostupneTagy" :key="index">{{ tag }}</option>
          </datalist>
        </div>
      </div>
      
      <div class="form-group">
        <input class="form-control font-weight-bold" type="text" v-model="vybranyUkol.nazev" @change="ulozitPopis"/>
      </div>
      <div class="form-group" v-if="muzeEditovatObsah">
        <textarea class="form-control" v-model="vybranyUkol.popis" rows="5" @change="ulozitPopis"/>
      </div>

      <div class="form-group">
        <input class="form-control" type="text" @keyup.enter="pridatPoznamku" placeholder="Přidat komentář..."/>
      </div>
      <ul class="list-group">
        <li v-for="poznamka of poznamky" class="list-group-item" :key="poznamka.id">
          <div class="row">
            <div class="col-12">
              <span v-html="autor(poznamka)"/> &ndash;
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

      <div v-if="muzePridavatKvoty">
        <h6 class="font-weight-bold mt-5 mb-4 text-center">Kvóty</h6>
        <div class="form-group">
          <div class="row">
            <div class="col-12 col-sm-6">
              <input class="form-control" type="date" v-model="datumKvoty" />
            </div>
            <div class="col-12 col-sm-6">
              <input class="form-control" type="number" placeholder="Počet minut" value="0" @keyup.enter="pridatKvotu" />
            </div>
          </div>
        </div>

        <ul class="list-group">
          <li class="list-group-item list-group-item-action" v-for="kvota of kvoty" @click="smazatKvotu(kvota)" :key="kvota.id">
            <div class="row">
              <div class="col-6">{{ kvota.datum.split("-")[2] }}. {{ kvota.datum.split("-")[1] }}. {{ kvota.datum.split("-")[0] }}</div>
              <div class="col-6">{{ Math.floor(kvota.cas / 60) }}:{{ kvota.cas % 60 }}</div>
            </div>
          </li>
        </ul>
      </div>


      <div v-if="muzePridavatBody">
        <h6 class="font-weight-bold mt-5 mb-4 text-center">Body</h6>
        <div class="form-group">
          <div class="row">
            <div class="col-12 col-sm-6">
              <input class="form-control" type="text" v-model="nazevBodu" />
            </div>
            <div class="col-12 col-sm-6">
              <input class="form-control" type="number" placeholder="Počet bodů" value="0" @keyup.enter="pridatBodyKvotu" />
            </div>
          </div>
        </div>

        <ul class="list-group">
          <li class="list-group-item list-group-item-action" :style="{ background: progress(kvota) }" v-for="kvota of bodyKvoty" @click="bodyKvota = bodyKvota !== kvota ? kvota : null" :key="kvota.id">
            <div class="row">
              <div class="col-6">{{ kvota.nazev }}</div>
              <div class="col-6 text-right">{{ splnenoBodu(kvota) }}/{{ kvota.body }} <span class="delete" @click.stop="odstranitBodyKvotu(kvota)">&times;</span></div>
              <div class="col-12" v-if="bodyKvota === kvota">
                <input type="number" class="form-control" value="1" @click.stop="" @keyup.enter="pridatBody($event, kvota)" ref="pridatBody" />
              </div>
            </div>
          </li>
        </ul>


      </div>

      <!--h6 class="font-weight-bold mt-5 mb-4 text-center">Body</h6-->

    </div>

    <hr v-if="vybranyUkol" />

    <SeznamUkolu :id="vybranyUkol ? vybranyUkol.id : null" :rozbaleno="false" :root="true" />

    <hr />

    <NovyUkol />
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
    datumKvoty: new Date().toISOString().split('T')[0],
    nazevBodu: '',
    bodyKvota: null,
    presunoutUkol: false
  }),
  computed: {
    muzePridavatBody() {
      return this.$store.getters.isAdmin
    },
    muzePridavatKvoty() {
      return this.$store.getters.isAdmin
    },
    muzeEvidovatCasy() {
      return this.$store.getters.isAdmin
    },
    muzeTagovatUkoly() {
      return this.$store.getters.isAdmin
    },
    muzeEditovatObsah() {
      return this.$store.getters.isAdmin
    },

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
    kvoty() {
      return this.$store.getters.kvotyByUkolId(this.id)
    },
    bodyKvoty() {
      return this.$store.getters.bodyKvotyById(this.id)
    },
    body() {
      return this.$store.getters.bodyByUkolId(this.id)
    },
    tagy() {
      return Array.from(new Set(this.$store.getters.specificke_ukoly.filter(su => su.ukol_id === this.id).map(su => su.typ)))
    },
    dostupneTagy() {
      return Array.from(new Set(this.$store.getters.specificke_ukoly.map(su => su.typ))).filter(t => !this.tagy.includes(t))
    }
  },
  methods: {
    autor(poznamka) {
      const partneri = this.$store.getters.partneri
      return (poznamka.uzivatel_id in partneri) ? partneri[poznamka.uzivatel_id] : "<i>neznámý uživatel</i>" 
    },
    odstranitTag(typ) {
      this.$store.dispatch("deleteSpecifickeUkoly", {
        ukol_id: this.id,
        typ
      })
    },
    pridatTag(e) {
      if (e.target.value.length > 0) {
        this.$store.dispatch("postSpecifickeUkoly", {
          ukol_id: this.id,
          typ: e.target.value
        }).then(() => {
          e.target.value = ""
        })
      }
    },
    odstranitBodyKvotu(kvota) {
      if (confirm('Opravdu chcete odstranit toto bodové hodnocení?')) {
        this.$store.dispatch('deleteBodyKvoty', kvota)
      }
    },
    splnenoBodu(kvota) {
      return this.body.filter(b => b.body_kvota_id === kvota.id).reduce((a, b) => a + b.body, 0)
    },
    progress(kvota) {
      return this.$store.getters.progressbar(this.splnenoBodu(kvota) / kvota.body * 100)
    },
    pridatBody(e, kvota) {
      if (e.target.value > 0) {
        this.$store.dispatch('postBody', {
          body_kvota_id: kvota.id,
          body: e.target.value
        }).then(() => {
          this.bodyKvota = null
        })
      }
    },
    pridatBodyKvotu(e) {
      if (e.target.value > 0) {
        this.$store.dispatch('postBodyKvoty', {
          ukol_id: this.id,
          nazev: this.nazevBodu,
          body: e.target.value
        }).then(() => {
          this.nazevBodu = ""
          e.target.value = ""
        })
      }
    },
    smazatKvotu(kvota) {
      if (confirm('Opravdu chcete smazat kvótu?')) {
        this.$store.dispatch('deleteKvoty', kvota)
      }
    },
    pridatKvotu(e) {
      if (e.target.value > 0) {
        this.$store.dispatch('postKvoty', {
          ukol_id: this.id,
          datum: this.datumKvoty,
          cas: e.target.value
        })
      } else {
        alert('Nelze přidat nulový čas.')
      }
    },
    pridatPoznamku(e) {
      if (e.target.value.length > 0) {
        this.$store.dispatch('postPoznamky', { ukol_id: this.id, poznamka: e.target.value }).then(() => {
          e.target.value = ""
        })
      }
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
    pridatDoFronty() {
      this.$store.dispatch('postSpecifickeUkoly', { ukol_id: this.vybranyUkol.id, typ: "prioritni" })
    },
    odebratZFronty() {
      this.$store.dispatch('deleteSpecifickeUkoly', { ukol_id: this.vybranyUkol.id, typ: "prioritni" })
    },
    prevestNaProjekt() {
      this.$store.dispatch('putUkolPresunout', { 
          id: parseInt(this.$route.params.id),
          ukol_id: null 
      })
    }
  },

  watch: {
    bodyKvota(value) {
      if (value !== null) {
        this.$nextTick(() => {
          this.$refs.pridatBody[0].focus()
        })
      }
    }
  }
}
</script>

<style scoped>
span.delete {
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
  margin-left: 2rem;
  line-height: 1.5rem;
  vertical-align: middle;
}
span.delete:hover {
  color:brown;
  background-color: #FF5;
}
</style>