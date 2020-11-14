import { emit, once } from '@create-figma-plugin/utilities'

import { translateAsync } from '../utilities/translate-async'

export default function () {
  once('TRANSLATE_REQUEST', async function ({ languageKey, layers, scope }) {
    const promises = layers.map(function ({ characters }) {
      return translateAsync(characters, languageKey)
    })
    const translated = await Promise.all(promises)
    emit('TRANSLATE_RESULT', {
      languageKey,
      layers: layers.map(function ({ id }, index) {
        return {
          characters: translated[index],
          id
        }
      }),
      scope
    })
  })
}
