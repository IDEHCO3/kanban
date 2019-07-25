<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-if="continuousActivity">
        <v-toolbar class="blue-grey darken-3" dark>
          <v-btn icon color="blue darken-2" @click="addOrEditContinuousActivity = true">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field label="Pesquisar atividade contínua..." class="blue--text mt-3" single-line  append-icon="search"></v-text-field>
        </v-toolbar>
        <v-list >
          <v-list-tile v-for="(activity, index) in pageContinuousActivity" :key="index" avatar>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="editContinuousActivity(activity)" >
                <v-icon dark color="yellow lighten-3">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn  purple lighten-4 icon @click.native="removeContinuousActivity(activity.id);">
                <v-icon dark color="red lighten-2">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="activity.name" ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-xs-center">
        <v-pagination v-model="page" :length="pages"></v-pagination>
      </div>
    </v-flex>
    <v-dialog v-model="addOrEditContinuousActivity" max-width="1200">
      <modal @close="addOrEditContinuousActivity = false" ref="modal"></modal>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from 'axios'
import modal from './modal'
export default {
  name: 'continuous-activity',
  components: { modal },
  data () {
    return {
      page: 1,
      addOrEditContinuousActivity: false
    }
  },
  methods: {
    editContinuousActivity (activity) {
      const editContinuousActivity = Object.assign({}, activity)
      this.$refs.modal.continuousActivity = editContinuousActivity
      this.addOrEditContinuousActivity = true
    },
    removeContinuousActivity (id) {
      axios.delete(`type-continuous-activity-list/${id}/`).then(response => this.$store.dispatch('GETCONTINUOUS'))
        .catch(error => console.log(error))
    }
  },
  computed: {
    pages () {
      return this.continuousActivity.length > 10 ? Math.ceil(this.continuousActivity.length / 10) : 0
    },
    pageContinuousActivity () {
      const firstIndex = (this.page - 1) * 10
      const lastIndex = (this.page) * 10
      return this.continuousActivity.slice(firstIndex, lastIndex)
    },
    continuousActivity () {
      const continuousActivity = this.$store.state.continuousActivity
      if (!continuousActivity) return false
      return continuousActivity
    }
  },
  created () {
    if (this.$store.state.continuousActivity === null) {
      this.$store.dispatch('GETCONTINUOUS')
    }
  }
}
</script>

<style>

</style>
