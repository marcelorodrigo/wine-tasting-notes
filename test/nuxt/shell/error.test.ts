import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErrorPage from '~/error.vue'

interface FakeError {
  statusCode: number
  message: string
  name: string
  fatal: boolean
  unhandled: boolean
  toJSON: () => { statusCode: number; message: string }
}

function createError(overrides: { statusCode?: number; message?: string } = {}): FakeError {
  return {
    statusCode: 404,
    message: 'Not Found',
    name: 'Error',
    fatal: false,
    unhandled: false,
    toJSON() {
      return { statusCode: this.statusCode, message: this.message }
    },
    ...overrides,
  }
}

describe('error.vue', () => {
  it('renders the error title', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: { error: createError() },
    })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('displays the status code', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: { error: createError({ statusCode: 404 }) },
    })
    expect(wrapper.text()).toContain('404')
  })

  it('displays the error message', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: {
        error: createError({ statusCode: 500, message: 'Internal Server Error' }),
      },
    })
    expect(wrapper.text()).toContain('Internal Server Error')
  })

  it('renders back to home link', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: { error: createError() },
    })
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('Back to home')
  })

  it('renders start tasting link', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: { error: createError() },
    })
    const tastingLink = wrapper.find('a[href="/tasting"]')
    expect(tastingLink.exists()).toBe(true)
    expect(tastingLink.text()).toContain('Start Tasting')
  })
})
