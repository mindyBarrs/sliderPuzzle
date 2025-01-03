import { defineStore } from 'pinia'
import axios from 'axios'

import { API_RANDOM_URL, API_SEARCH_URL } from '@/utils/constants/url.constants'

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    image: null,
    loading: false,
    error: '',
    seachedImages: [],
  }),
  actions: {
    async getRandomImage() {
      this.loading = true

      try {
        const response = await axios.get(API_RANDOM_URL)
        this.image = response.data
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = String(error)
        }
      } finally {
        this.loading = false
      }
    },
    async searchImage(term: string) {
      this.loading = true

      try {
        const response = await axios.post(API_SEARCH_URL, { term })
        this.seachedImages = response.data
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = String(error)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
