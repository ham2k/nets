const baseStyles = (theme) => ({
  pageRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,

    maxHeight: '100%',

    '& .SplitPane .Pane': {
      overflow: 'hidden',
      minHeight: 0,
    },
    '& .SplitPane .Pane > div': {
      minHeight: '100%',
    },
  },
  pageHeader: {
    flex: 0,
  },
  pageFooter: {
    flex: 0,
  },

  sectionRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',

    '&.MuiAccordion-root': {
      flex: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',

      marginTop: '2px !important',
      marginBottom: 0,

      '&:before': {
        height: '0px',
      },
      '&:after': {
        height: '0px',
      },
    },

    '&.MuiAccordion-root.Mui-expanded': {
      flex: 1,

      '&:before': {
        height: '0px',
      },
    },
    '& .MuiAccordionSummary-root': {
      maxWidth: theme.breakpoints.values.md,
      minWidth: theme.breakpoints.values.xs,
      width: '100%',

      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(0.5),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
    },
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 0,
      marginBottom: 0,
    },
    '& .MuiCollapse-container': {
      maxWidth: theme.breakpoints.values.md,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'stretch',
    },
    '& .MuiCollapse-wrapper': {
      maxWidth: theme.breakpoints.values.md,
      width: '100%',
      flex: 1,
    },
    '& .MuiCollapse-wrapperInner': {
      maxWidth: theme.breakpoints.values.md,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'stretch',
    },
    '& .MuiCollapse-wrapperInner > div[role="region"]': {
      maxWidth: theme.breakpoints.values.md,
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'stretch',
    },
    '& .MuiAccordionDetails-root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'stretch',

      maxWidth: theme.breakpoints.values.md,

      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
      },
    },

    '&.h2k-full-bleed .MuiCollapse-container': {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
      border: 0,
      padding: 0,
    },
    '&.h2k-full-bleed .MuiCollapse-wrapper': {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
    },
    '&.h2k-full-bleed .MuiCollapse-wrapperInner': {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
    },
    '&.h2k-full-bleed .MuiCollapse-wrapperInner > div[role="region"]': {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
    },
    '&.h2k-full-bleed .MuiAccordionDetails-root': {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
      border: 0,
      padding: 0,
    },
    '&.h2k-full-bleed .MuiAccordionDetails-root > *': {
      width: '100%',
    },

    '&.h2k-overflow-container': {
      position: 'relative',
    },
    '&.h2k-overflow-container .MuiCollapse-container.MuiCollapse-hidden ': {
      height: 0,
    },
    '&.h2k-overflow-container .MuiCollapse-container.MuiCollapse-entered ': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    '&.h2k-overflow-container .MuiCollapse-wrapper': {
      overflow: 'hidden',
      minHeight: 0,
      flex: 1,
      position: 'relative',
    },
    '&.h2k-overflow-container .MuiCollapse-wrapperInner': {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    '&.h2k-overflow-container .MuiCollapse-wrapperInner > div[role="region"]': {
      overflow: 'hidden',
      minHeight: 0,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    '&.h2k-overflow-container .MuiCollapse-entered .MuiAccordionDetails-root': {
      flex: 1,
      overflow: 'hidden',
    },
    '&.h2k-overflow-container.h2k-scrollable-vert .MuiAccordionDetails-root': {
      overflowY: 'auto',
    },
  },

  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 100,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTypography-h2': {
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    '& .MuiTypography-h3': {
      fontSize: '1rem',
      fontWeight: 'normal',
    },
  },

  sectionIcon: {
    fontSize: 30,
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },

  sectionIndented: {
    marginLeft: theme.spacing(2),
  },

  overflowContainer: {
    overflow: 'hidden',
    minHeight: 0,
  },
})

export default baseStyles
