import React from 'react'
import classNames from 'classnames'
import { Container, makeStyles, Paper, Typography } from '@material-ui/core'

import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import MessagesSection from '../../messages/MessagesSection'

import baseStyles from './styles'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),
}))

function ExpandedNetChatSection({ net, slug, className }) {
  const classes = useStyles()

  return (
    <>
      <Paper square elevation={3} className={classes.sectionHeaderOuter}>
        <Container maxWidth="md" className={classes.sectionHeader}>
          <QuestionAnswerIcon className={classes.sectionIcon} />

          <Typography variant="h2">Almost Instant Messages</Typography>
        </Container>
      </Paper>
      <MessagesSection className={classes.netMessages} slug={slug} />
    </>
  )
}

function CollapsedNetChatSection({ net, slug, className }) {
  const classes = useStyles()

  return (
    <>
      <Paper square elevation={3} className={classes.sectionHeaderOuter}>
        <Container maxWidth="md" className={classes.sectionHeader}>
          <QuestionAnswerIcon className={classes.sectionIcon} />

          <Typography variant="h2">Almost Instant Messages</Typography>
        </Container>
      </Paper>
    </>
  )
}

export default function NetChatSection(props) {
  const { expanded } = props

  if (expanded) {
    return ExpandedNetChatSection(props)
  } else {
    return CollapsedNetChatSection(props)
  }
}
