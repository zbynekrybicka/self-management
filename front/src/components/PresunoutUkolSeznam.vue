<template>
    <ul class="presunout-ukol">
        <li v-for="ukol of ukoly">
            <div class="pt-1 pb-1">&mdash; <a href="#" @click.prevent.stop="$emit('vybratUkol', ukol)">{{ ukol.nazev }}</a></div>
            <PresunoutUkolSeznam :id="ukol.id" @vybratUkol="$emit('vybratUkol', $event)" />
        </li>
    </ul>
</template>

<script>
import PresunoutUkolSeznam from './PresunoutUkolSeznam.vue'

export default {
    name: "PresunoutUkolSeznam",
    components: { PresunoutUkolSeznam },
    props: {
        id: { type: Number, required: false, default: null }
    },
    computed: {
        ukoly() {
            return this.$store.getters.ukolyByUkolId(this.id)
        }
    }
}
</script>

<style>
.presunout-ukol {
    padding-left: 25px;
}
</style>