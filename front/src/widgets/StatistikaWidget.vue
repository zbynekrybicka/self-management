<template>
    <div>
        <h5 class="font-weight-bold mt-5 mb-4 text-center">Statistika</h5>
        <ul class="list-group">
            <li v-for="skupina of skupiny.filter(s => casNaUkolech.find(c => c.id === s.id).cas.match(/[0-9]+:[0-9]+:[0-9]+:[0-9]+/))" 
                    class="list-group-item list-group-item-action" @click="vyberUkol(skupina)"
                    :class="rozpracovanaSkupina.id === skupina.id ? 'list-group-item-primary' : ''"
                    :key="skupina.id">
                <div class="row">
                    <div class="col-12 col-sm-9">{{ skupina.nazev }}</div>
                    <div class="col-12 col-sm-3 text-right" v-html="casNaUkolech.find(c => c.id === skupina.id).cas" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "StatistikaWidget",
    computed: {
        skupiny() {
            return this.$store.getters.skupiny
        },
        casNaUkolech() {
            return this.$store.getters.casNaUkolech
        },
        rozpracovanaSkupina() {
            return this.$store.getters.skupinaByUkolId(this.$store.getters.rozpracovanyUkol)
        },
    },
    methods: {
        vyberUkol(ukol) {
            this.$router.push('/ukoly/' + ukol.id)
        }
    }
}
</script>