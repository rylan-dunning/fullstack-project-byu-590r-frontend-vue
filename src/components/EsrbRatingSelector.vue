<template>
    <div class="esrb-rating-selector">
      <v-select
        v-model="selectedRatingId"
        :items="formattedRatings"
        label="ESRB Rating"
        item-title="text"
        item-value="value"
        @update:model-value="updateRating"
        return-object
      >
        <template v-slot:append-item>
          <div v-if="selectedRating" class="px-4 py-2 text-sm">
            <strong>{{ selectedRating.name }}:</strong> {{ selectedRating.description }}
          </div>
        </template>
      </v-select>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EsrbRatingSelector',
    props: {
      modelValue: {
        type: [Number, String],
        default: null
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        ratings: [],
        selectedRatingId: this.modelValue
      };
    },
    computed: {
      formattedRatings() {
        return this.ratings.map(rating => ({
          text: `${rating.code} - ${rating.name}`,
          value: rating.id,
          ...rating
        }));
      },
      selectedRating() {
        return this.ratings.find(rating => rating.id === this.selectedRatingId);
      }
    },
    methods: {
      async fetchRatings() {
        try {
          // Replace this with your actual API endpoint
          const response = await fetch('http://localhost:8000/api/esrb-ratings');
          const data = await response.json();
          if (data.success) {
            this.ratings = data.data;
          }
        } catch (error) {
          console.error('Error fetching ESRB ratings:', error);
        }
      },
      updateRating() {
        this.$emit('update:modelValue', this.selectedRatingId);
      }
    },
    mounted() {
      this.fetchRatings();
    },
    watch: {
      modelValue(newVal) {
        this.selectedRatingId = newVal;
      }
    }
  }
  </script>