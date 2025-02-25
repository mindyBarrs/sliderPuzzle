import { defineStore } from 'pinia'
import axios from 'axios'
import { API_RANDOM_URL, API_SEARCH_URL } from '@/utils/constants/url.constants'

interface Image {
  id: string
  alt_description: string
  urls: {
    small: string
  }
}

interface ImageStoreState {
  randomImage: Image | null
  loading: boolean
  error: string
  searchedImages: Image[]
}

export const useImageStore = defineStore('imageStore', {
  state: (): ImageStoreState => ({
    randomImage: null,
    loading: false,
    error: '',
    searchedImages: [],
  }),
  actions: {
    async getRandomImage() {
      this.loading = true
      this.error = ''

      try {
        const response = await axios.get(API_RANDOM_URL)
        this.randomImage = response.data
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
      this.error = ''

      try {
        const response = await axios.post(API_SEARCH_URL, { term })
        this.searchedImages = response.data.results
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.error = error.response?.data?.error
        } else if (error instanceof Error) {
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
