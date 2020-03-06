import React from 'react'
import { A, Interaction } from '@project-r/styleguide'
import { compose } from 'react-apollo'

import withT from '../../../lib/withT'
import { Link } from '../../../lib/routes'

import Form from './Form'
import Grants from './Grants'

const { H2, P } = Interaction

const Campaign = ({ campaign, grantAccess, revokeAccess, t }) => {
  const givingMemberships = campaign.perks.giftableMemberships !== null

  return (
    <div style={{ marginBottom: 80 }}>
      <H2>{campaign.title}</H2>
      <P>{campaign.description}</P>
      {givingMemberships && (
        <P style={{ marginTop: 15 }}>
          {t.pluralize(
            'Account/Access/Campaigns/Campaign/giftableMemberships',
            {
              count: campaign.perks.giftableMemberships
            }
          )}
        </P>
      )}
      <Grants
        campaign={campaign}
        givingMemberships={givingMemberships}
        revokeAccess={revokeAccess}
      />
      <Form
        campaign={campaign}
        givingMemberships={givingMemberships}
        grantAccess={grantAccess}
      />
    </div>
  )
}

export default compose(withT)(Campaign)
