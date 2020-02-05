import React from 'react'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Center, Interaction } from '@project-r/styleguide'

import withT from '../../lib/withT'
import { parseJSONObject } from '../../lib/safeJSON'

import Box from '../Frame/Box'
import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'
import { WithoutMembership, WithActiveMembership } from '../Auth/withMembership'

import DocumentListContainer from '../Feed/DocumentListContainer'

const getFeedDocuments = gql`
  query getSectionDocuments(
    $cursor: String
    $filter: SearchFilterInput
    $filters: [SearchGenericFilterInput!]
  ) {
    documents: search(
      filters: $filters
      filter: $filter
      sort: { key: publishedAt, direction: DESC }
      first: 30
      after: $cursor
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        entity {
          ... on Document {
            id
            ...BookmarkOnDocument
            meta {
              credits
              title
              description
              publishDate
              path
              format {
                id
                meta {
                  kind
                  color
                  title
                  path
                }
              }
              estimatedReadingMinutes
              estimatedConsumptionMinutes
              indicateChart
              indicateGallery
              indicateVideo
              audioSource {
                mp3
              }
            }
          }
        }
      }
    }
  }
  ${bookmarkOnDocumentFragment}
`

const mapNodes = node => node.entity

const SectionFeed = ({ t, formats, variablesAsString }) => {
  if (!variablesAsString && !(formats && formats.length)) {
    return null
  }

  const help = (
    <WithoutMembership
      render={() => (
        <Box style={{ marginBottom: 30, padding: '15px 20px' }}>
          <Interaction.P>{t('section/feed/payNote')}</Interaction.P>
        </Box>
      )}
    />
  )

  const variables = variablesAsString
    ? parseJSONObject(variablesAsString)
    : {
        filter: { formats, feed: true }
      }

  return (
    <Center>
      <DocumentListContainer
        feedProps={{ showHeader: false }}
        help={help}
        showTotal={true}
        query={getFeedDocuments}
        variables={variables}
        mapNodes={mapNodes}
      />
    </Center>
  )
}

export default compose(withT)(SectionFeed)
