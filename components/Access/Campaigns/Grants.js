import React, { Fragment } from 'react'
import { compose } from 'react-apollo'

import { Interaction } from '@project-r/styleguide'

import Grant from './Grant'
import List from '../../List'
import withT from '../../../lib/withT'

const { H3 } = Interaction

const Grants = ({ campaign, givingMemberships, revokeAccess, t }) => {
  if (campaign.grants.length === 0) {
    return null
  }

  return (
    <Fragment>
      {
        <H3 style={{ marginTop: 30 }}>
          {t.pluralize(
            `Account/Access/Campaigns/Grants${
              givingMemberships ? '/givingMemberships' : ''
            }/title`,
            {
              count: campaign.slots.used
            }
          )}
        </H3>
      }
      <List>
        {campaign.grants.map((grant, key) => (
          <Grant
            key={`grant-${key}`}
            grant={grant}
            revokeAccess={revokeAccess}
          />
        ))}
      </List>
    </Fragment>
  )
}

export default compose(withT)(Grants)
