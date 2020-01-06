import React from 'react'

import { compose } from 'react-apollo'
import { withRouter } from 'next/router'
import isEmail from 'validator/lib/isEmail'

import { maybeDecode } from '../lib/utils/base64u'
import ClaimMembership, {
  sanitizeVoucherCode
} from '../components/Account/Memberships/Claim'
import Frame from '../components/Frame'
import withT from '../lib/withT'

const ALLOWED_CONTEXT = ['claim', 'access']

const Claim = ({ router: { query }, t }) => {
  let { context, email, code } = query

  context = ALLOWED_CONTEXT.includes(context) && context
  email = email && maybeDecode(email)
  email = email && isEmail(email) ? email : ''
  code = code && sanitizeVoucherCode(code)

  const meta = {
    title: t.first([
      `pages/claim/${context}/meta/title`,
      'pages/claim/meta/title'
    ]),
    description: t.first([
      `pages/claim/${context}/meta/description`,
      'pages/claim/meta/description'
    ])
  }

  return (
    <Frame meta={meta}>
      <ClaimMembership context={context} email={email} voucherCode={code} />
    </Frame>
  )
}

export default compose(
  withRouter,
  withT
)(Claim)
