import React from 'react'
import { css } from 'glamor'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'

import {
  Button,
  Editorial,
  Interaction,
  Loader,
  colors
} from '@project-r/styleguide'
import { ChartTitle, ChartLead, Chart } from '@project-r/styleguide/chart'

import md from 'markdown-in-js'

import Frame from '../components/Frame'
import { light as mdComponents } from '../lib/utils/mdComponents'

import { PackageItem, PackageBuffer } from '../components/Pledge/Accordion'

import { RawStatus } from '../components/CrowdfundingStatus'
import withT from '../lib/withT'

import { ListWithQuery as TestimonialList } from '../components/Testimonial/List'

import {
  CROWDFUNDING,
  STATUS_POLL_INTERVAL_MS,
  CDN_FRONTEND_BASE_URL
} from '../lib/constants'
import withMe from '../lib/apollo/withMe'
import { Link, questionnaireCrowdSlug } from '../lib/routes'
import { swissTime } from '../lib/utils/format'
import withInNativeApp from '../lib/withInNativeApp'

// Quelle «Mitglieder- und Abonnementzahlen» Dashboard
// Stand Verlauf Mitgliedschaften und Verlauf Monatsabonnements per 31.11.2019
// Abgerufen am 07.12.19 um 14:27
const TOTAL_NOV19 = 16799 + 1730
// Question 405 «Can Quite»
const TOTAL_CAN_QUIT = 12896

const END_DATE = '2020-03-31T10:00:00.000Z'

const formatDateTime = swissTime.format('%d.%m.%Y %H:%M')

const Accordion = withInNativeApp(
  withT(
    ({
      t,
      me,
      query,
      shouldBuyProlong,
      isReactivating,
      defaultBenefactor,
      questionnaire,
      inNativeIOSApp
    }) => {
      const [hover, setHover] = React.useState()

      if (inNativeIOSApp) {
        return (
          <div style={{ marginTop: 10, marginBottom: 40 }}>
            <Interaction.P style={{ color: '#fff', marginBottom: 10 }}>
              {t('cockpit/ios')}
            </Interaction.P>

            <Link
              route='questionnaireCrowd'
              params={{ slug: questionnaireCrowdSlug }}
              passHref
            >
              <Button primary block>
                {t('cockpit/ios/cta')}
              </Button>
            </Link>
          </div>
        )
      }

      return (
        <div style={{ marginTop: 10, marginBottom: 40 }}>
          <Interaction.P style={{ color: '#fff', marginBottom: 10 }}>
            <strong>So können Sie uns jetzt unterstützen:</strong>
          </Interaction.P>
          {shouldBuyProlong ? (
            <>
              <Link
                route='pledge'
                params={{ package: 'PROLONG', token: query.token }}
                passHref
              >
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='PROLONG'
                  title={isReactivating ? 'Zurückkehren' : undefined}
                  hover={hover}
                  setHover={setHover}
                  price={24000}
                />
              </Link>
              <Link
                route='pledge'
                params={{
                  package: 'PROLONG',
                  price: 48000,
                  token: query.token
                }}
                passHref
              >
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='PROLONG-BIG'
                  hover={hover}
                  setHover={setHover}
                  title={
                    isReactivating
                      ? 'Grosszügig zurückkehren'
                      : 'Grosszügig verlängern'
                  }
                  price={48000}
                />
              </Link>
              <Link
                route='pledge'
                params={{
                  package: 'PROLONG',
                  membershipType: 'BENEFACTOR_ABO',
                  token: query.token
                }}
                passHref
              >
                <PackageItem
                  t={t}
                  dark
                  crowdfundingName={CROWDFUNDING}
                  name='PROLONG-BEN'
                  hover={hover}
                  setHover={setHover}
                  title={defaultBenefactor ? 'Gönner bleiben' : 'Gönner werden'}
                  price={100000}
                />
              </Link>
            </>
          ) : (
            <>
              {me && me.activeMembership ? (
                <Link route='pledge' params={{ package: 'ABO_GIVE' }} passHref>
                  <PackageItem
                    t={t}
                    dark
                    crowdfundingName={CROWDFUNDING}
                    name='ABO_GIVE'
                    hover={hover}
                    setHover={setHover}
                    price={24000}
                  />
                </Link>
              ) : (
                <>
                  <Link
                    route='pledge'
                    params={{ package: 'MONTHLY_ABO' }}
                    passHref
                  >
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='MONTHLY_ABO'
                      hover={hover}
                      setHover={setHover}
                      price={2200}
                    />
                  </Link>
                  <Link route='pledge' params={{ package: 'ABO' }} passHref>
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='ABO'
                      hover={hover}
                      setHover={setHover}
                      price={24000}
                    />
                  </Link>
                  <Link
                    route='pledge'
                    params={{ package: 'BENEFACTOR' }}
                    passHref
                  >
                    <PackageItem
                      t={t}
                      dark
                      crowdfundingName={CROWDFUNDING}
                      name='BENEFACTOR'
                      hover={hover}
                      setHover={setHover}
                      price={100000}
                    />
                  </Link>
                </>
              )}
            </>
          )}
          <Link route='pledge' params={{ package: 'DONATE' }} passHref>
            <PackageItem
              t={t}
              dark
              crowdfundingName={CROWDFUNDING}
              name='DONATE'
              hover={hover}
              setHover={setHover}
            />
          </Link>
          <PackageBuffer />
          <br />
          <PrimaryCTA
            me={me}
            query={query}
            questionnaire={questionnaire}
            shouldBuyProlong={shouldBuyProlong}
            isReactivating={isReactivating}
            defaultBenefactor={defaultBenefactor}
            block
          />
        </div>
      )
    }
  )
)

