<template>
    <div class="video-games-container">
        <h1 class="text-h4 mb-6">Video Games</h1>
        <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
        </v-alert>
        
        <!-- Add New Game Button -->
        <v-btn 
            color="primary" 
            class="mb-4" 
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
        >
            Add New Game
        </v-btn>
        
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
            </v-card-title>
            <!-- Grid View of Games -->
            <v-container fluid>
                <v-row>
                    <v-col v-for="game in filteredGames" :key="game.id" cols="12" sm="6" md="4" lg="3">
                        <v-card class="mx-auto game-card" height="100%" hover>
                            <v-img :src="getImageUrl(game)" height="300" width="200" object-fit="cover"
                                class="game-poster" @click="showGameDetails(game)"></v-img>
                            <v-card-title class="game-title text-center">
                                {{ game.title }}
                            </v-card-title>
                            <v-card-subtitle v-if="game.esrb_rating" class="text-center">
                                Rating: {{ game.esrb_rating.code }}
                            </v-card-subtitle>
                            <v-card-actions>
                                <!-- View Details Button -->
                                <v-btn icon @click="showGameDetails(game)" title="View Details">
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                                <!-- Edit Button -->
                                <v-btn icon @click="openEditDialog(game)" title="Edit Game">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <!-- Delete Button -->
                                <v-btn icon @click="openDeleteDialog(game)" title="Delete Game">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        
        <!-- Game Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="500">
            <v-card v-if="selectedGame">
                <v-img :src="getImageUrl(selectedGame)" height="400" width="266" object-fit="cover"
                    class="game-poster-dialog"></v-img>
                <v-card-title class="text-h5">
                    {{ selectedGame.title }}
                </v-card-title>
                <v-card-subtitle>
                    Release Year: {{ selectedGame.year }}
                    <div v-if="selectedGame.esrb_rating">
                        ESRB Rating: {{ selectedGame.esrb_rating.code }} - {{ selectedGame.esrb_rating.name }}
                    </div>
                </v-card-subtitle>
                <v-card-text>
                    <div class="text-body-1">{{ selectedGame.description }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="detailsDialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- Create Game Dialog -->
        <v-dialog v-model="createDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">Add New Game</v-card-title>
                <v-card-text>
                    <v-form ref="createForm" v-model="validCreate">
                        <v-text-field
                            v-model="newGame.title"
                            label="Title"
                            :rules="[v => !!v || 'Title is required']"
                            required
                        ></v-text-field>
                        
                        <v-text-field
                            v-model="newGame.year"
                            label="Release Year"
                            :rules="[
                                v => !!v || 'Year is required',
                                v => /^\d{4}$/.test(v) || 'Year must be 4 digits'
                            ]"
                            required
                        ></v-text-field>
                        
                        <!-- ESRB Rating Selector integration -->
                        <EsrbRatingSelector
                            v-model="newGame.esrb_rating_id"
                        ></EsrbRatingSelector>
                        
                        <v-textarea
                            v-model="newGame.description"
                            label="Description"
                            rows="3"
                        ></v-textarea>
                        
                        <v-file-input
                            v-model="newGame.file"
                            label="Game Cover Image"
                            accept="image/*"
                            :rules="[v => !!v || 'Cover image is required']"
                            required
                            @change="onFileChange"
                            prepend-icon="mdi-camera"
                        ></v-file-input>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="createDialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="submitNewGame" :disabled="!validCreate">
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- Edit Game Dialog -->
        <v-dialog v-model="editDialog" max-width="500">
            <v-card v-if="editedGame">
                <v-card-title class="text-h5">Edit Game</v-card-title>
                <v-card-text>
                    <v-form ref="editForm" v-model="validEdit">
                        <v-text-field
                            v-model="editedGame.title"
                            label="Title"
                            :rules="[v => !!v || 'Title is required']"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="editedGame.year"
                            label="Release Year"
                            :rules="[
                                v => !!v || 'Year is required',
                                v => /^\d{4}$/.test(v) || 'Year must be 4 digits'
                            ]"
                            required
                        ></v-text-field>

                        <!-- ESRB Rating Selector integration -->
                        <EsrbRatingSelector
                            v-model="editedGame.esrb_rating_id"
                        ></EsrbRatingSelector>

                        <v-textarea
                            v-model="editedGame.description"
                            label="Description"
                            rows="3"
                        ></v-textarea>

                        <v-file-input
                            label="Game Cover Image"
                            accept="image/*"
                            @change="onFileChangeEdit"
                            prepend-icon="mdi-camera"
                        ></v-file-input>

                        <div v-if="editedGame.file_url" class="mt-3">
                            <p>Current Image:</p>
                            <v-img :src="editedGame.file_url" max-height="150" contain></v-img>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="editDialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="updateGame" :disabled="!validEdit">
                        Update
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        
        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card v-if="gameToDelete">
                <v-card-title class="text-h5">Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete "{{ gameToDelete.title }}"? This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="error" text @click="deleteGame">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- Loading Overlay -->
        <v-overlay :value="loading" :opacity="0.8" z-index="9999">
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';
import EsrbRatingSelector from '@/components/EsrbRatingSelector.vue';
export default defineComponent({
    name: 'VideoGamesView',
    components: {
        EsrbRatingSelector
    },
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
                esrb_rating_id: null,
                file: null
            },
            editedGame: null,
            gameToDelete: null,
            esrbRatings: []
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
                (game.year && game.year.toString().includes(searchTerm)) ||
                (game.esrb_rating && game.esrb_rating.code.toLowerCase().includes(searchTerm)) ||
                (game.esrb_rating && game.esrb_rating.name.toLowerCase().includes(searchTerm))
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
        
        // Create game methods
        openCreateDialog() {
            this.newGame = {
                title: '',
                year: '',
                description: '',
                esrb_rating_id: null,
                file: null
            };
            this.createDialog = true;
        },
        
        onFileChange(event) {
            // Check if we have files in the event
            if (event && event.length > 0) {
                this.newGame.file = event[0]; // Vuetify returns an array of files
            } else if (event && event.target && event.target.files && event.target.files.length > 0) {
                // Fallback for regular DOM event
                this.newGame.file = event.target.files[0];
            } else {
                this.newGame.file = null;
            }
            console.log("File selected:", this.newGame.file);
        },
        
        async submitNewGame() {
            if (!this.$refs.createForm.validate()) return;
            
            try {
                const formData = new FormData();
                formData.append('title', this.newGame.title);
                formData.append('year', this.newGame.year);
                formData.append('description', this.newGame.description);
                
                // Add ESRB rating ID if selected
                if (this.newGame.esrb_rating_id) {
                    formData.append('esrb_rating_id', this.newGame.esrb_rating_id.id);
                }
                
                // Only append the file if it exists
                if (this.newGame.file) {
                    formData.append('file', this.newGame.file);
                }
                
                // Log what we're sending
                console.log("Submitting new game with file:", this.newGame.file);
                
                await this.createVideoGame(formData);
                this.createDialog = false;
            } catch (error) {
                console.error('Error creating video game:', error);
            }
        },
        
        // Edit game methods
        openEditDialog(game) {
            console.log('Opening edit dialog for game:', game);
            
            // Find the corresponding ESRB rating object from our list
            let rating = null;
            if (game.esrb_rating_id) {
                rating = this.esrbRatings.find(r => r.id === game.esrb_rating_id);
                console.log('Found ESRB rating for ID:', game.esrb_rating_id, rating);
            } else if (game.esrb_rating) {
                // If the game has a complete esrb_rating object nested
                rating = this.esrbRatings.find(r => r.id === game.esrb_rating.id);
                console.log('Found ESRB rating from nested object:', rating);
            }
            
            this.editedGame = {
                id: game.id,
                title: game.title,
                year: game.year,
                description: game.description,
                esrb_rating_id: rating || null,
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
                
                // Add ESRB rating ID if selected
                if (this.editedGame.esrb_rating_id) {
                    formData.append('esrb_rating_id', this.editedGame.esrb_rating_id.id);
                }
                
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
        
        // Delete game methods
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
        },
        
        // ESRB ratings
        async fetchEsrbRatings() {
            try {
                // The URL already includes '/api' in the baseURL, so we don't need to include it again
                const response = await this.$store.state.axios.get('/esrb-ratings');
                console.log('ESRB ratings response:', response.data);
                
                if (response.data.success) {
                    this.esrbRatings = response.data.data;
                    console.log('ESRB ratings loaded:', this.esrbRatings);
                } else {
                    console.error('Error loading ESRB ratings:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching ESRB ratings:', error);
            }
        }
    },
    created() {
        this.getVideoGames();
        this.fetchEsrbRatings();
    }
});
</script>

<style scoped>
.video-games-container {
    padding: 20px;
}

.game-card {
    transition: transform 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.game-poster {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.game-card:hover .game-poster {
    transform: scale(1.05);
}

.game-poster-dialog {
    border-radius: 12px;
    margin: 0 auto;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.game-title {
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.2;
    padding: 8px 12px;
    text-align: center;
}
</style>


