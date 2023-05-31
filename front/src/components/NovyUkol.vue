<template>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="Nový úkol..." @keyup.enter="novyUkol" />
    </div>
</template>

<script>
export default {
    name: "NovyUkol",

    methods: {
        novyUkol(e) {
            if (e.target.value.length > 0) {
                this.$store.dispatch('postUkol', {
                    ukol_id: parseInt(this.$route.params.id),
                    nazev: e.target.value
                })
                this.$emit('novy-ukol')
                e.target.value = ""
            }
        }
    }
}
</script>