const PrimaryCTA = withInNativeApp(
  ({
    me,
    questionnaire,
    shouldBuyProlong,
    isReactivating,
    block,
    query,
    children,
    inNativeIOSApp
  }) => {
    if (inNativeIOSApp) {
      return null
    }

    let target
    let text
    if (shouldBuyProlong) {
      target = {
        route: 'pledge',
        params: { package: 'PROLONG', token: query.token }
      }
      text = isReactivating ? 'Zurückkehren' : 'Treu bleiben'
    } else if (!(me && me.activeMembership)) {
      target = {
        route: 'pledge',
        params: { package: 'ABO' }
      }
      text = 'Mitglied werden'
    } else if (
      questionnaire &&
      questionnaire.userIsEligible &&
      !questionnaire.userHasSubmitted
    ) {
      target = {
        route: 'questionnaireCrowd',
        params: { slug: questionnaireCrowdSlug }
      }
      text = 'Ich möchte der Republik helfen.'
    } else {
      return null
    }
    if (children) {
      return (
        <Link {...target} passHref>
          {children}
        </Link>
      )
    }
    return (
      <Link {...target} passHref>
        <Button primary block={block}>
          {text}
        </Button>
      </Link>
    )
  }
)

const Page = ({
  data,
  t,
  me,
  actionsLoading,
  questionnaire,
  canProlongOwn,
  isReactivating,
  defaultBenefactor,
  router: { query }
}) => {
  const meta = {
    pageTitle: '🚀 Republik Cockpit',
    title: 'Nehmen Sie Platz im Cockpit',
    description:
      'Kämpfen wir gemeinsam um die Zukunft der Republik. Was Sie wissen müssen, wo wir stehen, und warum wir Sie brauchen.',
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/cockpit.jpg`
  }

  return (
    <Frame meta={meta} dark>
      <Loader
        loading={data.loading || actionsLoading}
        error={data.error}
        style={{ minHeight: `calc(90vh)` }}
        render={() => {
          const { evolution } = data.membershipStats
          const lastMonth = evolution.buckets[evolution.buckets.length - 1]

          const shouldBuyProlong =
            canProlongOwn &&
            (!me ||
              (me.activeMembership &&
                new Date(me.activeMembership.endDate) <= new Date(END_DATE)))

          return (
            <>
              <div style={{ marginBottom: 60 }}>
                <RawStatus
                  t={t}
                  people
                  money
                  crowdfundingName='SURVIVE'
                  crowdfunding={{
                    endDate: END_DATE,
                    goals: [
                      {
                        people: 19000,
                        money: 220000000
                      }
                    ],
                    status: {
                      people:
                        lastMonth.activeEndOfMonth +
                        lastMonth.pendingSubscriptionsOnly,
                      money: data.revenueStats.surplus.total,
                      support: data.questionnaire
                        ? data.questionnaire.turnout.submitted
                        : undefined
                    }
                  }}
                />
              </div>
              {md(mdComponents)`

# Die Republik braucht Ihre Unterstützung, Ihren Mut und Ihren Einsatz, damit sie in Zukunft bestehen kann!

      `}
              <Accordion
                me={me}
                query={query}
                shouldBuyProlong={shouldBuyProlong}
                isReactivating={isReactivating}
                defaultBenefactor={defaultBenefactor}
                questionnaire={questionnaire}
              />

              {md(mdComponents)`
Seit zwei Jahren ist die Republik jetzt da – als digitales Magazin, als Labor für den Journalismus des 21. Jahrhunderts.

Drei entscheidende Ziele haben wir uns gesetzt: eine Startfinanzierung zu finden, eine funktionierende Redaktion mit Schlag­kraft aufzubauen und ein Geschäfts­modell für unabhängigen, werbefreien und leser­finanzierten Journalismus zu entwickeln.

Sie haben uns bis hierhin begleitet: mit Ihrer Neugier, Ihrer Unterstützung, Ihrem Lob und Ihrer Kritik. Dafür ein grosses Danke! Ohne Sie wären wir nicht hier.

Unser erstes Ziel – die Startfinanzierung – haben wir gemeinsam mit Ihnen und unerschrockenen Investoren erreicht. Das zweite Ziel ebenfalls: eine funktionierende Redaktion aufzubauen, die ordentlichen und immer öfter auch ausserordentlichen Journalismus liefert und sich weiterentwickeln will. Das dritte Ziel leider noch nicht: ein funktionierendes Geschäfts­modell für werbefreien, unabhängigen, leserfinanzierten Journalismus zu etablieren.

An der Notwendigkeit unseres gemeinsamen Projekts hat sich nichts geändert. Die grossen Verlage haben wenig Ideen ausser Fusionen. Und in der Politik sind Institutionen und Fakten weiter unter Beschuss.

Unsere Aufgabe ist, brauchbaren Journalismus zu machen. Einen, der die Köpfe klarer, das Handeln mutiger, die Entscheidungen klüger macht. Und der das Gemeinsame stärkt: die Freiheit, den Rechtsstaat, die Demokratie.

Wir sind überzeugt, dass unsere Existenz einen Unterschied machen kann. Deshalb kämpfen wir für die Republik.

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Kämpfen Sie mit?
    </Editorial.A>
  </PrimaryCTA>
)}

