import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import isEmail from 'validator/lib/isEmail'

import withT from '../../lib/withT'

import ErrorMessage from '../ErrorMessage'

import {
  Button,
  InlineSpinner,
  Interaction,
  Field,
  RawHtml,
  colors,
  Editorial
} from '@project-r/styleguide'

const styles = {
  form: css({
    display: 'flex',
    justifyContent: 'space-between',
    flexFlow: 'row wrap'
  }),
  input: css({
    marginRight: 10,
    marginBottom: 0,
    width: '58%',
    flexGrow: 1
  }),
  button: css({
    width: 160,
    textAlign: 'center',
    marginBottom: 15
  }),
  hints: css({
    color: colors.text,
    marginTop: -5,
    fontSize: 16,
    lineHeight: '24px'
  })
}

export const checkEmail = ({ value, shouldValidate, t }) => ({
  email: value,
  error:
    (value.trim().length <= 0 && t('signIn/email/error/empty')) ||
    (!isEmail(value) && t('signIn/email/error/invalid')),
  dirty: shouldValidate
})

const EmailForm = props => {
  const {
    t,
    label,
    beforeForm,
    onChange,
    onSubmit,
    hints,
    loading,
    error,
    dirty,
    email,
    serverError,
    black
  } = props

  return (
    <div>
      {beforeForm}
      <form onSubmit={onSubmit}>
        <div {...styles.form}>
          <div {...styles.input}>
            <Field
              black={black}
              name='email'
              type='email'
              label={t('signIn/email/label')}
              error={dirty && error}
              onChange={(_, value, shouldValidate) => {
                onChange(
                  checkEmail({
                    t,
                    value,
                    shouldValidate
                  })
                )
              }}
              value={email}
            />
          </div>
          <div {...styles.button}>
            {loading ? (
              <InlineSpinner />
            ) : (
              <Button block black={black} type='submit'>
                {label || t('signIn/button')}
              </Button>
            )}
          </div>
        </div>
      </form>
      {!!hints && <div {...styles.hints}>{hints}</div>}
      {!!serverError && <ErrorMessage error={serverError} />}
    </div>
  )
}

export default withT(EmailForm)
