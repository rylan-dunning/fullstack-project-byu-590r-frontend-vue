// src/views/videoGames/VideoGamesView.ts

import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

export default defineComponent({
  name: 'VideoGamesView',
  data() {
    return {
      search: '',
      detailsDialog: false,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      selectedGame: null,
      validCreate: false,
      validEdit: false,
      newGame: {
        title: '',
        year: '',
        description: '',
        file: null
      },
      editedGame: null,
      gameToDelete: null,
      headers: [
        { title: 'Game Cover', key: 'image', align: 'center', sortable: false },
        { title: 'Title', key: 'title', align: 'start', sortable: true },
        { title: 'Description', key: 'description', align: 'start', sortable: false },
        { title: 'Year', key: 'year', align: 'center', sortable: true }
      ]
    };
  },
  computed: {
    ...mapState('videoGames', ['videoGames', 'loading', 'error']),
    filteredGames() {
      if (!this.search) return this.videoGames;
      const searchTerm = this.search.toLowerCase();
      return this.videoGames.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        (game.description && game.description.toLowerCase().includes(searchTerm)) ||
        (game.year && game.year.toString().includes(searchTerm))
      );
    }
  },
  methods: {
    ...mapActions('videoGames', [
      'getVideoGames', 
      'createVideoGame', 
      'updateVideoGame', 
      'deleteVideoGame'
    ]),
    
    getImageUrl(game) {
      if (game.file_url) {
        return game.file_url;
      }
      // Return a default image if none available
      return 'https://via.placeholder.com/200x300?text=No+Image';
    },
    
    showGameDetails(game) {
      this.selectedGame = game;
      this.detailsDialog = true;
    },
    
    // Create methods
    openCreateDialog() {
      this.newGame = {
        title: '',
        year: '',
        description: '',
        file: null
      };
      this.createDialog = true;
    },
    
    onFileChange(file) {
      this.newGame.file = file;
    },
    
    async createVideoGame() {
      if (!this.$refs.createForm.validate()) return;
      
      try {
        const formData = new FormData();
        formData.append('title', this.newGame.title);
        formData.append('year', this.newGame.year);
        formData.append('description', this.newGame.description);
        formData.append('file', this.newGame.file);
        
        await this.createVideoGame(formData);
        this.createDialog = false;
        this.getVideoGames(); // Refresh the list
      } catch (error) {
        console.error('Error creating video game:', error);
      }
    },
    
    // Edit methods
    openEditDialog(game) {
      this.editedGame = {
        id: game.id,
        title: game.title,
        year: game.year,
        description: game.description,
        file: null,
        file_url: game.file_url
      };
      this.editDialog = true;
    },
    
    onFileChangeEdit(file) {
      this.editedGame.file = file;
    },
    
    async updateGame() {
      if (!this.$refs.editForm.validate()) return;
      
      try {
        const formData = new FormData();
        formData.append('title', this.editedGame.title);
        formData.append('year', this.editedGame.year);
        formData.append('description', this.editedGame.description);
        
        if (this.editedGame.file) {
          formData.append('file', this.editedGame.file);
        }
        
        await this.updateVideoGame({
          id: this.editedGame.id,
          gameData: formData
        });
        
        this.editDialog = false;
        this.getVideoGames(); // Refresh the list
      } catch (error) {
        console.error('Error updating video game:', error);
      }
    },
    
    // Delete methods
    openDeleteDialog(game) {
      this.gameToDelete = game;
      this.deleteDialog = true;
    },
    
    async deleteGame() {
      if (!this.gameToDelete) return;
      
      try {
        await this.deleteVideoGame(this.gameToDelete.id);
        this.deleteDialog = false;
        this.getVideoGames(); // Refresh the list
      } catch (error) {
        console.error('Error deleting video game:', error);
      }
    }
  },
  created() {
    this.getVideoGames();
  }
});