## Worum es geht

Im Prinzip funktioniert die Republik wie eine Rakete.

Um abzuheben braucht sie Treibstoff. Den haben wir von Investoren und fast 14’000 Menschen beim Crowdfunding bekommen.

Dann zünden zwei Stufen:

**Stufe 1:** Das Unternehmen muss auf den richtigen Kurs gebracht werden. Wir haben mehr als ein Jahr gebraucht, bis Produkt, Crew und Organisation vernünftig funktioniert haben. 

**Stufe 2:** Nun muss die Republik einen stabilen Orbit muss erreichen. Also selbsttragend werden.

Denn die Republik macht nur dann Sinn, wenn sie aus eigener Kraft überlebt, wenn wir ein neues Modell für den Schweizer Medien­markt etablieren können. Und den Beweis liefern, dass kompromiss­loser Journalismus ohne Werbung funktioniert.

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Sind Sie an Bord?
    </Editorial.A>
  </PrimaryCTA>
)}

## Warum jetzt gerade?

Die Republik hat aktuell rund 18’600 Verlegerinnen. Das deckt mehr als 70 Prozent der Kosten. Die restlichen 30 Prozent reissen ein tiefes Loch in die Bilanz. Wir sind 2019 langsamer gewachsen als budgetiert. Das hat heftige Folgen: Bis Ende März müssen wir den Rückstand aufholen, sonst hat die Republik keine Zukunft. Dann werden wir die Republik am 31. März 2020 schliessen.

Katapultiert uns aber die zweite Stufe der Rakete Richtung Orbit, haben wir realistische Chancen, ein tragfähiges Geschäfts­modell zu etablieren.

Hier einige unfreundliche Zahlen:

*   Wir haben statt wie budgetiert 8100 neue Mitglieder in diesem Jahr bisher 4000 neue Mitglieder hinzu gewonnen.
*   Wir konnten 2019 neue Investoren gewinnen, Förder­beiträge erhalten und über eine halbe Million fundraisen. Das ist wunderbar. Aber weniger als die geplante 1 Million.

Zusammengenommen riss das ein Loch von 1,5 Millionen Franken in den Betrieb. Und das ist unternehmerisch nicht mehr lange tragbar.

