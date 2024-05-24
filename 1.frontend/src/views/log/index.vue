<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-4">
        <Select label="Tipo de Log" id="searchLogType" :modelValue="findParams.logType" :options="logTypeOptions"
          :removeDefault="true" valKey="value" textKey="key" icon="fas fa-sort" @change="changeLogType($event)" />
      </div>
    </div>
    <BlockFull title="System Log">
      <template v-slot:content>
        <Table ref="logTable" :columns="log_columns" :rows="log_rows" id="logTable" :isLoading="loadingTable"
          :serverSize="true" :totalRecords="totalRecords" :showOptions="false" :searchActive="false"
          :searchDisabled="true" :showRowNumber="false" :pageJumpOption="true" :sortAllowed="false"
          @onPageChange="onPageChange" @onPerPageChange="onPerPageChange">
          <template v-slot:top-right-addon>
            {{ 'Entradas: ' }}{{ totalRecords }}
          </template>
        </Table>
      </template>
    </BlockFull>
  </div>
</template>

<script>
import BlockFull from '../../components/commons/BlockFull.vue';
import Table from '../../components/commons/Table.vue';
import LogService from '../../services/LogService';
import Select from '../../components/commons/Select.vue';
import dayjs from "dayjs";

export default {
  data() {
    return {
      serverParams: {
        page: 1,
        perPage: 50,
      },
      findParams: {
        logType: 'any'
      },
      log_columns: [
        {
          label: 'Type',
          field: "logType",
          type: "html",
          class: "text-center",
        },
        {
          label: 'Log',
          field: "log",
          type: "text",
          class: "text-center",
        },
        {
          label: 'Date',
          field: "createdAt",
          type: "text",
          class: "text-center",
        },
      ],
      log_rows: [],
      totalRecords: 0,
      loadingTable: false,
      logs: [],
      primaryLogs: [
        'SYSTEM ACCESS',
        'ACCOUNT REGISTER',
        'RECOVERY REQUEST',
        'ACCOUNT ACTIVATION',
        'PASSWORD RESET',
        'ADMIN'
      ],
      successLogs: [
        'USER CREATE',
        'USER UPDATE',
        'SELF UPDATE',
        'ROLE CREATE',
        'ROLE UPDATE',
        'PLANT CREATE',
        'PLANT UPDATE',
        'DISEASE CREATE'
      ],
      dangerLogs: [
        'USER DELETE',
        'SELF DELETE',
        'ROLE DELETE',
        'PERMISSION VIOLATION'
      ],
      secondaryLogs: [],
      logTypeOptions: [
        { key: 'Cualquiera', value: 'any' },
        { key: 'SYSTEM ACCESS', value: 'SYSTEM ACCESS' },
        { key: 'ACCOUNT REGISTER', value: 'ACCOUNT REGISTER' },
        { key: 'RECOVERY REQUEST', value: 'RECOVERY REQUEST' },
        { key: 'ACCOUNT ACTIVATION', value: 'ACCOUNT ACTIVATION' },
        { key: 'PASSWORD RESET', value: 'PASSWORD RESET' },
        { key: 'ADMIN', value: 'ADMIN' },
        { key: 'USER CREATE', value: 'USER CREATE' },
        { key: 'USER UPDATE', value: 'USER UPDATE' },
        { key: 'SELF UPDATE', value: 'SELF UPDATE' },
        { key: 'ROLE CREATE', value: 'ROLE CREATE' },
        { key: 'ROLE UPDATE', value: 'ROLE UPDATE' },
        { key: 'USER DELETE', value: 'USER DELETE' },
        { key: 'SELF DELETE', value: 'SELF DELETE' },
        { key: 'ROLE DELETE', value: 'ROLE DELETE' },
        { key: 'PLANT CREATE', value: 'PLANT CREATE' },
        { key: 'PLANT UPDATE', value: 'PLANT UPDATE' },
        { key: 'DISEASE CREATE', value: 'DISEASE CREATE' },
        { key: 'PERMISSION VIOLATION', value: 'PERMISSION VIOLATION' },
      ]
    };
  },
  components: {
    BlockFull,
    Table,
    Select
  },
  mounted() {
    this.$refs.logTable.setParams(this.serverParams.page, this.serverParams.perPage);
    this.retrieveLogs();
  },
  computed: {},
  methods: {
    /************************ FUNCTIONS SERVER SIZED TABLE **************************/
    /**
     * Esta función actualiza el objeto de los parámetros para el servidor
     * @param {*} newProps
     */
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },

    /**
     * Esta función cambia la página actual
     * @param {Object} params
     */
    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
      this.retrieveLogs();
    },

    /**
     * Esta función cambia el número de registros por página
     * @param {Object} params
     */
    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.retrieveLogs();
    },
    /********************************************************************************/
    async retrieveLogs() {
      this.loadingTable = true;
      try {
        let useFindParams = {};
        if (this.findParams.logType != 'any') {
          useFindParams['logType'] = this.findParams.logType;
        }
        const response = await LogService.getLogs(this.serverParams, useFindParams);
        this.logs = response.data.data;
        this.totalRecords = response.data.totalRecords;
        await this.populateLogsRows();
        this.loadingTable = false;
      } catch (err) {
        this.loadingTable = false;
        console.log(err);
      }
    },
    populateLogsRows() {
      return new Promise((resolve) => {
        this.log_rows = [];
        let localLogRows = [];
        for (const entry of this.logs) {
          let color = this.getColorType(entry.logType)
          let insertData = {
            logType: `<span class="p-2 d-block bg-${color} text-white fw-bold rounded rounded-4">${entry.logType}</span>`,
            log: entry.log,
            createdAt: dayjs(new Date(entry.createdAt)).format('YYYY-MM-DD H:mm A')
          }
          localLogRows.push(insertData);
        }
        this.log_rows = JSON.parse(JSON.stringify(localLogRows));
        if (this.log_rows.length == 0) {
          this.$refs.logTable.clearTable();
        }
        this.loadingTable = false;
        resolve();
      });
    },
    getColorType(type) {
      if (this.primaryLogs.includes(type)) {
        return 'primary';
      } else if (this.successLogs.includes(type)) {
        return 'success';
      } else if (this.dangerLogs.includes(type)) {
        return 'danger';
      } else {
        return 'secondary';
      }
    },
    changeLogType(event) {
      this.findParams.logType = event.target.value;
      this.retrieveLogs();
    }
  },

};
</script>