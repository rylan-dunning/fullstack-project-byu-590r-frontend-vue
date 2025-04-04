<template>
    <div class="video-games-container">
      <h1>Video Games</h1>
      
      <v-alert v-if="error" type="error" class="mb-4">
        {{ error }}
      </v-alert>
      
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="videoGames"
          :search="search"
          :loading="loading"
          loading-text="Loading video games..."
          class="elevation-1"
        >
          <template v-slot:item.image="{ item }">
            <v-avatar size="50">
              <v-img :src="getImageUrl(item)" alt="Game Cover" />
            </v-avatar>
          </template>
          
          <template v-slot:no-data>
            <div class="text-center">No video games found</div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </template>
  
  <script src="./VideoGamesView.ts"></script>
  
  <style scoped>
  .video-games-container {
    padding: 20px;
  }
  </style>