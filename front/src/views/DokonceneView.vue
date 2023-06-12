<template>
    <div>
        <h5 class="text-success font-weight-bold mt-5 mb-4 text-center">Dokončené úkoly</h5>
        <ul class="list-group">
            <li v-for="ukol of ukoly" class="list-group-item list-group-item-action" v-html="nazev(ukol)" @click="vratitDoPrace(ukol)" />
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
            const ukoly = this.$store.getters.dokonceneUkoly
                .sort((a, b) => (a.dokonceno + "-" + a.id) < (b.dokonceno + "-" + b.id) ? 1 : -1)
            console.log(ukoly)
            return ukoly
        },
        skupiny() {
            return this.$store.getters.skupiny
        }
    },
    methods: {
        nazev(ukol) {
            return this.$store.getters.nazev(ukol, ' &ndash; ')
        },
        vratitDoPrace(ukol) {
            this.$store.dispatch("putUkolVratit", ukol).then(id => {
                this.$router.push('/' + id)
            })
        }
    },
    mounted() {
        this.zabaleno = this.skupiny.map(() => true)
    }
}
</script>