<template>
  <v-flex xs6 sm4 md3>
    <v-card :class="tabColor">
      <v-card-text class="text-xs-center black--text" >{{name}}
        <v-btn icon color="blue darken-2" class="add-button" v-if='add' @click.native="addTask">
          <v-icon color="white">add</v-icon>
        </v-btn>
      </v-card-text>
      <v-layout row wrap style="display:block;" v-if="cardTasks">
        <draggable v-model="cardTasks" :options="{ group:'task' }" @add="onAdd" :move="onMove" @end="onEnd">
          <transition-group tag="div" class="dragArea">
            <div v-for="(task, index) in cardTasks" :key="index">
              <v-flex xs12 class="mb-1" >

                <v-card class="secondary ma-1 dark" v-if="name !== 'Pendente' && name !== 'Feito' && task.due < currentDate">
                  <v-card-title>
                    <span style="width: 100%; text-align:left;">{{task.name}}</span><br>
                    <span style="width: 100%; text-align:left; color:red; font-weight: 800;">Inicio: {{task.started}} Fim: {{ task.due || 'Não informado'}}</span>
                    <span style="width: 100%; text-align:left;" v-if="task.responsible">Responsável: {{ responsible(task.responsible) }}</span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon  @click="editTask(task)">
                      <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon  @click="removeTask(task)">
                      <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <v-card class="secondary ma-1 dark" v-if="name === 'Pendente'">
                  <v-card-title>
                    <span style="width: 100%; text-align:left;">{{task.name}}</span><br>
                    <span style="width: 100%; text-align:left; color:red; font-weight: 800;">Inicio: {{task.started}} Fim: {{ task.due || 'Não informado'}}</span>
                    <span style="width: 100%; text-align:left;" v-if="task.responsible">Responsável: {{ responsible(task.responsible) }}</span>
                    <div style="width: 100%; text-align:center;">
                      <v-btn class="blue-grey lighten-5 black--text" style="font-weight:600;" @click="$emit('showImpediments', task)"
                      :disabled="task.impediments.length > 0 ? false : true">Impedimentos</v-btn>
                      <v-btn icon color="blue darken-2" @click.native="$emit('addImpediment', task.id)">
                        <v-icon color="white">add</v-icon>
                      </v-btn>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon  @click="editTask(task)">
                      <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon  @click="removeTask(task)">
                      <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <v-card class="secondary ma-1 dark" v-if="(task.due >= currentDate || name === 'Feito') && name !== 'Pendente'">
                  <v-card-title>
                    <span style="width: 100%; text-align:left; ">{{ task.name }}</span><br>
                    <span style="width: 100%; text-align:left;">Inicio: {{task.started}} Fim: {{ task.due || 'Não informado'}}</span>
                    <span style="width: 100%; text-align:left;" v-if="task.responsible">Responsável: {{ responsible(task.responsible) }}</span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn icon  @click="editTask(task)">
                      <v-icon dark color="yellow lighten-3">edit</v-icon>
                    </v-btn>
                    <v-btn icon  @click="removeTask(task)">
                      <v-icon dark color="red lighten-2">delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>

              </v-flex>
            </div>
          </transition-group>
        </draggable>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import { idFromUrl } from '@/utils/utils'
import { mapGetters } from 'vuex'
import axios from 'axios'
import draggable from 'vuedraggable'

export default {
  props: ['add', 'tabColor', 'name', 'filterProject', 'filterUser', 'cardColor', 'status', 'currentDate'],
  components: { draggable },
  data () {
    return {
      cardTasks: []
    }
  },
  methods: {
    addTask () {
      this.$emit('addTask')
    },
    editTask (task) {
      this.$emit('editTask', task)
    },
    removeTask (task) {
      axios.delete(`task-list/${task.id}/`)
        .then(res => {
          this.$store.dispatch('GETTASKS')
          const taskIndex = this.cardTasks.indexOf(task)
          this.cardTasks.splice(taskIndex, 1)
        })
        .catch(error => console.log(error))
    },
    filterCardsByProject () {
      axios.get(`task-list/filter/project/eq/${this.filterProject.id}/`)
        .then(res => { this.cardTasks = this.filterCardStatus(res.data) })
        .catch(error => console.log(error))
    },
    filterCardsDefault () {
      this.cardTasks = this.filterCardStatus(this.$store.state.tasks)
        .filter(task => task.responsible ? idFromUrl(task.responsible) === this.$store.state.auth.id : false)
    },
    filterCardsByUser () {
      axios.get(`task-list/filter/responsible/eq/${this.filterUser.id}/`).then(res => {
        this.cardTasks = this.filterCardStatus(res.data)
      }).catch(error => console.log(error))
    },
    filterCardStatus (tasks) {
      const filteredTasks = tasks.filter(task => (parseInt(task.status) === parseInt(this.status)))
      return filteredTasks.sort((a, b) => a.started < b.started ? 1 : -1)
    },
    onMove (event, dragEvent) {
      if (event.draggedContext.element != null) {
        this.$store.commit('movedTask', event.draggedContext.element)
      }
    },
    onEnd (event) {
      this.$store.commit('clearMovedTask')
    },
    onAdd (event) {
      const movedTask = this.$store.state.movedTask
      movedTask.status = this.status.toString()
      if (movedTask.status === '3') {
        const impediment = {
          name: `Impedimento | ${this.currentDate}`,
          created_date: this.currentDate,
          task: `${axios.defaults.baseURL}task-list/${movedTask.id}/`
        }
        axios.post('impediment-list/', impediment)
      }
      axios.put(`task-list/${movedTask.id}/`, movedTask).then(res => {
        this.$store.dispatch('GETTASKS')
      }).catch(error => console.log(error))
    },
    responsible (url) {
      const idresponsible = idFromUrl(url)
      const responsible = this.$store.state.users.find(user => user.id === idresponsible)
      return responsible ? responsible.name : 'Não informado'
    }
  },
  computed: {
    ...mapGetters({
      getTasks: 'getTasks'
    })
  },
  watch: {
    getTasks () {
      this.filterProject
        ? this.filterCardsByProject()
        : this.filterUser
          ? this.filterCardsByUser()
          : this.filterCardsDefault()
    },
    filterProject () {
      if (this.filterProject) {
        this.filterCardsByProject()
      }
    },
    filterUser () {
      if (this.filterUser) {
        this.filterCardsByUser()
      }
    }
  },
  created () {
    this.filterCardsDefault()
  }
}
</script>

<style scoped>
.add-button {
  margin-top: -1%;
  margin-right: 10px;
  position: relative;
}
.filter-button {
  z-index: 3;
  display: inline-flex !important;
  float: left;
  margin-top: -5%;
  position: absolute;
}
.project-button {
  width: 190px !important;
  justify-content: left !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dragArea {
  padding: 2px;
  min-height: 20px;
}
.icon:before {
  font-family: sans-serif;
}
.sortable-ghost {
    animation-name: my-ghost;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
@keyframes my-ghost {
  from {
    transform: scale(0.96);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
