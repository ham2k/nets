const baseStyles = (theme) => ({
  pageRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  pageHeader: {
    flex: 0,
  },
  pageFooter: {
    flex: 0,
  },

  sectionRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionHeaderOuter: {
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(0),
    // [theme.breakpoints.down('xs')]: {
    //   paddingLeft: theme.spacing(2),
    //   paddingRight: theme.spacing(2),
    // },
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },

  overflowContainer: {
    overflow: 'hidden',
    minHeight: 0,
  },

  splitContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
    cursor: 'auto',
  },
  splitDivider: {
    flex: 0,
    borderTop: '1px solid #ccc',
    minHeight: '0.5rem',
    maxHeight: '0.5rem',
    height: '0.5rem',
    cursor: 'row-resize',
    border: '1px solid red',
  },
  splitTop: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
  },
  splitBottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 0,
    overflow: 'hidden',
    minHeight: 0,
    cursor: 'auto',
  },

  netCheckins: {
    flex: 1,
  },
  netMessages: {
    flex: 1,
  },
})

export default baseStyles
