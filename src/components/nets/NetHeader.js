import React from 'react'
import classNames from 'classnames'

export default function NetHeader({ net, className, onViewChange, currentView }) {
  return (
    <div className={classNames(className, 'NetHeader flex-col-center')}>
      <section className="flex-row-stretch plr-100 pb-100">
        <div className="flex-row-baseline ">
          <div className="flex-2">
            <h2>{net.NetName}</h2>
            <div className="secondary">
              {net.Band} • {net.Frequency} MHz {net.Mode}
              {' • '}
              <span>Started at {new Date(net.Date).toLocaleTimeString([], { timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
