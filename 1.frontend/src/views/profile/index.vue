<template>
  <div class="row w-100 mb-4 gx-2 g-sm-3 mt-2">
    <div class="col-md-12 col-lg-4 col-xl-3">
      <Info />
    </div>

    <div class="col-md-12 col-lg-8 col-xl-9">
      <!-- TABS -->
      <ul class="nav nav-tabs ms-2 border-bottom-0">
        <li class="nav-item">
          <a
            class="nav-link active"
            id="profile-tab"
            data-bs-toggle="tab"
            href="#profile"
            role="tab"
            aria-controls="profile"
            aria-selected="true"
            >{{ 'Administrar' }}
          </a>
        </li>
      </ul>
      <!-- TABS -->
      <div class="card">
        <div class="card-body h-100">
          <div class="d-flex align-items-start">
            <div class="flex-grow-1">
              <!-- TABS CONTENT -->
              <div
                class="tab-content"
                id="myTabContent"
                style="padding: 4vh 1vw 1vh 1vw"
              >
                <div
                  class="tab-pane fade show active"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <EditProfile />
                </div>
              </div>
              <!-- TABS CONTENT -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Info from "./components/Info";
import EditProfile from "./components/EditProfile.vue";
import { useUsersStore } from '@/stores/UsersVuex'; 
import { useCommonStore } from '@/stores/CommonVuex'; 

export default {
  data() {
    return {
      user: {},
    };
  },
  components: {
    Info,
    EditProfile
  },
  computed: {},
  methods: {},
  async mounted() {
    if (!useUsersStore().getData) {
      await useUsersStore().v_getselfdata();
    }
  },
};
</script>

<style scoped>
</style>