<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-if="sprints">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="addSprint">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar projeto..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <v-list >
          <v-list-tile v-for="(sprint, index) in pageSprints" :key="index" avatar>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="editSprint(sprint)" >
                <v-icon dark color="yellow lighten-3">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="removeSprint(sprint);">
                <v-icon dark color="red lighten-2">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="sprint.code" ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </v-flex>
    <v-dialog v-model="addOrEditSprint" max-width="1200">
      <modal @close="addOrEditSprint = false" ref="modal"></modal>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from 'axios'
import modal from './modal'
import { idFromUrl } from '@/utils/utils'

export default {
  name: 'sprint',
  components: { modal },
  data () {
    return {
      page: 1,
      addOrEditSprint: false
    }
  },
  methods: {
    addSprint () {
      Object.assign(this.$refs.modal.sprint, {
        tasks: [],
        impediments: [],
        id: null,
        code: '',
        start: '',
        end: '',
        responsible: '',
        project: ''
      })
      this.openModal()
    },
    editSprint (sprint) {
      const editSprint = Object.assign({}, sprint)
      if (sprint.responsible) {
        editSprint.responsible = this.$store.state.users.find(responsible => responsible.id === idFromUrl(sprint.responsible))
      }
      this.$refs.modal.sprint = editSprint
      this.$refs.modal.responsible = editSprint.responsible
      this.openModal()
    },
    removeSprint (um_sprint) {
      
      axios.delete(`sprint-list/${um_sprint.id_sprint}/`).then(response => this.$store.dispatch('GETSPRINTS'))
        .catch(error => console.log(error))
    },
    openModal () {
      this.addOrEditSprint = true
    }
  },
  computed: {
    pages () {
      return this.sprints.length > 10 ? Math.ceil(this.sprints.length / 10) : 0
    },
    pageSprints () {
      const firstIndex = (this.page - 1) * 10
      const lastIndex = (this.page) * 10
      return this.sprints.slice(firstIndex, lastIndex)
    },
    sprints () {
      const sprints = this.$store.state.sprints
      if (!sprints) return false
      return sprints
    }
  },
  created () {
    if (this.$store.state.sprints === null) {
      this.$store.dispatch('GETSPRINTS')
    }
  }
}
</script>

<style>

</style>
