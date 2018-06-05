<template>
  <v-layout row wrap xs12 v-if="$store.state.tasks">
    <v-menu offset-y class="btn-filteruser" :close-on-content-click="false">
      <v-btn dark slot="activator" style="width: 230px" @click.native="filterProject = ''">Filtrar por Usuário</v-btn>
      <v-select
        class="blue-grey darken-4 mr-1"
        :items="$store.state.users"
        item-text="name"
        v-model="filterUser"
        label="Usuário"
        autocomplete
      ></v-select>
    </v-menu>
    <v-menu offset-y class="btn-filterproject" :close-on-content-click="false">
      <v-btn dark slot="activator" style="width: 230px" @click.native="filterUser = ''">Filtrar por Projeto</v-btn>
      <v-select
        class="blue-grey darken-4"
        :items="$store.state.projects"
        item-text="name"
        v-model="filterProject"
        label="Projeto"
        autocomplete
      ></v-select>
    </v-menu>
    <task-card
      tabColor="yellow darken-2"
      name="A fazer"
      :add="true"
      @addTask="editTask"
      @editTask="editTask"
      :filterProject="filterProject"
      :filterUser="filterUser"
      cardColor="yellow lighten-2"
      :currentDate="currentDate"
      :status="1">
    </task-card>

    <task-card
      tabColor="blue"
      name="Fazendo"
      @editTask="editTask"
      :filterProject="filterProject"
      :filterUser="filterUser"
      cardColor="blue lighten-2"
      :currentDate="currentDate"
      :status="2">
    </task-card>

    <task-card
      tabColor="green"
      name="Feito"
      @editTask="editTask"
      :filterProject="filterProject"
      :filterUser="filterUser"
      cardColor="green lighten-2"
      :currentDate="currentDate"
      :status="4">
    </task-card>

    <task-card
      tabColor="red"
      name="Pendente"
      @editTask="editTask"
      @addImpediment="addImpediment"
      @showImpediments="showImpediments"
      :filterProject="filterProject"
      :filterUser="filterUser"
      cardColor="red lighten-2"
      :currentDate="currentDate"
      :status="3">
    </task-card>

    <v-dialog v-model="addOrEditTask" max-width="1200">
      <modal @close="closeModal" ref="modal"></modal>
    </v-dialog>

    <v-dialog v-model="impedimentsModal" max-width="1200">
      <impediments-modal @close="impedimentsModal = false" ref="impedimentsModal" :currentDate="currentDate"></impediments-modal>
    </v-dialog>

    <v-dialog v-model="addImpedimentModal" max-width="1200">
      <add-impediment-modal @close="addImpedimentModal = false" ref="addImpedimentModal"></add-impediment-modal>
    </v-dialog>

  </v-layout>
</template>

<script>
import { idFromUrl } from '@/utils/utils'
import axios from 'axios'
import taskCard from './task-card'
import addImpedimentModal from './add-impediment-modal'
import impedimentsModal from './impediments-modal'
import modal from './modal'

export default {
  name: 'task',
  components: { addImpedimentModal, impedimentsModal, modal, taskCard },
  data () {
    return {
      addOrEditTask: false,
      addImpedimentModal: false,
      impedimentsModal: false,
      currentDate: '',
      filterUser: '',
      filterProject: ''
    }
  },
  methods: {
    editTask (task) {
      const editTask = Object.assign({}, task)
      if (task) {
        if (task.project) {
          editTask.project = this.$store.state.projects.find(project => project.id === idFromUrl(task.project))
        }
        if (task.sprint) {
          editTask.sprint = this.$store.state.sprints.find(sprint => sprint.id === idFromUrl(task.sprint))
        }
        if (task.typeContinuousActivity) {
          editTask.typeContinuousActivity = this.$store.state.continuousActivity.find(typeContinuousActivity => typeContinuousActivity.id === idFromUrl(task.typeContinuousActivity))
        }
        if (task.responsible) {
          editTask.responsible = this.$store.state.users.find(responsible => responsible.id === idFromUrl(task.responsible))
          this.$refs.modal.task = editTask
        }
      } else {
        this.$refs.modal.task.responsible = this.$store.state.users.find(responsible => responsible.id === this.$store.state.auth.id)
        this.$refs.modal.task.status = { name: 'A Fazer', number: '1' }
      }
      this.addOrEditTask = true
    },
    closeModal () {
      this.$refs.modal.task = {
        impediments: [],
        id: null,
        name: '',
        description: null,
        status: '',
        order: null,
        started: null,
        due: null,
        completed: null,
        sprint: null,
        responsible: null,
        typeContinuousActivity: null,
        project: null
      }
      this.addOrEditTask = false
    },
    addImpediment (taskId) {
      const task = `${axios.defaults.baseURL}task-list/${taskId}/`
      this.$refs.addImpedimentModal.impediment.task = task
      this.addImpedimentModal = true
    },
    showImpediments (task) {
      this.$refs.impedimentsModal.task = task
      axios.get(`impediment-list/filter/task/eq/${task.id}`).then(res => {
        this.$refs.impedimentsModal.impediments = res.data
        const solved = res.data.every(impediment => impediment.resolution_date <= this.currentDate)
        if (solved) {
          axios.put(`task-list/${task.id}/`, {status: '2', responsible: task.responsible, project: task.project, sprint: task.sprint})
          this.$store.dispatch('GETTASKS')
        }
        this.impedimentsModal = true
      }).catch(error => console.log(error))
    }
  },
  created () {
    this.currentDate = new Date().toLocaleDateString().split('/').reverse().join('-')
    if (this.$store.state.tasks === null) {
      this.$store.dispatch('GETTASKS')
    }
    if (this.$store.state.projects === null) {
      this.$store.dispatch('GETPROJECTS')
    }
    if (this.$store.state.impediments === null) {
      this.$store.dispatch('GETIMPEDIMENTS')
    }
    if (this.$store.state.continuousActivity === null) {
      this.$store.dispatch('GETCONTINUOUS')
    }
    if (this.$store.state.sprints === null) {
      this.$store.dispatch('GETSPRINTS')
    }
  }
}
</script>

<style scoped>
.btn-filteruser {
  position: absolute !important;
  top: 5px !important;
  left: 36%;
  z-index: 11 !important;
}
.btn-filterproject {
  position: absolute !important;
  top: 5px !important;
  left: 50%;
  z-index: 11 !important;
}
</style>
