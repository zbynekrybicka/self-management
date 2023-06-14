<template>
    <div>
        <PlneniPlanuWidget />
        <UkolyPodleTaguWidget title="Mimo práci" tag="rutina" action="start" />
        <UkolyPodleTaguWidget title="Networking" tag="networking" action="open" />
        <StatistikaWidget />
        <ZpracovaneUkolyWidget />
        <PlanovaniWidget />
    </div>
</template>

<script>
import PlneniPlanuWidget from '@/widgets/PlneniPlanuWidget.vue';
import StatistikaWidget from '@/widgets/StatistikaWidget.vue';
import UkolyPodleTaguWidget from '@/widgets/UkolyPodleTaguWidget.vue';
import ZpracovaneUkolyWidget from '@/widgets/ZpracovaneUkolyWidget.vue';
import PlanovaniWidget from '../widgets/PlanovaniWidget.vue';

export default {
    name: "WidgetyView",
    components: { PlneniPlanuWidget, StatistikaWidget, ZpracovaneUkolyWidget, UkolyPodleTaguWidget, PlanovaniWidget }
}
</script>