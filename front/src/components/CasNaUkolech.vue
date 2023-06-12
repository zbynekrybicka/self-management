<template>
    <div>
        <h2 class="font-weight-bold">Čas strávený na úkolech</h2>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th @click="_sortBy('nazev')">Úkol</th>
                    <th @click="_sortBy('cas')">Čas</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="ukol of data" :key="ukol.id">
                    <tr @click="vyberUkol(ukol.id)">
                        <td v-html="ukol.nazev"></td>
                        <td>{{ ukol.cas }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "CasNaUkolech",
    data: () => ({
        _sort: 'nazev'
    }),
    computed: {
        data() {
            return this.$store.getters.casNaUkolech.sort((a, b) => {
                let [, atribut, smer ] = this._sort.match(/([a-zA-Z0-9_]+)-?(Rev)?/)
                smer = smer !== 'Rev'
                return a[atribut] > b[atribut] ? (smer ? 1 : -1) : (smer ? -1 : 1)
            })
        }
    },
    methods: {
        _sortBy(atribut) {
            if (this._sort === atribut) {
                this._sort = atribut + "-Rev"
            } else {
                this._sort = atribut
            }
        },
        vyberUkol(id) {
            this.$router.push('/' + id)
        }
    }
}
</script>

<style>
thead tr th, tbody tr {
    cursor: pointer;
}
</style>