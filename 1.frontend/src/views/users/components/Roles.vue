<template>
  <div>
    <!-- MODAL ADD ROLE -->
    <Modal
      ref="roleModal"
      id="roleModal"
      clase="modal-md"
      :title="'Agregar Rol'"
      :footer="false"
      :frameless="true"
    >
      <template v-slot:modalBody>
        <Input
          :label="'Nuevo Rol'" 
          id="new-role-alias"
          type="text"
          v-model="newAlias"
          icon="fas fa-id-card"
        ></Input>
        <button class="btn btn-success mt-4" @click="createRole" data-bs-dismiss="modal">
          <i class="fas fa-plus"></i>
          <span class="d-none d-md-inline"> Crear</span>
        </button>
      </template>
    </Modal>

    <!-- MODAL CONFIRM DELETE ROLE -->
    <ModalConfirm 
      id="deleteRoleModal" 
      title="Eliminar Rol" 
      message="El rol seleccionado sera eliminado de forma permanente de la base de datos ¿Quieres continuar?"
      confirm="Si, elimina el rol"
      reject="No, he cometido un error"
    />

    <div class="row p-2" v-if="roles && roles.length > 0">
      <!-- LIST GROUP -->
      <div class="col-12 col-md-2">
        <h5 class="text-primary">
          <span>Roles </span>
          <i 
            class="fas fa-plus-circle p-2 text-success cursor-pointer" 
            style="font-size: x-large;"
            title="Agregar nuevo rol" 
            :data-bs-toggle="isUserAdmin? 'modal':''"
            data-bs-target="#roleModal"
          ></i>
        </h5>
        <div class="list-group" id="myList" role="tablist">
          <a 
            v-for="(role, index) in roles" 
            v-bind:key="index" 
            class="list-group-item list-group-item-action"
            :class="index == 0? 'active' : ''"
            data-bs-toggle="list"
            :href="`#${role._id}`"
            role="tab"
            @click="selectRole(index)"
          >{{ role.alias }}</a>
        </div>
      </div>
      <!-- TABS -->
      <div class="col-12 col-md-10 pt-2">
        <h5 class="text-primary mt-4 mt-md-0 pb-1">Permisos</h5>
        <div class="tab-content">
          <div
            v-for="(role, index) in roles" 
            v-bind:key="index"
            class="tab-pane fade"
            :class="index == 0? 'show active' : ''"
            :id="role._id"
            role="tabpanel"
          >
            <div class="row">
              <div class="col-12 col-md-9">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" class="text-center">Sección</th>
                      <th scope="col" class="text-center">Vistas</th>
                      <th scope="col" class="text-center">Administración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(section, index2) in sections" v-bind:key="index2" class="align-middle">
                      <td scope="row" class="text-center">{{ section.name }}</td>
                      <td 
                        class="text-center text-white text-uppercase" 
                        v-if="section.binary"
                        :class="section.actions.see.keyword == '-'? 'bg-secondary':(role.actions.includes('ADMIN') || role.actions.includes(section.actions.see.keyword)? 'cursor-pointer bg-success':'cursor-pointer bg-danger')"
                        @click="grantDeny(section.actions.see.keyword, section.binary)"
                      >{{ section.actions.see.keyword == '-'? 'N/A' : role.actions.includes('ADMIN') || role.actions.includes(section.actions.see.keyword)? 'granted': 'denied' }}</td>
                      <td 
                        class="cursor-pointer text-center text-white text-uppercase"
                        :colspan="section.binary? '1':'2'"
                        :class="role.actions.includes('ADMIN') || role.actions.includes(section.actions.admin.keyword)? 'bg-success':'bg-danger'"
                        @click="grantDeny(section.actions.admin.keyword, section.binary)"
                      >{{ role.actions.includes('ADMIN') || role.actions.includes(section.actions.admin.keyword)? 'granted':'denied' }}</td>
                    </tr>
                  </tbody>
                </table>
                <!-- Botones de acciones -->
                <div class="row">
                  <div class="col-auto">
                    <button class="btn btn-success" @click="grantAllActions" :disabled="disabledFetures">
                      <i class="fas fa-circle-check"></i>
                      <span class="d-none d-md-inline"> Conceder todos</span>
                    </button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-danger" @click="denyAllActions" :disabled="disabledFetures">
                      <i class="fas fa-ban"></i>
                      <span class="d-none d-md-inline"> Denegar todos</span>
                    </button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-secondary" @click="resetRole" :disabled="disabledFetures">
                      <i class="fas fa-backward"></i>
                      <span class="d-none d-md-inline"> Restaurar</span>
                    </button>
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-primary" @click="saveActions" :disabled="disabledFetures">
                      <i class="fas fa-edit"></i>
                      <span class="d-none d-md-inline"> Guardar</span>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Informacion del rol -->
              <div class="col-12 col-md-3 mt-4 mt-md-0">
                <p>Creado: <span class="text-info">{{ createdAt }}</span></p>
                <p>Modificado: <span class="text-info">{{ lastModified }}</span></p>
                <Input
                    :label="'Editar nombre rol'" 
                    id="role-alias"
                    type="text"
                    v-model="selectedRole.alias"
                    icon="fas fa-id-card"
                    :disabled="disabledFetures"
                ></Input>
                <button 
                  class="btn btn-danger" 
                  data-bs-toggle="modal" 
                  data-bs-target="#deleteRoleModal"  
                  :disabled="disabledFetures"
                  @click="listenDeleteConfirm(selectedRole?._id)"
                >
                  <i class="fas fa-trash"></i>
                  <span> Eliminar rol</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../../../services/UserService";
