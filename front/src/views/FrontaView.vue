<template>
    <div>
        <h5 class="font-weight-bold mt-5 mb-4 text-center">Rutina</h5>

        <ul class="list-group">
            <li v-for="ukol of rutina" class="list-group-item list-group-item-action font-weight-bold" @click.prevent="zacitSPraci(ukol)" v-html="nazev(ukol, true)" />
        </ul>

        <h5 class="font-weight-bold mt-5 mb-4 text-center">Plnění plánu</h5>

        <ul class="list-group">
            <li v-for="p of plan" class="list-group-item list-group-item-action font-weight-bold" @click.prevent="zacitSPraci(p.ukol)" :style="{ background: p.progresbar } ">
                <div class="row">
                    <div class="col-12 col-sm-10" v-html="nazev(p.ukol, true)"></div>
                    <div class="col-12 col-sm-2 text-right">{{ p.odpracovano }}/{{ p.cas }}</div>
                </div>
            </li>
        </ul>

        <h5 class="font-weight-bold mt-5 mb-4 text-center">Prioritní úkoly</h5>
        <ul class="list-group">
            <li v-for="(skupina, index) of skupiny.filter(s => ukoly.filter(u => jeVeSkupine(u, s)).length > 0)">
                <div class="list-group-item list-group-item-action" @click="zabaleno[index] = !zabaleno[index]"
                        :class="jeVeSkupine(rozpracovanyUkol, skupina) ? 'list-group-item-primary' : ''">
                    <div class="row">
                        <div class="col-12 font-weight-bold">{{ skupina.nazev }}</div>
                        <div class="col-10" v-html="casNaUkolech.find(c => c.id === skupina.id).cas" />
                        <div class="col-2">{{ ukoly.filter(u => jeVeSkupine(u, skupina)).length }}</div>
                    </div>
                </div>
                <ul v-if="!zabaleno[index]">
                    <li class="list-group-item list-group-item-action" 
                            v-for="ukol in ukoly.filter(u => jeVeSkupine(u, skupina))" 
                            :key="ukol.id" 
                            @click="vyberUkol(ukol)"
                            :class="rozpracovanyUkol.id === ukol.id ? 'list-group-item-primary' : ''">
                        <div class="row">
                            <div v-html="nazev(ukol)" class="col-12 col-sm-4" />
                            <div class="col-9 col-sm-4" v-html="casNaUkolech.find(c => c.id === ukol.id).cas" />
                            <div class="col-3 col-sm-4 text-right">
                                <a href="#" class="text-primary" @click.prevent.stop="zacitSPraci(ukol)">Začít</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>

        <h5 class="font-weight-bold mt-5 mb-4 text-center">Zpracované úkoly</h5>

        <ul class="list-group">
            <li v-for="cas of ukolyPodleCasu" class="list-group-item">
                <div class="row" @click.prevent="editovatCas = editovatCas ? null : cas">
                    <div class="col-12 col-sm-9 font-weight-bold" v-html="nazev(cas.ukol, true)" />
                    <div class="col-12 col-sm-3 text-right">{{ (cas.zacatek.getHours()+"").padStart(2, "0") }}:{{ (cas.zacatek.getMinutes()+"").padStart(2, "0") }}</div>
                </div>
                <div class="row" v-if="editovatCas && editovatCas.id === cas.id">
                    <div class="col-12">
                        <input type="number" class="form-control" value="0" @keyup.enter="posunoutCasZpet" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "FrontaView",
    data: () => ({
        seconds: 0,
        zabaleno: [],
        editovatCas: null,
        posunoutZpet: 0,
    }),
    computed: {
        skupiny() {
            return this.$store.getters.skupiny
        },
        ukoly() {
            return this.$store.getters.ukolyVeFronte
        },
        casNaUkolech() {
            return this.$store.getters.casNaUkolech
        },
        rozpracovanyUkol() {
            return this.$store.getters.rozpracovanyUkol
        },
        ukolyPodleCasu() {
            return this.$store.getters.ukolyPodleCasu
        },
        rutina() {
            return this.$store.getters.specifickeUkolyByTyp("rutina")
        },
        plan() {
            this.seconds
            return this.$store.getters.plan()
        }
    },
    methods: {
        posunoutCasZpet(e) {
            this.$store.dispatch('putCasyPosunout', { id: this.editovatCas.id, minuty: parseInt(e.target.value) }).then(() => {
                this.editovatCas = null
            })
        },
        nazev(ukol, vcetnePrvniho = false) {
            const nazevArr = [ ukol.nazev ]            
            let vybranyUkol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            while (vybranyUkol) {
                nazevArr.push(vybranyUkol.nazev)
                vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
            }
            if (!vcetnePrvniho) {
                nazevArr.pop()
            }
            return nazevArr.reverse().join(' &ndash; ')
        },
        vyberUkol(ukol) {
            this.$router.push('/ukoly/' + ukol.id)
        },
        odebratZFronty(ukol) {
            this.$store.dispatch('deletePrioritniFronta', ukol)
        },
        zacitSPraci(ukol) {
            this.$store.dispatch('postPrepnoutUkol', ukol).then(() => {
                scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            })
        },
        jeVeSkupine(ukol, skupina) {
            while (ukol.ukol_id) {
                ukol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            }
            return ukol.id === skupina.id
        },
    },
    created() {
        this.zabaleno = this.skupiny.map(() => true)
        setInterval(() => this.seconds++, 1000)
    }
}
</script>