## Das sind unsere Ziele

*   Wir müssen bis Ende März 19’000 Verlegerinnen an Bord haben. Das ist zwar nur ein wenig mehr als heute – aber das Ziel ist trotzdem alles andere als trivial: Wir müssen neue Verlegerinnen dazugewinnen, aber auch jene ersetzen, die uns in den nächsten Monaten verlassen.


*   Wir brauchen bis Ende März 2,2 Millionen Franken an Investoren­geldern, Spenden und Förder­beiträgen. Davon haben wir 535’000 Franken bereits erhalten.

Dafür brauchen wir Sie. An Bord. Und an Deck.

(Alles weitere, was Sie zur Lage der Republik wissen müssen, [finden Sie hier](/cockpit/faq "Warum nur? Das Briefing"))

`}

              <div
                {...css({
                  marginTop: 20,
                  '& text': {
                    fill: '#fff !important'
                  },
                  '& line': {
                    stroke: 'rgba(255, 255, 255, 0.4) !important'
                  },
                  '& div': {
                    color: '#fff !important'
                  }
                })}
              >
                <ChartTitle style={{ color: '#fff' }}>
                  Wie gross ist die Republik-Verlegerschaft per 31. März?
                </ChartTitle>
                <ChartLead style={{ color: '#fff' }}>
                  Anzahl bestehende, offene und neue Mitgliedschaften und
                  Monatsabos per Monatsende
                </ChartLead>
                <Chart
                  config={{
                    type: 'TimeBar',
                    color: 'action',
                    numberFormat: 's',
                    colorRange: [
                      '#FFD700',
                      '#CCAC00',
                      '#3CAD00',
                      '#2A7A00',
                      '#333333',
                      '#9970ab'
                    ],
                    x: 'date',
                    timeParse: '%Y-%m',
                    timeFormat: '%b',
                    xTicks: ['2019-12', '2020-01', '2020-02', '2020-03'],
                    height: 300,
                    padding: 55,
                    xAnnotations: [
                      {
                        x1: '2020-03',
                        x2: '2020-03',
                        label: '75% Erneuerung',
                        value:
                          TOTAL_NOV19 - TOTAL_CAN_QUIT + TOTAL_CAN_QUIT * 0.75
                      },
                      {
                        x1: '2020-03',
                        x2: '2020-03',
                        label: '50% Erneuerung',
                        value:
                          TOTAL_NOV19 - TOTAL_CAN_QUIT + TOTAL_CAN_QUIT * 0.5
                      }
                    ]
                  }}
                  values={evolution.buckets.reduce((values, month) => {
                    return values.concat([
                      {
                        date: month.key,
                        action: 'grosszügig (bestehende)',
                        value: String(month.activeEndOfMonthWithDonation)
                      },
                      {
                        date: month.key,
                        action: 'grosszügig (neue)',
                        value: String(month.gainingWithDonation)
                      },
                      {
                        date: month.key,
                        action: 'bestehende',
                        value: String(
                          month.activeEndOfMonthWithoutDonation +
                            month.pendingSubscriptionsOnly
                        )
                      },
                      {
                        date: month.key,
                        action: 'neue',
                        value: String(month.gainingWithoutDonation)
                      },
                      {
                        date: month.key,
                        action: 'offene',
                        value: String(
                          month.pending - month.pendingSubscriptionsOnly
                        )
                      }
                    ])
                  }, [])}
                />
                <Editorial.Note style={{ marginTop: 10, color: '#fff' }}>
                  Als grosszügig gelten alle, die mehr als CHF 240 bezahlt
                  haben. Erneuerungsquoten basierend auf allen
                  Jahres­mitgliedschaften, die zwischen dem 1. Dezember und dem
                  31. März erneuert werden könnten. Als offen gelten
                  Jahres­mitgliedschaften, wo noch keine Verlängerungs­zahlung
                  initiiert wurde. Datenstand:{' '}
                  {formatDateTime(new Date(evolution.updatedAt))}
                </Editorial.Note>
              </div>

              {md(mdComponents)`

${(
  <PrimaryCTA
    me={me}
    query={query}
    questionnaire={questionnaire}
    shouldBuyProlong={shouldBuyProlong}
    isReactivating={isReactivating}
    defaultBenefactor={defaultBenefactor}
  >
    <Editorial.A style={{ color: colors.negative.text }}>
      Jetzt Tank füllen
    </Editorial.A>
  </PrimaryCTA>
)}

