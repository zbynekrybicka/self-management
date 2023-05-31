<template>
    <div>
        <h1 class="font-weight-bold mt-5 mb-4">Tabule</h1>
        <ul>
            <li v-for="(skupina, index) of skupiny.filter(s => ukoly.filter(u => jeVeSkupine(u, s)).length > 0)">
                <div class="list-group-item list-group-item-action" @click="zabaleno[index] = !zabaleno[index]">
                    <div class="row">
                        <div class="col font-weight-bold">{{ skupina.nazev }}</div>
                        <div class="col" v-html="casNaUkolech.find(c => c.id === skupina.id).cas" />
                        <div class="col">{{ ukoly.filter(u => jeVeSkupine(u, skupina)).length }}</div>
                    </div>
                </div>
                <ul v-if="!zabaleno[index]">
                    <li class="list-group-item list-group-item-action" v-for="ukol in ukoly.filter(u => jeVeSkupine(u, skupina))" :key="ukol.id" @click="vyberUkol(ukol)">
                        <div class="row">
                            <div v-html="nazev(ukol)" class="col-12 col-sm-4" />
                            <div class="col-12 col-sm-4" v-html="casNaUkolech.find(c => c.id === ukol.id).cas" />
                            <div class="col-12 col-sm-4 text-right">
                                <a href="#" class="text-primary" @click.prevent.stop="zacitSPraci(ukol)">Začít</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "FrontaView",
    data: () => ({
        zabaleno: []
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
        }
    },
    methods: {
        nazev(ukol) {
            const nazevArr = [ ukol.nazev ]            
            let vybranyUkol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            while (vybranyUkol) {
                nazevArr.push(vybranyUkol.nazev)
                vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
            }
            nazevArr.pop()
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
        }
    },
    mounted() {
        this.zabaleno = this.skupiny.map(() => true)
    }
}
</script>