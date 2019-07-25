<template>
  <v-card >
    <v-card-title class="green white--text" style="font-size: 20px; padding: 10px;">
      {{ task.id === null ? 'Nova Tarefa' : 'Editar Tarefa' }}
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>

          <v-flex xs12>
            <v-text-field label="Nome da tarefa" required v-model="task.name"></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-select label="Responsável" autocomplete v-model="task.responsible" :items="users" item-text="name" @select="selectedResponsible"></v-select>
          </v-flex>

          <v-flex xs12>
            <v-text-field label="Descrição da tarefa" hint="Informações para descrever a tarefa"  v-model="task.description"></v-text-field>
          </v-flex>

          <v-flex xs12 sm5 offset-sm1>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_start"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data inicio" v-model="task.started" prepend-icon="event" readonly></v-text-field>
              <v-date-picker  v-model="task.started" no-title scrollable actions>
              </v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 sm5>
            <v-menu lazy  :close-on-content-click="true"  v-model="menu_end"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
              <v-text-field slot="activator" label="Data de entrega" v-model="task.due" prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="task.due" no-title scrollable actions>
              </v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12>
            <v-select label="Status" v-model="task.status" :items="status" item-text="name" item-value="number" required></v-select>
          </v-flex>

          <v-flex xs12 sm6>
            <v-select label="Projeto" autocomplete v-model="task.project" :items="projects" item-text="name" @select="selectedProject"></v-select>
          </v-flex>

          <v-flex xs12 sm6>
            <v-select label="Sprint" autocomplete v-model="task.sprint" :items="sprints" item-text="code" @select="selectedSprint"></v-select>
          </v-flex>

          <v-flex xs12 sm12>
            <v-select label="Atividade Contínua" autocomplete v-model="task.typeContinuousActivity" :items="continuousActivity" item-text="name" @select="selectedTypeContinousActivity"></v-select>
          </v-flex>

        </v-layout>
      </v-container>
      <small>*Campos requeridos</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn round  class="blue" @click="createOrEditTask">
        Confirmar
      </v-btn>
      <v-btn round  class="red lighten-2" @click="cancel">
        Cancelar
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'task-modal',
  data () {
    return {
      task: {
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
      },
      temp: {
        responsible: '',
        typeContinuousActivity: '',
        project: '',
        sprint: ''
      },
      menu_start: false,
      menu_end: false,
      status: [{ name: 'A Fazer', number: '1' }, { name: 'Fazendo', number: '2' }, { name: 'Feito', number: '4' }, { name: 'Pendente', number: '3' }]
    }
  },
  methods: {
    createImpediment () {
      const impediment = {
        name: '',
        description: '',
        created_date: '',
        resolution_date: null,
        sprint: null,
        task: null
      }
      axios.post('impediment-list/', impediment).then(res => {
        this.$store.dispatch('GETTASKS')
        this.$emit('close')
      }).catch(error => console.log(error))
    },
    async createOrEditTask () {
      this.urlTemps()

      if (this.task.id) {
        await axios.put(`task-list/${this.task.id}/`, this.task)
        this.$store.dispatch('GETTASKS')
        this.$emit('close')
      } else {
        await axios.post('task-list/', this.task)
        this.$store.dispatch('GETTASKS')
        this.$emit('close')
      }
    },
    cancel () {
      this.$emit('close')
    },
    selectedResponsible () {
      if (this.task.responsible) {
        this.temp.responsible = `${axios.defaults.baseURL}user-list/${this.task.responsible.id}/`
      }
      return this.temp.responsible
    },
    selectedProject () {
      console.log("entrei no projeto")
      console.log(this.task.project)
      if (this.task.project) {
        this.temp.project = `${axios.defaults.baseURL}project-list/${this.task.project.id}/`
      }
      return this.temp.project
    },
    selectedSprint () {
      console.log("entrei no sprint")
      console.log(this.task.sprint)
      if (this.task.sprint) {
        this.temp.sprint = `${axios.defaults.baseURL}sprint-list/${this.task.sprint.id_sprint}/`
      }
      return this.temp.sprint
    },
    selectedTypeContinousActivity () {
      if (this.task.typeContinuousActivity) {
        this.temp.typeContinuousActivity = `${axios.defaults.baseURL}type-continuous-activity-list/${this.task.typeContinuousActivity.id}/`
      }
      return this.temp.typeContinuousActivity
    },
    urlTemps () {
      this.task.responsible = this.selectedResponsible()
      this.task.typeContinuousActivity = this.selectedTypeContinousActivity()
      this.task.project = this.selectedProject()
      this.task.sprint = this.selectedSprint()
    }
  },
  computed: {
    ...mapGetters({
      users: 'getUsers',
      projects: 'getProjects',
      sprints: 'getSprints',
      continuousActivity: 'getContinuousActivity'
    })
  }
}
</script>

<style>

</style>