## Gemeinsam sind wir weit gekommen

Abgesehen von den Finanzen war 2019 ein gutes Jahr: 

*   Die Redaktion wurde so weiterentwickelt, dass sie beides kann: schnell auf wichtige Ereignisse reagieren und Hintergrund liefern.
*   Wir haben systematisch Expertise wie Themen­führerschaft in den Bereichen Justiz und Digitalisierung und in Klimafragen aufgebaut.
*   Wir haben einen permanenten Dialog mit Ihnen aufgebaut. Und gelernt: Die Präsenz der Redaktion in den Debatten ist jetzt die Regel, nicht die Ausnahme.
*   Wir berichten so viel wie kein anderes Medien­unternehmen über die eigene Arbeit und erzählen über die Entwicklung unseres Unternehmens.
*   Wir haben Nachwuchs ausgebildet – zwar wenig, aber was für einen!
*   Wir waren für den deutschen Grimme-Preis nominiert, gewannen den Schweizer Reporterpreis und den Preis European Start-Up of the Year.
*   Und wir haben seit knapp einem Jahr ein starkes Gremium im Rücken, das uns trägt, unterstützt – und konstruktiv kritisiert: den Genossenschaftsrat.

## Die drei Phasen bis Ende März

**Bis Ende Januar** geht es darum, quasi die Tanks von Stufe zwei aufzufüllen. Gemeinsam haben wir drei nicht ganz einfache Dinge zu erledigen: 

1.  Dass viele Verleger bestätigen, dass sie trotz Risiko an Bord sind.
2.  Dass möglichst viele von Ihnen auf den doppelten Mitgliedschaftspreis aufstocken. Denn was bringt Leben in Projekte: Grosszügigkeit und Geld.
3.  Neue unerschrockene Investorinnen und Grossspender finden. (Falls Sie eine grössere Summe investieren wollen, schreiben Sie an: <mailto:ir@republik.ch>)

**Im Februar** geht es darum, den Check-up vor der Zündung zu machen. Wir reden mit Ihnen intensiv darüber, wie wir unser Produkt neugieriger und nützlicher machen können.

**Im März** zündet das Triebwerk. Wir werden ein paar tausend neue Verlegerinnen gewinnen müssen. Jetzt geht es um: Wachstum. 

Am 31. März ist es dann wie immer bei einer Reise mit einer Rakete: Entweder sie ist mit Ihnen explodiert – oder sie ist ein grosses Stück weiter.

## Ohne Sie können wir nicht wachsen

Um das Ziel von 19’000 Verlegerinnen zu erreichen, brauchen wir Reichweite. Die können wir uns jedoch weder kaufen (zu teuer) noch allein mit Journalismus erarbeiten.

Wir setzen also auf unsere wichtigste Ressource: Sie. Sie – und Ihr Adressbuch, Ihr Netzwerk, Ihre Begeisterung, Ihre Skepsis. 

Wir werden eine Kampagne machen müssen, in der Sie als Multiplikatoren, Botschafterinnen, Komplizen – nennen Sie es, wie Sie wollen – eine Hauptrolle spielen. 

Unser Job dabei ist, Sie regelmässig, offen und klar über den Stand der Dinge zu informieren. Und Ihnen die besten Werkzeuge in die Hand zu geben: Argumente, Flyer, Mailkanonen – kurz: Propaganda­material.

Falls Sie sich vorstellen können, dabei zu sein, haben wir ein kleines Formular für Sie vorbereitet. Es auszufüllen, braucht genau eine Minute. Wir sind Ihnen dankbar, wenn Sie sich diese Minute nehmen.

${
  questionnaire && questionnaire.userHasSubmitted ? (
    'Vielen Dank fürs Ausfüllen.'
  ) : (
    <Link
      route='questionnaireCrowd'
      params={{ slug: questionnaireCrowdSlug }}
      passHref
    >
      <Button primary>Komplizin werden</Button>
    </Link>
  )
}

## Was wir auf dem Weg zum Ziel schon geschafft haben

(Liste wird – hoffentlich regelmässig – aktualisiert)

*   350’000 Franken von neuen Investoren erhalten. Danke Luzius Meisser, danke Adrian Gasser.
*   185’000 Franken von Stiftungen erhalten. Danke Stiftung für Medienvielfalt, danke Paul-Schiller-Stiftung, danke Volkart-Stiftung. 

