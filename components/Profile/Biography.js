import React from 'react'
import { css } from 'glamor'

import withT from '../../lib/withT'

import FieldSet from '../FieldSet'

import { Editorial, renderCommentMdast } from '@project-r/styleguide'

const styles = {
  text: css({
    marginTop: 0,
    marginBottom: 60,
    '& p': {
      fontSize: '1.1875rem',
      lineHeight: '1.875rem'
    }
  })
}

const fields = t => [
  {
    label: t('profile/biography/label'),
    name: 'biography',
    autoSize: true
  }
]

export default withT(({ user, isEditing, t, ...props }) => {
  if (!user.biography && !isEditing) {
    return null
  }
  return (
    <div {...styles.text}>
      {isEditing ? (
        <Editorial.P {...styles.text}>
          <FieldSet {...props} fields={fields(t)} />
        </Editorial.P>
      ) : (
        renderCommentMdast(user.biographyContent)
      )}
    </div>
  )
})
