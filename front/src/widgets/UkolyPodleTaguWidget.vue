<template>
    <div>
        <h5 class="font-weight-bold mt-5 mb-4 text-center">{{ title }}</h5>
        <ul class="list-group">
            <li class="list-group-item list-group-item-action" 
                    v-for="ukol in ukoly" 
                    :key="ukol.id" 
                    @click="zvolenaAkce(ukol)"
                    :class="rozpracovanyUkol.id === ukol.id ? 'list-group-item-primary' : ''">
                <div class="row">
                    <div v-html="nazev(ukol)" class="col-12 col-sm-9" />
                    <div class="col-12 col-sm-3 text-right" v-html="casNaUkolech.find(c => c.id === ukol.id).cas" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "UkolyPodleTagu",
    props: {
        action: { type: String, required: false, default: "open" },
        title: { type: String, required: false, default: "" },
        tag: { type: String, required: true }
    },
    computed: {
        casNaUkolech() {
            return this.$store.getters.casNaUkolech
        },
        rozpracovanyUkol() {
            return this.$store.getters.rozpracovanyUkol
        },
        ukoly() {
            return this.$store.getters.specifickeUkolyByTyp(this.tag)
        }
    },
    methods: {
        nazev(ukol) {
            return this.$store.getters.nazev(ukol, " &ndash; ")
        },
        zvolenaAkce(ukol) {
            switch (this.action) {
                case "start":
                    this.zacitSPraci(ukol)
                    break;

                case "open":
                    this.otevritUkol(ukol)
                    break;
            }
        },
        zacitSPraci(ukol) {
            this.$store.dispatch('postPrepnoutUkol', ukol)
        },
        otevritUkol(ukol) {
            this.$router.push('/ukoly/' + ukol.id)
        }
        
    }
}
</script>