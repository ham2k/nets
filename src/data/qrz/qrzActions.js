import { setMeta } from './qrzSlice'
import { AdifParser } from 'adif-parser-ts'

import { loadLog } from '../logs/logsSlice'
import { lookupHashForLog } from '../logs/logsActions'

const BASE_URL = 'https://logbook.qrz.com/api'

const HTML_ENTITIES = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
}

/* ================================================================================================================== */
export const getLogbook = ({ key }) => (dispatch) => {
  dispatch(setMeta({ loading: true, errors: [] }))

  const url = new URL(BASE_URL)
  const body = new URLSearchParams()
  body.append('KEY', key)
  body.append('ACTION', 'FETCH')
  body.append('OPTION', 'MODE:SSB')

  return fetch(`/cors-proxy/${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body,
  })
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        console.log('QRZ Error: bad response')
        throw new TypeError('Bad response')
      }
    })
    .then((bodyText) => {
      const qrz = parseQrzResponse(bodyText)

      const data = qrz.ADIF

      data.name = 'QRZ Logbook'
      data.source = 'https://logbook.qrz.com'
      data.lookup = lookupHashForLog(data)

      dispatch(loadLog({ data, name: 'QRZ Logbook' }))
      dispatch(setMeta({ loading: false, errors: [] }))
    })
    .catch((error) => {
      console.log('QRZ Error', error)
      dispatch(setMeta({ loading: false, errors: 'QRZ Error' }))
    })
}

/*
 * QRZ's API uses an "ad-hoc" encoding style.
 * Requests and responses are key/value pairs, supposedly encoded as "URL-encoded Form Data",
 * with `key=value` pairs separated by `&`.
 *
 * But the values are escaped as HTML, not urls (using `&lt;` instead of `%3C`).
 * And notably, the `&` character is not escaped at all.
 *
 * So we cannot use the standard URL manipulation classes and have to roll our own.
 */

const QRZ_PARSING_REGEXP = /(RESULT|REASON|LOGIDS|LOGID|COUNT|DATA|ADIF|OPTION|KEY|ACTION)=(.*?)(?=\s*$|&\s*(?:RESULT|REASON|LOGIDS|LOGID|COUNT|DATA|ADIF|OPTION|KEY|ACTION)=)/gs
/*
 * `(RESULT|...)` Match (and capture) any of the QRZ parameter names
 * `=` followed by an equal sign
 * `(.*?)` followed by any number of characters (also captured),
 *              but stop as soon as the rest of the regexp matches (the `?` makes the `*` non-greedy)
 * `(?=\s*($|&\s(?:RESULT|...)=)` followed by zero or more spaces
 *              and then either the end of the string (`$`) or another QRZ parameter name
 *    `(?=)` is a lookahead group that is not included in the resulting match
 *    `(?:)` is a non-capturing group
 *
 * `/g` for global search
 * `/s` to allow `.` to also match line breaks
 */

const HTML_ENTITY_REGEXP = /&\w+;/g

function parseQrzResponse(str) {
  const pairs = {}

  str = str.replace(HTML_ENTITY_REGEXP, (match) => HTML_ENTITIES[match] || `[${match}]`)

  let match
  while ((match = QRZ_PARSING_REGEXP.exec(str))) {
    if (match[1] === 'ADIF') {
      pairs[match[1]] = AdifParser.parseAdi(match[2])
    } else {
      pairs[match[1]] = match[2]
    }
  }

  return pairs
}
