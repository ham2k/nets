import React from 'react'
import classNames from 'classnames'
import { Container, makeStyles, Paper, Typography } from '@material-ui/core'

import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import MessagesSection from '../../messages/MessagesSection'

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
    },
  },
  icon: {
    flex: 0,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },
  info: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  secondary: {
    textAlign: 'right',
    [theme.breakpoints.down('md')]: {
      textAlign: 'left',
    },
  },
}))

function ExpandedNetChatSection({ net, className }) {
  const classes = useStyles()

  return (
    <>
      <Paper elevation={3} square>
        <Container className={classes.header} maxWidth="md">
          <Typography variant="h6">
            <QuestionAnswerIcon /> Almost Instant Messages
          </Typography>
        </Container>
      </Paper>

      <MessagesSection className={classes.netMessages} slug={slug} />
    </>
  )
}

function CollapsedNetChatSection({ net, className }) {
  const classes = useStyles()

  return (
    <>
      <Paper elevation={3} square>
        <Container className={classes.header} maxWidth="md">
          <Typography variant="h6">
            <QuestionAnswerIcon /> Almost Instant Messages
          </Typography>
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
