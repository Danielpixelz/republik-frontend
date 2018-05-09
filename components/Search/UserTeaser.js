import React, { Fragment } from 'react'
import { css } from 'glamor'
import MdCheck from 'react-icons/lib/md/check'
import { Link } from '../../lib/routes'

import {
  DEFAULT_PROFILE_PICTURE,
  colors,
  fontStyles
} from '@project-r/styleguide'

export const profilePictureSize = 70
export const profilePictureMargin = 10
const profilePictureBorderSize = 5

const styles = {
  root: css({
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${colors.text}`,
    margin: '0 0 40px 0',
    paddingTop: 10
  }),
  profilePicture: css({
    display: 'block',
    width: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    flexGrow: 0,
    flexShrink: 0,
    height: `${profilePictureSize + 2 * profilePictureBorderSize}px`,
    margin: `${-profilePictureBorderSize}px ${-profilePictureBorderSize + profilePictureMargin}px ${-profilePictureBorderSize}px ${-profilePictureBorderSize}px`,
    border: `${profilePictureBorderSize}px solid #fff`
  }),
  meta: css({
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: `calc(100% - ${profilePictureSize + profilePictureMargin}px)`
  }),
  name: css({
    ...fontStyles.sansSerifMedium22,
    lineHeight: '20px',
    color: colors.text,
    display: 'flex',
    alignItems: 'center'
  }),

  description: css({
    ...fontStyles.sansSerifRegular18,
    lineHeight: '20px',
    color: colors.lightText,
    display: 'flex',
    alignItems: 'center'
  }),
  verifiedCheck: css({
    color: colors.text,
    flexShrink: 0,
    display: 'inline-block',
    marginLeft: 4,
    marginTop: -2
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

export const UserTeaser = ({id, username, firstName, lastName, credential}) => {
  return (
    <div {...styles.root}>
      <Link route='profile' params={{ slug: username || id }}>
        <a {...styles.link}>
          <img
            {...styles.profilePicture}
            src={DEFAULT_PROFILE_PICTURE}
            alt={`${firstName} ${lastName}`}
          />
        </a>
      </Link>
      <div {...styles.meta}>
        <div {...styles.name}>
          <div {...styles.nameText}>
            <Link route='profile' params={{ slug: username || id }}>
              <a {...styles.link}>{firstName} {lastName}</a>
            </Link>
          </div>
        </div>
        {(credential) && <div {...styles.description}>
          {credential && <Fragment>
            <div {...styles.descriptionText} style={{color: credential.verified ? colors.text : colors.lightText}}>
              {credential.description}
            </div>
            {credential.verified &&
              <MdCheck {...styles.verifiedCheck} />}
          </Fragment>}
        </div>}
      </div>
    </div>
  )
}

export default UserTeaser
