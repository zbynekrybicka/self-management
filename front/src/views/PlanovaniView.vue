<template>
    <div>
        <div class="form-group">
            <div class="row">
                <div class="col-12 col-sm-4 text-center" @click="predchoziDen">
                    <button class="btn btn-light">Předchozí den</button>
                </div>
                <div class="col-12 col-sm-4 text-center">
                    <input type="date" class="form-control" v-model="den" />
                </div>
                <div class="col-12 col-sm-4 text-center" @click="nasledujiciDen">
                    <button class="btn btn-light">Následující den</button>
                </div>
            </div>
        </div>

        <ul class="list-group">
            <li class="list-group-item list-group-item-action" v-for="kvota of kvoty" :style="{background: kvota.progresbar}" @click.prevent="gotoUkol(kvota.ukol)">
                <div class="row">
                    <div class="col-12 col-sm-10" v-html="nazev(kvota.ukol)"></div>
                    <div class="col-12 col-sm-2 text-right">{{ kvota.odpracovano }}/{{ kvota.cas }}</div>
                </div>
            </li>
        </ul>

        <hr />

        <div class="form-group">
            <div class="row">
                <div class="col-12 col-sm-6 mb-3">
                    <input type="date" class="form-control" v-model="naDen" />
                </div>
                <div class="col-12 col-sm-6">
                    <button class="btn btn-primary" @click="kopiruj">Kopírovat na zvolený den</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "PlanovaniView",
    data: () => {
        const date = new Date()
        const zitra = new Date()
        zitra.setDate(date.getDate() + 1)
        return {
            seconds: 0,
            den: date.toISOString().split('T')[0],
            naDen: zitra.toISOString().split('T')[0],
        }
    },
    computed: {
        kvoty() {
            this.seconds
            return this.$store.getters.plan(this.den)
        }
    },
    methods: {
        nazev(ukol) {
            let nazevArr = [ ukol.nazev ]            
            let vybranyUkol = this.$store.getters.vybranyUkol(ukol.ukol_id)
            while (vybranyUkol) {
                nazevArr.push(vybranyUkol.nazev)
                vybranyUkol = this.$store.getters.vybranyUkol(vybranyUkol.ukol_id)
            }
            return nazevArr.reverse().join(' &ndash; ')
        },
        gotoUkol(ukol) {
            this.$router.push('/ukoly/' + ukol.id)
        },
        kopiruj() {
            this.$store.dispatch('postKvotyKopiruj', {
                zeDne: this.den,
                naDen: this.naDen
            }).then(() => {
                this.den = this.naDen
            })
        },
        predchoziDen() {
            const den = new Date(this.den)
            den.setDate(den.getDate() - 1)
            this.den = den.toISOString().split('T')[0]
        },
        nasledujiciDen() {
            const den = new Date(this.den)
            den.setDate(den.getDate() + 1)
            this.den = den.toISOString().split('T')[0]
        }
    },
    watch: {
        den(den) {
            const naDen = new Date(den)
            naDen.setDate(naDen.getDate() + 1)
            this.naDen = naDen.toISOString().split('T')[0]
        }
    },
    created() {
        setInterval(() => this.seconds++, 1000)
    }
}
</script>