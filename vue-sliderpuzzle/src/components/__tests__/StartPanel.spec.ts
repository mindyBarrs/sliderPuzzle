import { describe, it, expect, test } from 'vitest'

import StartPanel from '../StartPanel.vue'

import { customMount } from '../../utils/test.utils'

describe('<StartPanel />', () => {
  it('renders component properly', () => {
    const wrapper = customMount(StartPanel)

    expect(wrapper.text()).toContain('Create Puzzle with Random Image')
  })

  it('emits gameStart event on button click', async () => {
    const wrapper = customMount(StartPanel)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('gameStart')).toBeTruthy()
  })

  test('open SearchModal on button click', async () => {
    const wrapper = customMount(StartPanel)

    const button = wrapper.find({ ref: 'searchModalBtn' })
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(wrapper.text()).toContain('No images found')
  })
})
