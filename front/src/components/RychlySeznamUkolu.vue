<template>
    <ul>
        <li v-for="(ukol, index) of ukoly" :key="ukol.id">
            <a href="#" @click.prevent="prepnoutUkol(ukol)">
                <span class="badge badge-primary" 
                    @click.stop="rozbalenySeznam[index] = !rozbalenySeznam[index]"
                    v-if="podrizeneUkoly(ukol.id).length"
                    >{{ rozbalenySeznam[index] ? '&ndash;' : '+' }}</span>
                {{ ukol.nazev }}
            </a>
            <RychlySeznamUkolu :id="ukol.id" v-if="rozbalenySeznam[index]" />
        </li>
    </ul>
</template>

<script lang="js">
export default {
    name: "RychlySeznamUkolu",
    data: () => ({
        rozbalenySeznam: [],
        
    }),
    props: {
        id: { required: false, type: Number, default: null },
    },
    computed: {
        ukoly() {
            return this.podrizeneUkoly(this.id)
        },
    },
    methods: {
        podrizeneUkoly(id) {
            return this.$store.getters.ukolyByUkolId(id)
        },  
        prepnoutUkol(ukol) {
            if (confirm('Opravdu chcete přepnout úkol na ' + ukol.nazev))
            this.$store.dispatch('postPrepnoutUkol', ukol)
        },
    },
    mounted() {
        this.rozbalenySeznam = this.ukoly.map(() => false)
    }
}
</script>