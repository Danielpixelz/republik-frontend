import React from 'react'
import { compose } from 'react-apollo'
import NativeRouter, { withRouter } from 'next/router'

import TrialForm from '../Trial/Form'
import { TRIAL_CAMPAIGNS, TRIAL_CAMPAIGN } from '../../lib/constants'
import { parseJSONObject } from '../../lib/safeJSON'
import { Router } from '../../lib/routes'

const trailCampaignes = parseJSONObject(TRIAL_CAMPAIGNS)

const trialAccessCampaignId =
  (trailCampaignes.wahltindaer &&
    trailCampaignes.wahltindaer.accessCampaignId) ||
  TRIAL_CAMPAIGN

const Form = ({ router, redirect }) => (
  <TrialForm
    beforeSignIn={() => {
      // use native router for shadow routing
      NativeRouter.push(
        {
          pathname: '/cardGroup',
          query: {
            group: router.query.group,
            suffix: router.query.suffix,
            stale: 1
          }
        },
        router.asPath,
        { shallow: true }
      )
    }}
    onSuccess={() => {
      if (!redirect) {
        Router.replaceRoute(
          'cardGroup',
          { group: router.query.group, suffix: router.query.suffix },
          { shallow: true }
        )
        return false
      }
      return true
    }}
    accessCampaignId={trialAccessCampaignId}
    narrow
  />
)

export default compose(withRouter)(Form)
