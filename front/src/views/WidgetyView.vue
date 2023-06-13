<template>
    <div>
        <PlneniPlanuWidget />
        <UkolyPodleTaguWidget title="Prioritní úkoly" tag="prioritni" />
        <UkolyPodleTaguWidget title="Mimo práci" tag="rutina" />
        <StatistikaWidget />
        <ZpracovaneUkolyWidget />
    </div>
</template>

<script>
import PlneniPlanuWidget from '@/widgets/PlneniPlanuWidget.vue';
import StatistikaWidget from '@/widgets/StatistikaWidget.vue';
import UkolyPodleTaguWidget from '@/widgets/UkolyPodleTaguWidget.vue';
import ZpracovaneUkolyWidget from '@/widgets/ZpracovaneUkolyWidget.vue';

export default {
    name: "WidgetyView",
    components: { PlneniPlanuWidget, StatistikaWidget, ZpracovaneUkolyWidget, UkolyPodleTaguWidget }
}
</script>