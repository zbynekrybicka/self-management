<template>
    <div class="form-group">
        <div class="row" v-if="rozbaleno">
            <div class="col-12 col-sm-3 col-lg-3 text-center mb-3">
                <button class="btn btn-primary" @click="predchoziDen" v-if="typ === 'D'">Předchozí den</button>
                <button class="btn btn-primary" @click="predchoziTyden" v-if="typ === 'T'">Předchozí týden</button>
                <button class="btn btn-primary" @click="predchoziMesic" v-if="typ === 'M'">Předchozí měsíc</button>
            </div>
            <div class="col-12 col-sm-9 col-lg-3 mb-3">
                <input type="datetime-local" class="form-control" v-model="filtrace.zacatek" @change="zmenitFiltraci(filtrace)" />
            </div>
            <div class="col-12 col-sm-9 col-lg-3 mb-3">
                <input type="datetime-local" class="form-control" v-model="filtrace.konec" @change="zmenitFiltraci(filtrace)" />
            </div>
            <div class="col-12 col-sm-3 col-lg-3 text-center mb-3">
                <button class="btn btn-primary" @click="nasledujiciDen" v-if="typ === 'D'">Následující den</button>
                <button class="btn btn-primary" @click="nasledujiciTyden" v-if="typ === 'T'">Následující týden</button>
                <button class="btn btn-primary" @click="nasledujiciMesic" v-if="typ === 'M'">Následující měsíc</button>
            </div>
            <div class="col-12 text-center mb-3">
                <button class="btn btn-light" @click="rozbaleno = false">&lt;&lt;</button>
            </div>
        </div>
        <div class="text-center" v-if="!rozbaleno">
            <button class="btn mr-3" :class="typ === 'D' ? 'btn-success' : 'btn-warning'" @click="dnes">D</button>
            <button class="btn mr-3" :class="typ === 'T' ? 'btn-success' : 'btn-warning'" @click="tentoTyden">T</button>
            <button class="btn mr-3" :class="typ === 'M' ? 'btn-success' : 'btn-warning'" @click="tentoMesic">M</button>
            <button class="btn btn-light" @click="rozbaleno = true">&gt;&gt;</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "FiltracePodleCasu",
    data: () => ({
        rozbaleno: false,
        typ: "D",
        tyden: 0,
        rok: (new Date()).getFullYear(),
        mesic: (new Date()).getMonth() + 1,
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
        predchoziMesic() {
            this.mesic--
            this.nastavMesic()
        },
        nasledujiciMesic() {
            this.mesic++
            this.nastavMesic()
        },
        tentoMesic() {
            this.rok = (new Date()).getFullYear()
            this.mesic = (new Date()).getMonth() + 1
            this.nastavMesic()
        },
        dnes() {
            this.typ = "D"
            const dnes = (...hodina) => {
                let dnes = new Date()
                dnes.setHours(...hodina)
                return dnes
            }
            this.$store.commit('setFiltrace', {
                zacatek: dnes(0, 0, 0, 0),
                konec: dnes(23, 59, 0, 0),
            })
        },
        tentoTyden() {
            this.tyden = 0
            this.nastavTyden()
        },
        predchoziTyden() {
            this.tyden--
            this.nastavTyden()
        },
        nasledujiciTyden() {
            this.tyden++
            this.nastavTyden()
        },
        nastavTyden() {
            this.typ = "T"
            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + this.tyden * 7);

            var zacatek = new Date(currentDate);
            zacatek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));

            var konec = new Date(zacatek);
            konec.setDate(zacatek.getDate() + 6);

            zacatek.setHours(0, 0, 0);
            konec.setHours(23, 59, 59);
            this.$store.commit('setFiltrace', { zacatek, konec })
        },
        nastavMesic() {
            this.typ = "M"
            var zacatek = new Date(this.rok, this.mesic - 1, 1);
            var konec = new Date(this.rok, this.mesic, 0);
            zacatek.setHours(0, 0, 0);
            konec.setHours(23, 59, 59);
            this.$store.commit('setFiltrace', { zacatek, konec })
        }
    }
}
</script>