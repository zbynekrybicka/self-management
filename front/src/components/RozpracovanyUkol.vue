<template>
    <div class="rozpracovany-ukol-okno">
        <div class="row">
            <div class="col-12 col-sm-6">
                <h6 class="text-center font-weight-bold border border-success pt-2 pb-2 cursor-pointer" @click="vyberUkol(predchoziUkol)" v-html="nazev(predchoziUkol)" />
            </div>
            <div class="col-12 col-sm-6">
                <h6 class="text-center font-weight-bold border border-primary pt-2 pb-2 cursor-pointer progres-bar" @click="vyberUkol(rozpracovanyUkol)" v-html="nazev(rozpracovanyUkol) + '<br />' + casUkolu" />
            </div>
        </div>
    </div>
</template>
<script>
import RychlySeznamUkolu from '@/components/RychlySeznamUkolu.vue'

export default {
    name: "RozpracovanyUkol",
    data: () => ({
        seconds: 0,
        interval: null
    }),
    computed: {
        predchoziUkol() {
            return this.$store.getters.predchoziUkol
        },
        rozpracovanyUkol() {
            return this.$store.getters.rozpracovanyUkol
        },
        casy() {
            return this.$store.getters.casyByUkolId(this.rozpracovanyUkol.id);
        },
        casUkolu() {
            this.seconds
            let ts = this.casy.find(c => c.konec === null).zacatek;
            let zacatek = new Date(ts * 1000);
            let now = new Date();
            let rozdil = (now.getTime() - zacatek.getTime()) / 1000;
            return Math.floor(rozdil / 3600) + ":" + (Math.floor(rozdil / 60 % 60) + "").padStart(2, "0") + ":" + (Math.floor(rozdil % 60) + "").padStart(2, "0");
        },
        progress() {
            this.seconds
            const plan = this.$store.getters.plan().find(p => p.ukol_id === this.rozpracovanyUkol.id)
            return plan ? plan.splneno + "%" : "0%"
        }
    },
    methods: {
        nazev(ukol) {
            let nazev = [];
            while (ukol) {
                nazev.push(ukol.nazev);
                ukol = this.$store.getters.vybranyUkol(ukol.ukol_id);
            }
            return nazev.reverse().join("<br />");
        },
        vyberUkol(ukol) {
            this.$router.push('/' + ukol.id)
        }
    },
    mounted() {
        this.interval = setInterval(() => this.seconds++, 1000);
    },
    unmounted() {
        clearInterval(this.interval);
        this.interval = null;
    },
    components: { RychlySeznamUkolu }
}
</script>

<style>
.cursor-pointer {
    cursor: pointer;
}
.progres-bar {
    background: linear-gradient(to right, #CFC 0%, #CFC v-bind("progress"), white v-bind("progress"), white 100%)
}
</style>