// src/views/videoGames/VideoGamesView.ts

import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  name: 'VideoGamesView',
  data() {
    return {
      headers: [
        { title: 'Game Cover', key: 'image', align: 'center', sortable: false },
        { title: 'Title', key: 'title', align: 'start', sortable: true },
        { title: 'Description', key: 'description', align: 'start', sortable: false },
        { title: 'Year', key: 'year', align: 'center', sortable: true }
      ],
    };
  },
  computed: {
    ...mapState('videoGames', ['videoGames', 'loading', 'error'])
  },
  methods: {
    ...mapActions('videoGames', ['getVideoGames']),
    
    getImageUrl(game) {
      if (game.file_url) {
        return game.file_url;
      }
      // Return a default image if none available
      return 'https://via.placeholder.com/50?text=No+Image';
    }
  },
  created() {
    this.getVideoGames();
  }
});