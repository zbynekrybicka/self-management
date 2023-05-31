<template>
    <div class="form-group">
        <div class="row" v-if="rozbaleno">
            <div class="col-12 col-sm-3 col-lg-3 text-center mb-3">
                <button class="btn btn-primary" @click="predchoziDen">Předchozí den</button>
            </div>
            <div class="col-12 col-sm-9 col-lg-3 mb-3">
                <input type="datetime-local" class="form-control" v-model="filtrace.zacatek" @change="zmenitFiltraci(filtrace)" />
            </div>
            <div class="col-12 col-sm-9 col-lg-3 mb-3">
                <input type="datetime-local" class="form-control" v-model="filtrace.konec" @change="zmenitFiltraci(filtrace)" />
            </div>
            <div class="col-12 col-sm-3 col-lg-3 text-center mb-3">
                <button class="btn btn-primary" @click="nasledujiciDen">Následující den</button>
            </div>
            <div class="col-12 text-center mb-3">
                <button class="btn btn-light" @click="rozbaleno = false">Méně možností</button>
            </div>
        </div>
        <div class="text-center" v-if="!rozbaleno">
            <button class="btn btn-primary mr-3" @click="dnes">Dnes</button>
            <button class="btn btn-light" @click="rozbaleno = true">Více možností</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "FiltracePodleCasu",
    data: () => ({
        rozbaleno: false,
    }),
    computed: {
        filtrace() {
            let filtrace = this.$store.getters.filtrace
            return {
                zacatek: this.formatDateForInput(filtrace.zacatek),
                konec: this.formatDateForInput(filtrace.konec),
            }
        }
    },
    methods: {
        formatDateForInput(date) {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`
            return formattedDate
        },
        zmenitFiltraci() {
            this.$store.commit('setFiltrace', this.filtrace)
        },

        predchoziDen() {
            const filtrace = this.$store.getters.filtrace
            filtrace.zacatek.setDate(filtrace.zacatek.getDate() - 1)
            filtrace.konec.setDate(filtrace.konec.getDate() - 1)
            this.$store.commit('setFiltrace', filtrace)
        },
        nasledujiciDen() {
            const filtrace = this.$store.getters.filtrace
            filtrace.zacatek.setDate(filtrace.zacatek.getDate() + 1)
            filtrace.konec.setDate(filtrace.konec.getDate() + 1)
            this.$store.commit('setFiltrace', filtrace)
        },
        dnes() {
            const dnes = (...hodina) => {
                let dnes = new Date()
                dnes.setHours(...hodina)
                return dnes
            }
            this.$store.commit('setFiltrace', {
                zacatek: dnes(0, 0, 0, 0),
                konec: dnes(23, 59, 0, 0),
            })
        }
    }
}
</script>