import { useUsersStore } from "@/stores/UsersVuex";
import dayjs from "dayjs";
import Modal from "../../../components/commons/Modal.vue";
import ModalConfirm from "../../../components/commons/ModalConfirm.vue";
import Input from "../../../components/commons/Input.vue";

export default {
  name: "Roles",
  components: {
    Modal,
    ModalConfirm,
    Input
  },
  data() {
    return {
      roles: [],
      originalRoles: [],
      sections: [],
      selectedRole: { alias: null },
      selectedOriginal: null,
      keywords: [],
      newAlias: null
    };
  },
  computed: {
    createdAt: function(){
      return dayjs(new Date(this.selectedRole?.createdAt)).format('YYYY-MM-DD H:mm A');
    },
    lastModified: function(){
      return dayjs(new Date(this.selectedRole?.updatedAt)).format('YYYY-MM-DD H:mm A');
    },
    disabledFetures: function(){
      return this.selectedRole.alias == 'Super Admin' || !this.isUserAdmin;
    },
    isUserAdmin: function(){
      return useUsersStore().v_userdata?.role?.actions?.includes('USER_ADMIN') || useUsersStore().v_userdata?.role?.actions?.includes('ADMIN');
    }
  },
  watch: {},
  async mounted() {
    try{
      await this.retrieveRoles();
      await this.retrieveSections();
    }catch(err){
      console.log('Error');
    }
  },
  methods: {
    retrieveRoles(){
      return new Promise( async (resolve, reject) => {
        try{
          const RolesRequest = await UserService.getAllRoles();
          this.roles = RolesRequest.data.reverse();
          this.originalRoles = JSON.parse(JSON.stringify(this.roles));
          this.selectedRole = this.roles[0];
          this.selectedOriginal = this.originalRoles[0];
          resolve();
        }catch(err){
          reject(err)
        }
      });
    },
    retrieveSections(){
      return new Promise( async (resolve, reject) => {
        try{
          const SectionsRequest = await UserService.getSections();
          this.sections = SectionsRequest.data;
          for(const section of this.sections){
            let keywordsPush = section.binary && section.actions.see.keyword != '-'? [section.actions.see.keyword, section.actions.admin.keyword] : [section.actions.admin.keyword];
            this.keywords.push(...keywordsPush)
          }
          resolve();
        }catch(err){
          reject(err)
        }
      });
    },
    selectRole(index){
      this.selectedRole = this.roles[index];
      this.selectedOriginal = this.originalRoles[index];
    },
    grantDeny(action, binary){
      if(action == '-'){
        return;
      }
      if(this.isUserAdmin && this.selectedRole.actions.includes(action)){
        let removeIndex = this.selectedRole.actions.indexOf(action);
        this.selectedRole.actions.splice(removeIndex, 1);
        // If removed action was a SEE type action
        if(action.includes('_SEE')){
          // The associated ADMIN action must be removed
          let associatedAction = action.replace('_SEE','_ADMIN');
          let removeAdminIndex = this.selectedRole.actions.indexOf(associatedAction);
          if(removeAdminIndex != -1){
            this.selectedRole.actions.splice(removeAdminIndex, 1);
          }
        }
      }else if (this.isUserAdmin){
        if(action == 'USER_ADMIN'){
          this.selectedRole.actions = this.keywords;
        }else{
          this.selectedRole.actions.push(action);
          // If the pushed action was an ADMIN type action and the section is binary
          if(action.includes('_ADMIN') && binary){
            // The associated SEE action must be pushed
            let associatedAction = action.replace('_ADMIN', '_SEE');
            let pushSeeIndex = this.selectedRole.actions.indexOf(associatedAction);
            if(pushSeeIndex == -1 && this.keywords.includes(associatedAction)){
              this.selectedRole.actions.push(associatedAction);
            }
          }
        }
      }
    },
    grantAllActions(){
      this.selectedRole.actions = this.keywords;
    },
    denyAllActions(){
      this.selectedRole.actions = [];
    },
    async saveActions(){
      try{
        await UserService.updateRole(this.selectedRole);
      }catch(err){
        this.resetRole();
        console.log('Error');
      }
    },
    resetRole(){
      this.selectedRole.actions = JSON.parse(JSON.stringify(this.selectedOriginal.actions));
    },
    async createRole(){
      try{
        await UserService.createRole({ alias: this.newAlias });
        this.newAlias = null;
        await this.retrieveRoles();
        this.$emit('reftreshRoles');
      }catch(err){
        console.log('Error');
      }
    },
    listenDeleteConfirm(id){
      document.getElementById("deleteRoleModal" + "confirmModalBtn").addEventListener('click', () =>{
        this.deleteRole(id);
      }, false);
    },
    async deleteRole(id){
      try{
        await UserService.deleteRole(id);
        await this.retrieveRoles();
        this.$emit('reftreshRoles');
      }catch(err){
        console.log('Error');
      }
    }
  },
};
</script>

<style scoped>

</style>