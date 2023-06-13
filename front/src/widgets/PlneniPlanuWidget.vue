<template>
    <div>
        <h5 class="font-weight-bold mt-5 mb-4 text-center">Plnění plánu</h5>
        <ul class="list-group">
            <li v-for="p of plan" :key="p.ukol.id" class="list-group-item list-group-item-action font-weight-bold" @click.prevent="zacitSPraci(p.ukol)" :style="{ background: p.progresbar } ">
                <div class="row">
                    <div class="col-12 col-sm-10" v-html="nazev(p.ukol)"></div>
                    <div class="col-12 col-sm-2 text-right">{{ p.odpracovano }}/{{ p.cas }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "PlneniPlanuWidget",
    data: () => ({
        seconds: 0,
    }),
    computed: {
        plan() {
            this.seconds
            return this.$store.getters.plan()
        }
    },
    methods: {
        nazev(ukol) {
            return this.$store.getters.nazev(ukol, " &ndash; ")
        },

        zacitSPraci(ukol) {
            this.$store.dispatch('postPrepnoutUkol', ukol)
        }
    },

    created() {
        setInterval(() => this.seconds++, 1000)
    }

}
</script>