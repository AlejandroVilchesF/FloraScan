<template>
  <div class="w-100">
    <div class="row p-2">
      <div class="col">
        <!-- START -->
        <ul class="nav nav-tabs ms-2 border-bottom-0">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="users-tab"
              data-bs-toggle="tab"
              href="#users"
              role="tab"
              aria-controls="users"
              aria-selected="true"
              >Usuarios
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="roles-tab"
              data-bs-toggle="tab"
              href="#roles"
              role="tab"
              aria-controls="roles"
              aria-selected="false"
              >Roles
            </a>
          </li>
        </ul>
        <!-- END -->
        <div class="card">
          <!-- TABS -->
          <div class="row p-2 mt-3">
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="users"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <Users ref="userlist" />
              </div>    
              <div
                class="tab-pane fade"
                id="roles"
                role="tabpanel"
                aria-labelledby="activity-tab"
              >
                <Roles ref="roles" @reftreshRoles="reftreshRoles"/>
              </div>
            </div>
          </div>
          <!-- TABS -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Users from "./components/Users";
import Roles from "./components/Roles";


export default {
  data() {
    return {};
  },
  components: {
    Users,
    Roles
  },
  methods: {
    reftreshRoles(){
      this.$refs.userlist.retrieveRoles();
    }
  },
  mounted() {},
};
</script>