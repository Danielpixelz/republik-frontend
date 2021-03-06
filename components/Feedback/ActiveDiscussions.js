import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, merge } from 'glamor'
import { compose } from 'react-apollo'

import ArticleItem from './ArticleItem'
import { withActiveDiscussions } from './enhancers'

import DiscussionLink from '../Discussion/DiscussionLink'

import {
  Interaction,
  Loader,
  colors,
  fontStyles,
  mediaQueries,
  linkRule
} from '@project-r/styleguide'

const styles = {
  item: merge(
    linkRule,
    css({
      color: colors.text,
      ':visited': {
        color: colors.text
      },
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      textAlign: 'left',
      padding: '10px 0',
      cursor: 'pointer',
      '& ~ &': {
        borderTop: `1px solid ${colors.divider}`
      },
      '@media(hover)': {
        '&:hover': {
          background: colors.secondaryBg,
          margin: '0 -15px',
          padding: '10px 15px',
          width: 'calc(100% + 30px)'
        },
        '&:hover + &': {
          borderColor: 'transparent'
        },
        '& + &:hover': {
          borderColor: 'transparent'
        }
      },
      ...fontStyles.sansSerifRegular18,
      [mediaQueries.mUp]: {
        ...fontStyles.sansSerifRegular21
      }
    })
  )
}

const ActiveDiscussionItem = ({
  discussion,
  onClick,
  label,
  selected,
  count,
  path
}) => (
  <DiscussionLink discussion={discussion} passHref>
    <a
      {...styles.item}
      style={{ color: selected ? colors.primary : undefined }}
    >
      <ArticleItem
        title={label}
        selected={selected}
        iconSize={24}
        count={count}
        wrapper={Interaction.P}
      />
    </a>
  </DiscussionLink>
)

class ActiveDiscussions extends Component {
  render() {
    const { data } = this.props

    const activeDiscussions =
      data &&
      data.activeDiscussions &&
      data.activeDiscussions.filter(
        activeDiscussion => !activeDiscussion.discussion.closed
      )

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          return (
            <div>
              {activeDiscussions &&
                activeDiscussions.map((activeDiscussion, i) => {
                  const discussion = activeDiscussion.discussion
                  const meta = discussion.document
                    ? discussion.document.meta
                    : {}
                  const path =
                    meta && meta.template === 'discussion' && discussion.path
                  return (
                    <ActiveDiscussionItem
                      key={discussion.id}
                      label={discussion.title}
                      discussion={discussion}
                      path={path}
                      count={discussion.comments.totalCount}
                    />
                  )
                })}
            </div>
          )
        }}
      />
    )
  }
}

export default compose(withActiveDiscussions)(ActiveDiscussions)
