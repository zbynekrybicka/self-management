<template>
    <div>
        <h5 class="text-success font-weight-bold mt-5 mb-4 text-center">Dokončené úkoly</h5>
        <ul class="list-group">
            <li v-for="(skupina, index) of skupiny.filter(s => ukoly.filter(u => jeVeSkupine(u, s)).length > 0)">
                <div class="list-group-item list-group-item-action font-weight-bold" @click="zabaleno[index] = !zabaleno[index]">
                    <div class="row">
                        <div class="col">{{ skupina.nazev }}</div>
                        <div class="col">{{ ukoly.filter(u => jeVeSkupine(u, skupina)).length }}</div>
                    </div>
                </div>
                <ul v-if="!zabaleno[index]">
                    <li v-for="ukol of ukoly.filter(u => jeVeSkupine(u, skupina))" class="list-group-item" v-html="nazev(ukol)" />
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "DokonceneView",
    data: () => ({
        zabaleno: []
    }),
    computed: {
        ukoly() {
            return this.$store.getters.dokonceneUkoly
        },
        skupiny() {
            return this.$store.getters.skupiny
        }
    },
    methods: {
        nazev(ukol) {
            let nazevArr = [ ukol.nazev ]            
            let vybranyUkol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            while (vybranyUkol) {
                nazevArr.push(vybranyUkol.nazev)
                vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
            }
            nazevArr.pop()
            return nazevArr.reverse().join(' &ndash; ')
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