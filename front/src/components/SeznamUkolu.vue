<template>
    <ul>
        <li class="list-group-item list-group-item-action" v-if="id && vybranyUkol && vybranyUkol.id === id" @click="vybratUkol(vybranyUkol.ukol_id)">^O úroveň výš</li>
        <li v-for="(ukol, index) of ukoly" :key="ukol.id">
            <a class="list-group-item list-group-item-action" @click.prevent="vybratUkol(ukol.id)">
                <div class="row">
                    <div class="col-6 col-sm-6 col-md-4">
                        <span class="badge badge-primary" 
                            @click.stop="rozbalenySeznam[index] = !rozbalenySeznam[index]"
                            v-if="podrizeneUkoly(ukol.id).length"
                            >{{ rozbalenySeznam[index] ? '&ndash;' : '+' }}</span>
                        {{ ukol.nazev }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-4" v-html="casyNaUkolech.find(x => x.id === ukol.id).cas" />
                    <div class="col-12 col-md-4 text-right" v-if="ukol.ukol_id !== null">
                        <a href="#" class="text-primary" v-if="!jeVeFronte(ukol)" @click.prevent.stop="pridatDoFronty(ukol)">Přidat do fronty</a>
                        <a href="#" class="text-danger" v-if="jeVeFronte(ukol)" @click.prevent.stop="odebratZFronty(ukol)">Odebrat z fronty</a>
                        <a href="#" class="text-primary ml-2" @click.prevent.stop="zacitSPraci(ukol)">Začít</a>
                    </div>
                </div>

            </a>
            <SeznamUkolu :id="ukol.id" v-if="rozbalenySeznam[index]" :rozbaleno="false" />
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
        rozbaleno: { required: false, default: true, }
    },
    computed: {
        ukoly() {
            return this.podrizeneUkoly(this.id)
        },
        vybranyUkol() {
            return this.$store.getters.vybranyUkol(parseInt(this.$route.params.id))
        },
        casyNaUkolech() {
            return this.$store.getters.casNaUkolech
        }
    },
    methods: {
        podrizeneUkoly(id) {
            return this.$store.getters.ukolyByUkolId(id)
        },  
        vybratUkol(id) {
            this.$router.push('/ukoly/' + (id ? id : ''));
        },
        zacitSPraci(ukol) {
            this.$store.dispatch('postPrepnoutUkol', ukol).then(() => {
                scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            })
        },
        jeVeFronte(ukol) {
            return this.$store.getters.ukolyVeFronte.includes(ukol)
        },
        pridatDoFronty(ukol) {
            this.$store.dispatch('postPrioritniFronta', ukol)
        },
        odebratZFronty(ukol) {
            this.$store.dispatch('deletePrioritniFronta', ukol)
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