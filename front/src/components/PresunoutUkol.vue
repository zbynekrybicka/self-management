<template>
    <div class="dialog-pozadi">
        <div class="dialog-okno border border-success pl-3 pt-3 pr-3 pb-3">
            <button type="button" class="float-right btn btn-light" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                <span aria-hidden="true">&times;</span>
            </button>
            <h2 class="font-weight-bold">Přesunout úkol</h2>

            <PresunoutUkolSeznam @vybratUkol="vybratUkol" />
        </div>
    </div>
</template>

<script>
import PresunoutUkolSeznam from '@/components/PresunoutUkolSeznam.vue'
export default {
    name: "PresunoutUkol",
    components: { PresunoutUkolSeznam },
    methods: {
        vybratUkol(ukol) {
            if (confirm(`Opravdu chcete přesunout úkol do:\n ${this.nazev(ukol)}?`)) {
                this.$store.dispatch('putUkolPresunout', { 
                    id: parseInt(this.$route.params.id),
                    ukol_id: ukol.id 
                }).then(() => {
                    this.$emit('close')
                })
            }
        },
        nazev(ukol) {
            const nazevArr = [ ukol.nazev ]            
            let vybranyUkol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            while (vybranyUkol) {
                nazevArr.push(vybranyUkol.nazev)
                vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
            }
            return nazevArr.reverse().join(' \n ')
        }
    }
}
</script>

<style>
.dialog-pozadi {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
}
.dialog-okno {
    position: absolute;
    left: 5%;
    top: 5%;
    width: 90%;
    height: 90%;
    background-color: white;
    overflow-y: scroll;
}
</style>