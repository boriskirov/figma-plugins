import { traverseLayer } from '@create-figma-plugin/utilities'
import { deleteHiddenLayer } from '../../utilities/delete-hidden-layer'
import { makePixelPerfect } from '../../utilities/make-pixel-perfect'
import { smartRenameLayer } from '../../utilities/smart-rename-layer'
import { ungroupSingleLayerGroup } from '../../utilities/ungroup-single-layer-group'

export function cleanLayer (
  layer,
  {
    deleteHiddenLayers,
    pixelPerfect,
    smartRenameLayers,
    smartRenameLayersWhitelistRegex,
    ungroupSingleLayerGroups
  }
) {
  let didChange = false
  traverseLayer(layer, function (layer) {
    if (smartRenameLayers === true) {
      didChange =
        smartRenameLayer(layer, smartRenameLayersWhitelistRegex) || didChange
    }
  })
  traverseLayer(
    layer,
    function (layer) {
      if (deleteHiddenLayers === true) {
        didChange = deleteHiddenLayer(layer) || didChange
        if (layer.removed === true) {
          return
        }
      }
      if (ungroupSingleLayerGroups === true) {
        didChange = ungroupSingleLayerGroup(layer) || didChange
        if (layer.removed === true) {
          return
        }
      }
      if (pixelPerfect === true) {
        didChange = makePixelPerfect(layer) || didChange
      }
    },
    function (layer) {
      return layer.type !== 'INSTANCE'
    }
  )
  return didChange
}