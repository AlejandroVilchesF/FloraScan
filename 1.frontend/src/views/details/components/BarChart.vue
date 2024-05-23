<template>
    <v-chart :ref="chartID" :id="chartID" :style="estilo" :option="option" :autoresize="true"
        :loading="dataSet == null ? true : false" />
</template>


<script>
import * as echarts from "echarts";
import VChart, { THEME_KEY } from "vue-echarts";

export default {
    name: "BarChart",
    props: {
        chartID: {
            type: String,
            required: true,
        },
        estilo: {
            type: String,
            default: "width: 100%; height: 420px;",
        },
        chartTitle: {
            type: String,
        },
        dataSet: {
            type: Array,
        },
        categories: {
            type: Array,
        },
    },
    components: {
        "v-chart": VChart,
    },
    data() {
        return {
            myChart: null,
            option: {
                title: {},
                xAxis: {
                    type: 'category',
                    data: [],
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    confine: true,
                    axisPointer: {
                        type: "shadow",
                        snap: false,
                        label: {
                            backgroundColor: "#6a7985",
                        },
                    },
                    extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
                    valueFormatter: (value) => value.toFixed(2),
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {},
                yAxis: {
                    type: "value",
                    name: "Ha",
                    nameLocation: "middle",
                    nameGap: 50,
                },
                series: [],
            },
        };
    },
    computed: {},
    watch: {
        dataSet: async function (newVal, oldVal) {
            if (newVal != null) {
                await this.forceRefresh()
            }
        },
        categories: async function (newVal, oldVal) {
            if (newVal != null) {
                await this.forceRefresh()
            }
        }
    },
    async mounted() {
        // Display the chart using the configuration items and data just specified.
        this.option.title.text = await this.chartTitle;
        this.option.xAxis.data = await this.categories;
        this.option.legend.data = ["Temperatura Minima", "Temperatura Maxima"];
        this.option.series = await this.dataSet;
        console.log(this.option);
    },

    methods: {
        /* Force refresh */
        async forceRefresh() {
            this.option.title.text = await this.chartTitle;
            this.option.xAxis.data = await this.categories;
            this.option.legend.data = ["Temperatura Minima", "Temperatura Maxima"];
            this.option.series = await this.dataSet;
        }
    },
};
</script>