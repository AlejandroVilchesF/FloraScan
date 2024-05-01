<template>
  <div>
    <!-- MODAL ADD/EDIT -->
    <Modal
      ref="userModal"
      id="userModal"
      :title="userModalTitle"
      :footer="false"
      :frameless="true"
    >
      <template v-slot:modalBody>
          <form @submit="executeAction($event)">

            <!-- FIRST ROW -->
            <div class="row">
              <div class="col-12 col-md-6">
                <Input
                  :label="'Nombre de Usuario'" 
                  id="user-name"
                  type="text"
                  v-model="targetUser.info.name"
                  icon="fas fa-user"
                  :required="true"
                  :minlength="1"
                  :maxlength="30"
                ></Input>
              </div>
              <div class="col-12 col-md-6">
                <Input
                  :label="'Email'" 
                  id="user-email"
                  type="text"
                  v-model="targetUser.info.email"
                  icon="fas fa-envelope"
                  :required="true"
                  :minlength="1"
                  :maxlength="30"
                ></Input>
              </div>
            </div>

            <!-- SECOND ROW -->
            <div class="row">
              <div class="col-12 col-md-6">
                <Input
                    :label="'Contraseña'" 
                    id="user-pw"
                    type="password"
                    v-model="targetUser.info.password"
                    :required="addForm"
                    :minlength="6"
                    :maxlength="20"
                    icon="bi bi-key-fill"
                ></Input>
              </div>
              <div class="col-12 col-md-6">
                <Input
                    :label="'Repite la Contraseña'" 
                    id="user-pw-r"
                    type="password"
                    :required="addForm || newPassword"
                    v-model="passwordRepeat"
                    @input="checkValidity($event)"
                    icon="bi bi-key-fill"
                ></Input>
              </div>
            </div>

            <!-- THIRD ROW -->
            <div class="row" v-if="!addForm">
              <div class="col-12 col-md-6">
                <Input
                    :label="'Contraseña Actual'" 
                    id="user-pw-o"
                    type="password"
                    v-model="oldPassword"
                    :required="newPassword"
                    icon="bi bi-key text-danger"
                ></Input>
              </div>
            </div>

            <!-- FOURTH ROW -->
            <div class="row">
              <div class="col-12 col-md-6">
                <Select 
                  :label="'Role'"
                  id="user-role"
                  :modelValue="targetUser.role"
                  :options="roles"
                  valKey="_id"
                  textKey="alias"
                  :removeDefault="true"
                  icon="fas fa-address-card"
                  @change="setRole($event)"
                />
              </div>
              <div class="col-12 col-md-6">
                <SwitchBordered 
                  :label="'Establecer la cuenta como'"
                  id="user-status"
                  :message="switchStatus"
                  :claseMessage="switchClass"
                  v-model="targetUser.info.status" 
                />
              </div>
            </div>

            <div class="d-flex justify-content-center mt-4">
              <button type="submit" class="btn" :class="addForm? 'btn-success':'btn-primary'" :disabled="!isUserAdmin">
                <i :class="addForm? 'fas fa-user-plus':'fas fa-edit'"></i>
                <span>{{ addForm? ' Agregar Usuario':' Editar Usuario' }}</span>
              </button>
            </div>
          </form>
      </template>
    </Modal>


    <!-- MODAL CONFIRM DELETE USER -->
    <ModalConfirm 
      id="deleteUserModal" 
      title="Delete user" 
      message="The selected user will be deleted from the database, this action is irreversible"
      confirm="Yes, delete user"
      reject="No, I made a mistake"
    />

    <!-- USER TABLE -->
    <Table
      ref="usersTable"
      :columns="columns"
      :rows="rows"
      id="usersTable"
      :serverSize="true"
      :totalRecords="totalRecords"
      :showOptions="false"
      :pageJumpOption="true"
      @onPageChange="onPageChange"
      @onPerPageChange="onPerPageChange"
    >
      <template v-slot:action="props">
        <button
            class="btn btn-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            @click="changeModal(false, props.rowItem.item.value)"
            :disabled="!isUserAdmin"
        >
            <i class="fas fa-edit"></i>
        </button>
        <button
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#deleteUserModal"
            @click="listenDeleteConfirm(props.rowItem.item.value)"
            :disabled="!isUserAdmin"
        >
            <i class="fas fa-trash"></i>
        </button>
      </template>
      <template v-slot:top-right-addon>
        <button
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#userModal"
          @click="changeModal(true)"
          :disabled="!isUserAdmin"
        >
          <i class="fas fa-plus-circle"></i>
          <span class="d-none d-md-inline"> Agregar Usuario</span>
        </button>
      </template>
    </Table>
  </div>
</template>


<script>
import Table from "@/components/commons/Table";
import Modal from "../../../components/commons/Modal.vue";
import ModalConfirm from "@/components/commons/ModalConfirm";
import Input from "../../../components/commons/Input.vue";
import Select from "../../../components/commons/Select.vue";
import SwitchBordered from '../../../components/commons/SwitchBordered.vue';
import UserService from "../../../services/UserService";
import { useUsersStore } from "@/stores/UsersVuex";
import dayjs from "dayjs";

