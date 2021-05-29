import React from 'react'

import classNames from 'classnames'

import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import MessagesSection from '../../messages/MessagesSection'

import baseStyles from './styles'

const useStyles = makeStyles((theme) => ({
  ...baseStyles(theme),
}))

export default function NetChatSection({ net, slug, className, style, expanded, onAccordionChange }) {
  const classes = useStyles()

  return (
    <Accordion
      expanded={expanded}
      onChange={onAccordionChange}
      className={classNames(className, classes.sectionRoot, 'h2k-full-bleed', 'h2k-overflow-container')}
      style={style}
      square
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.sectionHeader}>
        <QuestionAnswerIcon className={classes.sectionIcon} />

        <Typography variant="h2">Almost Instant Messages</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <MessagesSection style={{ flex: 1 }} slug={slug} />
      </AccordionDetails>
    </Accordion>
  )
}
