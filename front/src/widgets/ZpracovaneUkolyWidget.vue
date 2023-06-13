<template>
    <div>
        <h5 class="font-weight-bold mt-5 mb-4 text-center">Zpracované úkoly</h5>
        <ul class="list-group">
            <li v-for="cas of ukolyPodleCasu" class="list-group-item list-group-item-action" :key="cas.id">
                <div class="row" @click.prevent="editovatCas = editovatCas ? null : cas">
                    <div class="col-12 col-sm-9 font-weight-bold" v-html="nazev(cas.ukol)" />
                    <div class="col-12 col-sm-3 text-right">{{ (cas.zacatek.getHours()+"").padStart(2, "0") }}:{{ (cas.zacatek.getMinutes()+"").padStart(2, "0") }}</div>
                </div>
                <div class="row" v-if="editovatCas && editovatCas.id === cas.id">
                    <div class="col-12">
                        <input type="number" class="form-control" value="0" @keyup.enter="posunoutCasZpet" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "ZpracovaneUkolyWidget",
    data: () => ({
        editovatCas: null
    }),
    computed: {
        ukolyPodleCasu() {
            return this.$store.getters.ukolyPodleCasu
        },
    },
    methods: {
        nazev(ukol) {
            return this.$store.getters.nazev(ukol, " &ndash; ")
        },
        posunoutCasZpet(e) {
            this.$store.dispatch('putCasyPosunout', { id: this.editovatCas.id, minuty: parseInt(e.target.value) }).then(() => {
                this.editovatCas = null
            })
        },
    }
}
</script>