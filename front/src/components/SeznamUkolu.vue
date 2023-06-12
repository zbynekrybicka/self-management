<template>
    <ul :class="root ? 'list-group' : ''">
        <li class="list-group-item list-group-item-action list-group-item-warning" v-if="id && vybranyUkol && vybranyUkol.id === id" @click="vybratUkol(vybranyUkol.ukol_id)">&lt;&lt;&lt;</li>
        <li v-for="(ukol, index) of ukoly" :key="ukol.id">
            <a class="list-group-item list-group-item-action" @click.prevent="vybratUkol(ukol.id)" :class="rozpracovanyUkol.id === ukol.id ? 'list-group-item-primary' : ''">
                <div class="row">
                    <div class="col-12" :class="muzeEvidovatCasy ? 'col-sm-5' : 'col-sm-11'">
                        <span class="badge badge-primary" 
                            @click.stop="rozbalenySeznam[index] = !rozbalenySeznam[index]"
                            v-if="podrizeneUkoly(ukol.id).length"
                            >{{ rozbalenySeznam[index] ? '&ndash;' : '+' }}</span>
                        {{ ukol.nazev }}
                    </div>

                    <div class="col-12" :class="ukol.ukol_id !== null ? 'col-sm-4' : 'col-sm-5'" v-html="casyNaUkolech.find(x => x.id === ukol.id).cas" v-if="muzeEvidovatCasy" />
                    <div class="col-12 col-sm-2 text-right" v-if="ukol.ukol_id !== null && muzeEvidovatCasy">
                        <a href="#" class="text-primary" @click.prevent.stop="zacitSPraci(ukol)">Začít</a>                        
                    </div>

                    <div class="col-12 col-sm-1 text-right"  v-if="podrizeneUkoly(ukol.id).length">{{ pocetPodukolu(ukol.id) }}</div>
                </div>
            </a>
            <SeznamUkolu :id="ukol.id" v-if="rozbalenySeznam[index]" :rozbaleno="false" :root="false" />
        </li>
    </ul>
</template>

<script>
export default {
    name: "SeznamUkolu",
    data: () => ({
        rozbalenySeznam: []
    }),
    props: {
        id: { required: false, type: Number, default: null },
        rozbaleno: { required: false, default: true, },
        root: { required: false, default: false }
    },
    computed: {
        muzeEvidovatCasy() {
            return this.$store.getters.isAdmin
        },
        ukoly() {
            return this.podrizeneUkoly(this.id)
        },
        vybranyUkol() {
            return this.$store.getters.vybranyUkol(parseInt(this.$route.params.id))
        },
        casyNaUkolech() {
            return this.$store.getters.casNaUkolech
        },
        rozpracovanyUkol() {
            return this.$store.getters.rozpracovanyUkol
        }
    },
    methods: {
        podrizeneUkoly(id) {
            return this.$store.getters.ukolyByUkolId(id)
        },  
        vybratUkol(id) {
            this.$router.push('/' + (id ? id : ''));
        },
        zacitSPraci(ukol) {
            this.$store.dispatch('postPrepnoutUkol', ukol)
        },
        jeVeFronte(ukol) {
            return this.$store.getters.ukolyVeFronte.includes(ukol)
        },
        pridatDoFronty(ukol) {
            this.$store.dispatch('postSpecifickeUkoly', { ukol_id: ukol.id, typ: "prioritni" })
        },
        odebratZFronty(ukol) {
            this.$store.dispatch('deleteSpecifickeUkoly', { ukol_id: ukol.id, typ: "prioritni" })
        },
        pocetPodukolu(id) {
            return this.$store.getters.pocetPodukolu(id)
        }
    },
    mounted() {
        this.rozbalenySeznam = this.ukoly.map(() => this.rozbaleno)
    }
}
</script>
<style>
li {
    list-style-type: none;
}
.list-group-item-action:hover {
    cursor: pointer;
}
</style>