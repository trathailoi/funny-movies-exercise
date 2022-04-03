import { render } from '@testing-library/vue'
import PageNotFound from './PageNotFound.vue'

test('mount component', async () => {
  expect(PageNotFound).toBeTruthy()

  const { container } = render(PageNotFound, {
    global: {
      stubs: {
        'n-layout': {
          template: '<div><slot></slot></div>'
        }
      }
    }
  })

  expect(container.textContent).toContain('Not found')
})
