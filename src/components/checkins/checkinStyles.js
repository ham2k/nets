import baseStyles from '../../styles/styles'

export const checkinStyles = (theme) => ({
  ...baseStyles(theme),

  list: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    lineHeight: '1.8rem',
  },

  card: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    '&.odd': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.even': {
      backgroundColor: 'inherit',
    },

    '&.ci_wanted.odd': {
      backgroundColor: theme.palette.spotting_wanted.odd_bg,
    },
    '&.ci_wanted.even': {
      backgroundColor: theme.palette.spotting_wanted.bg,
    },

    '&.ci_operating': {
      paddingTop: theme.spacing(0.5),
      borderTopStyle: 'solid',
      borderTopWidth: theme.spacing(0.5),
      borderTopColor: theme.palette.spotting_operating.main,
      paddingBottom: theme.spacing(0.5),
      borderBottomStyle: 'solid',
      borderBottomWidth: theme.spacing(0.5),
      borderBottomColor: theme.palette.spotting_operating.main,
    },

    '&.ci_worked_callsign.odd': {
      backgroundColor: theme.palette.spotting_worked.odd_bg,
    },
    '&.ci_worked_callsign.even': {
      backgroundColor: theme.palette.spotting_worked.bg,
    },
    '&.ci_confirmed_callsign.odd': {
      backgroundColor: theme.palette.spotting_worked.odd_bg,
    },
    '&.ci_confirmed_callsign.even': {
      backgroundColor: theme.palette.spotting_worked.bg,
    },

    display: 'grid',
    gridTemplateRows: 'auto',

    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: `
        calc(50vw - ${theme.breakpoints.values.md / 2}px + ${theme.spacing(1.5)}px)
        3rem
        20fr
        40fr
        40fr
        ${theme.breakpoints.values.md * 0.4}px
        calc(50vw - ${theme.breakpoints.values.md / 2}px + ${theme.spacing(1.5)}px)
    `,

      gridTemplateAreas: `
      "leftMargin  serial    call      name      tags      info      rightMargin "
      "leftMargin  controls  controls  controls  controls  info      rightMargin "
    `,
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: `
        3rem
        15fr
        35fr
        50fr
    `,

      gridTemplateAreas: `
      "  serial    call      name      tags     "
      "  serial    info      info      info     "
      "  controls  controls  controls  controls "
    `,
    },

    justifyItems: 'stretch',
    alignItems: 'flex-start',

    '& .cardSerial': {
      gridArea: 'serial',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: theme.spacing(0.75),
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
      },
    },

    '& .cardCallsign': {
      gridArea: 'call',
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(0.75),
    },
    '& .cardName': {
      gridArea: 'name',
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(0.75),
    },
    '& .cardTags': {
      gridArea: 'tags',
      justifySelf: 'end',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingLeft: theme.spacing(0.75),
      marginRight: theme.spacing(1.5),
      [theme.breakpoints.down('sm')]: {
        marginRight: theme.spacing(1),
      },
    },

    '& .cardLocation': {
      gridArea: 'info',
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(0.75),
    },

    '& .cardControls': {
      gridArea: 'controls',
      display: 'none',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(0.75),
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
      },
      '& .MuiChip-root': {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
      },
      '& .MuiChip-icon': {
        marginLeft: theme.spacing(0.75),
      },
    },

    '&.open .cardSerial': {
      backgroundColor: theme.palette.primary.light,
      marginTop: theme.spacing(-0.6),
      marginBottom: theme.spacing(-0.3),
      paddingRight: theme.spacing(0.75 - 0.3),
      paddingBottom: theme.spacing(0.3),
      border: `${theme.spacing(0.3)}px solid ${theme.palette.primary.main}`,
      borderBottom: `${theme.spacing(0.3)}px none ${theme.palette.primary.light}`,
      marginLeft: theme.spacing(-1),
      zIndex: 1,
      position: 'relative',
      top: theme.spacing(0.3),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(-0.3),
        paddingBottom: 0,
        marginLeft: 0,
        borderBottom: `${theme.spacing(0.3)}px solid ${theme.palette.primary.main}`,
        top: 0,
      },
    },

    '&.open .cardControls': {
      display: 'block',
      backgroundColor: theme.palette.primary.light,
      marginLeft: theme.spacing(-1),

      border: `${theme.spacing(0.3)}px solid ${theme.palette.primary.main}`,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },

    '&.ci_unavailable': {
      '& .cardSerial, & .cardCallsign, & .cardName, & .cardLocation': {
        opacity: 0.35,
      },
      '& .cardTags .MuiChip-root': {
        opacity: 0.35,
      },
      '&.open .cardSerial': {
        opacity: 1,
      },
      '& .cardTags .MuiChip-root.tagUnavailable': {
        opacity: 1,
      },
    },

    '.ci_self & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_self.main,
    },

    '.ci_self & .tagSelf': {
      fontWeight: 'bold',
      color: theme.palette.spotting_self.main,
    },

    '.ci_wanted & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_wanted.main,
    },

    '& .MuiChip-root.tagWanted': {
      color: theme.palette.spotting_wanted.main,
      backgroundColor: theme.palette.spotting_wanted.bg,
      borderColor: theme.palette.spotting_wanted.main,
    },

    '& .tagWanted .MuiSvgIcon-root': {
      color: theme.palette.spotting_wanted.main,
    },

    '& .MuiChip-root.tagWorked': {
      color: theme.palette.spotting_worked.main,
      backgroundColor: theme.palette.spotting_worked.bg,
      borderColor: theme.palette.spotting_worked.main,
    },

    '& .tagWorked .MuiSvgIcon-root': {
      color: theme.palette.spotting_worked.main,
    },

    '.ci_operating & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_operating.main,
    },

    '.ci_operating & .tagOperating': {
      fontWeight: 'bold',
      color: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagOperating': {
      color: theme.palette.spotting_operating.main,
      backgroundColor: theme.palette.spotting_operating.bg,
      borderColor: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagOperating .MuiChip-icon': {
      color: theme.palette.spotting_operating.main,
    },

    '& .MuiChip-root.tagControl': {
      color: theme.palette.spotting_control.main,
      backgroundColor: theme.palette.spotting_control.bg,
      borderColor: theme.palette.spotting_control.main,
    },

    '.ci_worked_callsign & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_worked.main,
    },

    '.ci_confirmed_callsign & .callsign': {
      fontWeight: 'bold',
      color: theme.palette.spotting_worked.main,
      textDecoration: 'strike-thru',
    },

    '.ci_new_state & .fieldState': {
      backgroundColor: theme.palette.spotting_hunting.main,
      color: theme.palette.spotting_hunting.contrastText,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      fontWeight: 'bold',
      borderRadius: '3px',
    },

    '.ci_confirmed_state_mixed & .fieldState': {
      backgroundColor: theme.palette.spotting_hunting_mixed.main,
      color: theme.palette.text.primary,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      borderRadius: '3px',
    },

    '& .MuiChip-root': {
      marginRight: theme.spacing(0.5),
    },

    '& span.segment': {
      marginRight: theme.spacing(1),
      whiteSpace: 'nowrap',
    },

    '& .MuiGrid-root .segment:first-child': {
      marginLeft: 0,
    },

    '& .MuiGrid-root .MuiChip-root:first-child': {
      marginLeft: -theme.spacing(1),
    },

    '& .fieldCallsign': {
      fontWeight: 'bold',
    },

    '& .fieldName': {
      fontWeight: 'bold',
    },
  },
})

export default checkinStyles
