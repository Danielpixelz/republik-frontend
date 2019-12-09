import React from 'react'

import { compose } from 'react-apollo'

import TextQuestion from './TextQuestion'
import ArticleQuestion from './ArticleQuestion'
import RangeQuestion from './RangeQuestion'
import ChoiceQuestion from './ChoiceQuestion'
import { withAnswerMutation } from './enhancers'
import { withRouter } from 'next/router'

const QUESTION_TYPES = {
  QuestionTypeDocument: ArticleQuestion,
  QuestionTypeText: TextQuestion,
  QuestionTypeChoice: ChoiceQuestion,
  QuestionTypeRange: RangeQuestion
}

const QuestionList = compose(
  withRouter,
  withAnswerMutation
)(({ router, submitAnswer, processSubmit, questions, disabled }) => {
  const createHandleChange = questionId => (answerId, value) => {
    const payload = value !== null ? { value } : null
    processSubmit(submitAnswer, questionId, payload, answerId)
  }

  return (
    <>
      {questions.map(q =>
        React.createElement(QUESTION_TYPES[q.__typename], {
          onChange: createHandleChange(q.id),
          question: q,
          key: q.id,
          disabled
        })
      )}
    </>
  )
})

export default ({
  processSubmit,
  questions,
  disabled,
  sliceAt,
  showSlice2
}) => {
  const questions1 = sliceAt ? questions.slice(0, sliceAt) : questions
  const questions2 = sliceAt && questions.slice(sliceAt)

  return (
    <>
      <QuestionList
        questions={questions1}
        disabled={disabled}
        processSubmit={processSubmit}
      />
      {showSlice2 && (
        <>
          <QuestionList
            questions={questions2}
            disabled={disabled}
            processSubmit={processSubmit}
          />
        </>
      )}
    </>
  )
}