## Was Sie sofort tun können

*   Falls Sie nur eine Sache tun wollen: Erneuern Sie Ihre Mitgliedschaft – wenn möglich grosszügig. Wenn möglich jetzt.
*   Oder – wenn Sie nicht an Bord sind – werden Sie Mitglied der Verlagsetage.
*   Verschenken Sie die Republik, zum Beispiel zu Weihnachten – oder unter einem anderen Vorwand.
*   Weiter hilft uns, wenn Sie mit Ihren Freunden über uns reden. Oder unsere interessanteren Geschichten mit ihnen teilen. 

So – das wars fürs Erste. Wir würden uns freuen, wenn Sie in den nächsten vier Monaten Seite an Seite mit uns kämpfen.

Einfach wird das nicht – aber wir werden guter Laune sein. Und das Unternehmen Richtung stabilen Orbit steuern.

Wie wir hoffen: mit Ihnen. Wem sonst?

PS: Falls Sie noch offene Fragen haben: [Wir haben ein rundes Dutzend der wichtigsten hier beantwortet](/cockpit/faq "Warum nur? Das Briefing").

## Community

## ${lastMonth.activeEndOfMonth +
                lastMonth.pendingSubscriptionsOnly} sind treu`}

              <TestimonialList
                membershipAfter={END_DATE}
                ssr={false}
                singleRow
                minColumns={3}
                dark
              />
              <br />

              {md(mdComponents)`

[Alle anschauen](/community)${'\u00a0'}– [Statement abgeben](/einrichten)

      `}

              <Accordion
                me={me}
                query={query}
                shouldBuyProlong={shouldBuyProlong}
                isReactivating={isReactivating}
                defaultBenefactor={defaultBenefactor}
                questionnaire={questionnaire}
              />
            </>
          )
        }}
      />
    </Frame>
  )
}

const statusQuery = gql`
  query StatusPage {
    revenueStats {
      surplus(min: "2019-11-30T23:00:00Z") {
        total
        updatedAt
      }
    }
    membershipStats {
      evolution(min: "2019-12", max: "2020-03") {
        buckets {
          key

          gaining
          gainingWithDonation
          gainingWithoutDonation

          ending
          prolongable
          expired
          cancelled

          activeEndOfMonth
          activeEndOfMonthWithDonation
          activeEndOfMonthWithoutDonation

          pending
          pendingSubscriptionsOnly
        }
        updatedAt
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      turnout {
        submitted
      }
    }
  }
`

const actionsQuery = gql`
  query StatusPageActions($accessToken: ID) {
    me(accessToken: $accessToken) {
      id
      customPackages {
        options {
          membership {
            id
            user {
              id
            }
            graceEndDate
          }
          defaultAmount
          reward {
            ... on MembershipType {
              name
            }
          }
        }
      }
    }
    questionnaire(slug: "${questionnaireCrowdSlug}") {
      id
      userIsEligible
      userHasSubmitted
    }
  }
`

export default compose(
  withT,
  withMe,
  withRouter,
  graphql(statusQuery, {
    options: {
      pollInterval: +STATUS_POLL_INTERVAL_MS
    }
  }),
  graphql(actionsQuery, {
    props: ({ data: { loading, me, questionnaire } }) => {
      const isOptionWithOwn = o =>
        o.membership && o.membership.user && o.membership.user.id === me.id
      const customPackageWithOwn =
        me &&
        me.customPackages &&
        me.customPackages.find(p => p.options.some(isOptionWithOwn))
      const ownMembership =
        customPackageWithOwn &&
        customPackageWithOwn.options.find(isOptionWithOwn).membership
      return {
        actionsLoading: loading,
        questionnaire,
        canProlongOwn: !!customPackageWithOwn,
        isReactivating:
          ownMembership && new Date(ownMembership.graceEndDate) < new Date(),
        defaultBenefactor:
          !!customPackageWithOwn &&
          me.customPackages.some(p =>
            p.options.some(
              o =>
                isOptionWithOwn(o) &&
                o.defaultAmount === 1 &&
                o.reward.name === 'BENEFACTOR_ABO'
            )
          )
      }
    },
    options: ({ router: { query } }) => ({
      variables: {
        accessToken: query.token
      }
    })
  })
)(Page)
