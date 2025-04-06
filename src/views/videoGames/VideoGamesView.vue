<template>
    <div class="video-games-container">
        <h1 class="text-h4 mb-6">Video Games</h1>
        <v-alert v-if="error" type="error" class="mb-4">
            {{ error }}
        </v-alert>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>
            </v-card-title>
            <!-- Grid View of Games -->
            <v-container fluid>
                <v-row>
                    <v-col v-for="game in filteredGames" :key="game.id" cols="12" sm="6" md="4" lg="3">
                        <v-card class="mx-auto game-card" height="100%" @click="showGameDetails(game)" hover>
                            <v-img :src="getImageUrl(game)" height="300" width="200" object-fit="cover"
                                class="game-poster"></v-img>
                            <v-card-title class="game-title text-center">
                                {{ game.title }}
                            </v-card-title>
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
            selectedGame: null
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
        ...mapActions('videoGames', ['getVideoGames']),
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