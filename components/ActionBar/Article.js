import React, { Component, Fragment } from 'react'
import ActionBar from './'
import DiscussionIconLink from '../Discussion/IconLink'

import {
  colors
} from '@project-r/styleguide'

class ArticleActionBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      alive: false
    }
  }
  componentDidMount () {
    /* This Component is used within SSRCachingBoundary and can not
     * use context, live or personalised data until after componentDidMount
     */
    this.setState({ alive: true })
  }
  render () {
    const { alive } = this.state
    const { title, discussionId, discussionPage, discussionPath, documentId, dossierUrl, estimatedReadingMinutes, onAudioClick, onGalleryClick, onPdfClick, pdfUrl, showBookmark, t, url, userBookmark, inNativeApp } = this.props

    return (
      <Fragment>
        <ActionBar
          url={url}
          title={title}
          shareOverlayTitle={t('article/share/title')}
          fill={colors.text}
          dossierUrl={dossierUrl}
          onPdfClick={onPdfClick}
          pdfUrl={pdfUrl}
          emailSubject={t('article/share/emailSubject', {
            title
          })}
          onAudioClick={onAudioClick}
          inNativeApp={inNativeApp}
          onGalleryClick={onGalleryClick}
          showBookmark={alive && showBookmark}
          documentId={documentId}
          userBookmark={userBookmark}
          estimatedReadingMinutes={estimatedReadingMinutes}
        />
        {discussionId && alive &&
          <DiscussionIconLink
            discussionId={discussionId}
            discussionPage={discussionPage}
            path={discussionPath}
            style={{ marginLeft: 7 }} />
        }
      </Fragment>
    )
  }
}

export default ArticleActionBar
