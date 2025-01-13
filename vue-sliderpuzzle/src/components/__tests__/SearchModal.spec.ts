import { describe, it, expect, test } from 'vitest'

import SearchModal from '@/components/Search/SearchModal.vue'

import { customMount } from '@/utils/test.utils'

describe('<SearchModal />', () => {
  it('should render component properly', () => {
    const wrapper = customMount(SearchModal, { props: { isOpen: true } })

    expect(wrapper.text()).toContain('Search for an image')
  })

  test('clicking the close button emits close event', async () => {
    const wrapper = customMount(SearchModal, { props: { isOpen: true } })

    const button = wrapper.find({ ref: 'closeModalBtn' })
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(wrapper.emitted('modal-close')).toBeTruthy()
  })
})
