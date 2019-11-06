import React from 'react'
import { compose } from 'react-apollo'
import Frame from '../components/Frame'
import Page from '../components/About/Page'
import withT from '../lib/withT'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const AboutPage = ({ t }) => {
  const meta = {
    title: t('pages/about/title'),
    description: t('pages/about/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/team/bern.jpg`,
    url: `${PUBLIC_BASE_URL}/about`
  }
  return (
    <Frame raw meta={meta}>
      <Page />
    </Frame>
  )
}

export default compose(withT)(AboutPage)
