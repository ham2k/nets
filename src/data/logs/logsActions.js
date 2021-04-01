import { AdifParser } from 'adif-parser-ts'

import { loadLog, setMeta } from './logsSlice'

export const loadADIF = (uri) => {
  if (uri.startsWith('http')) uri = `/cors-proxy/${uri}`

  return fetch(uri)
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const logData = AdifParser.parseAdi(bodyText)
      return logData
    })
    .catch((error) => {
      console.log('loadADIF error', error)
    })
}

export const loadADIFromUri = ({ uri, source, name }) => (dispatch) => {
  dispatch(setMeta({ loading: true, errors: undefined }))

  return loadADIF(uri).then(
    (data) => {
      name = name || guessNameForADIF(data)
      source = source || uri

      if (source.startsWith('data:')) {
        source = 'data uri'
      }

      data.name = name
      data.source = source
      data.lookup = lookupHashForLog(data)

      dispatch(loadLog({ data, name }))
      dispatch(setMeta({ loading: false, errors: undefined }))
    },
    (error) => {
      console.log('loadADIFAsync error', error)
      dispatch(setMeta({ loading: false, errors: error }))
    }
  )
}

function guessNameForADIF(data) {
  const program = data?.header?.programid || 'Unknown Logger'

  if (data?.records?.[0]?.station_callsign) {
    return `Log for Station ${data.records[0].station_callsign} using ${program}`
  } else if (data?.records?.[0]?.operator) {
    return `Log for Operator ${data.records[0].operator} using ${program}`
  } else if (data?.header?.text) {
    return `Log using ${program}`
  }
}

const AGGREGATED_MODE = {
  AM: 'phone',
  FM: 'phone',
  SSB: 'phone',
  LSB: 'phone',
  USB: 'phone',
  DIGITALVOICE: 'phone',
  C4FM: 'phone',
  DSTAR: 'phone',
  CW: 'cw',
  PCW: 'cw',
  SSTV: 'image',
  FAX: 'image',
  ATV: 'image',
  default: 'data',
}

export const qualifierFor = ({ qsl, band, mode }) => {
  return [
    qsl ? 'qsl' : 'qso',
    band || 'all-bands',
    mode ? AGGREGATED_MODE[mode] || AGGREGATED_MODE.default : 'all-modes',
  ].join('/')
}

export const lookupHashForLog = (log, options) => {
  const lookup = {}

  const appendEntry = (qualifier, lookupName, lookupValue) => {
    lookup[qualifier] = lookup[qualifier] || {}
    lookup[qualifier][lookupName] = lookup[qualifier][lookupName] || {}
    lookup[qualifier][lookupName][lookupValue] = (lookup[qualifier][lookupName][lookupValue] || 0) + 1
  }

  log.records.forEach((record) => {
    let { call, dxcc, country, state, cnty, band, mode, gridsquare } = record
    dxcc = dxcc || ''
    gridsquare = gridsquare ? gridsquare.slice(0, 4) : ''
    country = country || ''
    if (country === 'United States') country = 'USA'
    state = state ? `${state.trim().toUpperCase()} ${country.toUpperCase()}`.trim() : ''
    cnty = cnty ? cnty.trim().toUpperCase() : ''
    const qsl = record.app_qrzlog_status === 'C' || record.lotw_qsl_rcvd === 'Y' || record.qsl_rcvd === 'Y'

    let qualifiers = [qualifierFor({ band, mode }), qualifierFor({ band }), qualifierFor({ mode }), qualifierFor({})]

    if (qsl) {
      qualifiers = qualifiers.concat([
        qualifierFor({ qsl, band, mode }),
        qualifierFor({ qsl, band }),
        qualifierFor({ qsl, mode }),
        qualifierFor({ qsl }),
      ])
    }

    qualifiers.forEach((qualifier) => {
      appendEntry(qualifier, 'callsigns', call)
      if (dxcc) appendEntry(qualifier, 'dxcc', dxcc)
      if (state) appendEntry(qualifier, 'states', [state, country].join(' ').toUpperCase())
      if (gridsquare) appendEntry(qualifier, 'grids', gridsquare)
      if (cnty) appendEntry(qualifier, 'counties', cnty)
    })
  })

  return lookup
}