export default {
  name: "users",
  data() {
    return {
      serverParams: {
        page: 1,
        perPage: 10,
      },
      totalRecords: 0,
      rows: [],
      columns: [
        {
          label: 'Nombre',
          field: "name",
          type: "text",
          class: "text-center"
        },
        {
          label: 'Email',
          field: "email",
          type: "text",
          class: "text-center"
        },
        {
          label: 'Estado',
          field: "status",
          type: "html",
          class: "text-center"
        },
        {
          label: 'Rol',
          field: "role",
          type: "text",
          class: "text-center"
        },
        {
          label: 'Sesiones',
          field: "sessions",
          type: "number",
          class: "text-center"
        },
        {
          label: 'Ultimo acceso',
          field: "lastAccess",
          type: "text",
          class: "text-center"
        },
        {
          label: 'Fecha Creacion',
          field: "createdAt",
          type: "text",
          class: "text-center"
        },
        {
          label: 'Acciones',
          field: 'action',
          class: "text-center"
        },
        {
          label: 'Item',
          field: 'item',
          type: 'object',
          hidden: true
        }
      ],
      addForm: true,
      targetUser: {
        info: {
          name: null,
          email: null,
          password: null,
          status: null
        },
        role: null
      },
      editId: null,
      roles: [],
      passwordRepeat: null,
      oldPassword: null
    };
  },
  components: {
    Table,
    Modal,
    ModalConfirm,
    Input,
    Select,
    SwitchBordered
  },
  computed: {
    userModalTitle: function(){
      return this.addForm? 'Agregar Usuario':'Editar Usuario';
    },
    switchStatus: function(){
      return this.targetUser.info.status? 'Active':'Inactive';
    },
    switchClass: function(){
      return this.targetUser.info.status? 'text-success':'text-danger';
    },
    newPassword: function(){
      return this.targetUser.info.password && this.targetUser.info.password != '';
    },
    isUserAdmin: function(){
      return useUsersStore().v_userdata?.role?.actions?.includes('USER_ADMIN') || useUsersStore().v_userdata?.role?.actions?.includes('ADMIN');
    }
  },
  async mounted() {
    this.retrieveUsers();
    this.retrieveRoles();
  },
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
      this.retrieveUsers();
    },

    /**
     * Esta función cambia el número de registros por página
     * @param {Object} params
     */
    onPerPageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.retrieveUsers();
    },
    /********************************************************************************/

    async retrieveUsers(){
      try{
        const response = await UserService.getUsers(this.serverParams);
        this.totalRecords = response.data.totalRecords;
        this.populateRows(response.data.data);
      }catch(err){
        console.log('Error');
      }
    },
    async retrieveRoles(){
      try{
        const response = await UserService.getAllRoles();
        this.roles = response.data.reverse();
      }catch(err){
        console.log(err);
        console.log('Error');
      }
    },
    populateRows(userdata){
      let newRowSet = [];
      for(const user of userdata){
        let insertEntry = {
          name: user.info.nombre_usuario,
          email: user.info.email,
          status: user.info.status? `<span class="text-success">Active</span>` : `<span class="text-danger">Not active</span>`,
          role: user.role.alias,
          sessions: user.token?.length,
          lastAccess: user.info.lastAccess? dayjs(new Date(user.info.lastAccess)).format('YYYY-MM-DD H:mm A') : 'Never accessed',
          createdAt: dayjs(new Date(user.createdAt)).format('YYYY-MM-DD H:mm A'),
          item: user
        }
        newRowSet.push(insertEntry);
      }
      this.rows = newRowSet;
    },
    changeModal(mode, user){
      this.addForm = mode;
      this.targetUser.info.password = null;
      this.passwordRepeat = null;
      this.oldPassword = null;
      this.targetUser.info.name = user? user.info.name : null;
      this.targetUser.info.email = user? user.info.email : null;
      this.targetUser.info.status = user? user.info.status : null;
      this.targetUser.role = user? user.role._id : this.roles[0]?._id;
      this.editId = user? user._id : null;
    },
    async executeAction(e){
      e.preventDefault();
      try{
        if(this.addForm){
          // Logic for adding user
          await UserService.createUserByAdmin(this.targetUser);
          this.retrieveUsers();
          this.$refs.userModal.closeModal();
        }else{
          // Logic for editting user
          let updateData = {
            data: this.targetUser
          }
          if(this.newPassword){
            updateData['oldpassword'] = this.oldPassword;
          }
          await UserService.updateUser(this.editId, updateData);
          this.retrieveUsers();
          this.$refs.userModal.closeModal();
        }
      }catch (err){
        console.log(err);
      }
    },
    checkValidity(e){
      if(this.targetUser.info.password && this.targetUser.info.password != '' && this.targetUser.info.password != this.passwordRepeat){
        document.getElementById('i-user-pw-r').setCustomValidity('The paswords do not match');
      }else{
        document.getElementById('i-user-pw-r').setCustomValidity('');
      }
    },
    setRole(e){
      this.targetUser.role = e.target.value;
    },
    listenDeleteConfirm(user){
      document.getElementById("deleteUserModal" + "confirmModalBtn").addEventListener('click', () =>{
        this.deleteUser(user._id);
      }, false);
    },
    async deleteUser(id){
      try{
        await UserService.deleteUser(id);
        this.retrieveUsers();
      }catch(err){
        console.log('Error');
      }
    }
  },
};
</script>
<style scoped>
  
</style>