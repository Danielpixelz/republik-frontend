import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { nest } from 'd3-collection'
import { timeFormat } from '../../lib/utils/format'
import Link from '../Link/Href'
import withT from '../../lib/withT'
import ActionBar from '../ActionBar/Feed'
import StickySection from './StickySection'
import PropTypes from 'prop-types'
import formatCredits from './formatCredits'

import {
  TeaserFeed
} from '@project-r/styleguide'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(d => dateFormat(new Date(d.meta.publishDate)))

class Feed extends Component {
  renderFeedItem = doc =>
    <TeaserFeed
      {...doc.meta}
      credits={this.props.showHeader ? formatCredits(doc.meta.credits) : doc.meta.credits}
      publishDate={undefined}
      kind={
        doc.meta.template === 'editorialNewsletter' ? (
          'meta'
        ) : (
          doc.meta.kind
        )
      }
      Link={Link}
      key={doc.meta.path}
      bar={<ActionBar
        documentId={doc.id}
        userBookmark={doc.userBookmark}
        {...doc.meta}
        meta={doc.meta} />}
    />

  render () {
    const { documents, showHeader } = this.props

    if (showHeader) {
      return groupByDate.entries(documents).map(({ key, values }, i, all) =>
        <StickySection
          key={i}
          hasSpaceAfter={i < all.length - 1}
          label={key}
        >
          {
            values.map(this.renderFeedItem)
          }
        </StickySection>
      )
    } else {
      return documents.map(this.renderFeedItem)
    }
  }
}

Feed.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      publishDate: PropTypes.string.isRequired
    }),
    showHeader: PropTypes.bool
  }).isRequired).isRequired
}

Feed.defaultProps = {
  showHeader: true,
  documents: []
}

export default compose(
  withT
)(Feed)
