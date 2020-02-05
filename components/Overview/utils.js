import {
  ASSETS_SERVER_BASE_URL,
  RENDER_FRONTEND_BASE_URL
} from '../../lib/constants'

export const renderWidth = 1200
export const getImgSrc = (teaser, path = '/', size = 200) =>
  `${ASSETS_SERVER_BASE_URL}/render?viewport=${renderWidth}x1&url=${encodeURIComponent(
    `${RENDER_FRONTEND_BASE_URL}${path}?extractId=${teaser.id}`
  )}&resize=${size}${
    teaser.contentHash
      ? `&permanentCacheKey=${encodeURIComponent(teaser.contentHash)}`
      : ''
  }`

export const getTeasersFromDocument = doc => {
  if (!doc) {
    return []
  }
  const children = doc.children
    ? doc.children.nodes.map(c => c.body)
    : doc.content.children

  return children.map(rootChild => {
    return {
      id: rootChild.data.id,
      contentHash: rootChild.data.contentHash,
      nodes:
        rootChild.identifier === 'TEASERGROUP'
          ? rootChild.children
          : [rootChild]
    }
  })
}
