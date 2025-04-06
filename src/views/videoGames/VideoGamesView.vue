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
                    <v-btn color="primary" text @click="createVideoGame" :disabled="!validCreate">
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
                        
                        <v-textarea
                            v-model="editedGame.description"
                            label="Description"
                            rows="3"
                        ></v-textarea>
                        
                        <v-file-input
                            v-model="editedGame.file"
                            label="Game Cover Image (Optional)"
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
            gameToDelete: null
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
        
        // Create game methods
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
        
        // Edit game methods
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
        }
    },
    created() {
        this.getVideoGames();
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