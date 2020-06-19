/*
Copyright 2020 Hitachi Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
MIT License

Copyright (c) 2019 Tomasz O.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './TimelineDefault.scss';

const TimelineDefault = (props) => (
  <React.Fragment>
    <div
      className={classNames(
        (props.asSignage ? classes['timeline-as-card'] : ''),
        'timeline timeline-datetime bg-light pt-3 pb-3'
      )}
    >
      {
        // add pill date
        props.showPillDate && (
          <div className='timeline-date'>
            <span 
              className={classNames(
                (props.asSignage ? classes['signage-pill-date'] : ''),
                'badge badge-pill badge-secondary text-nowrap'
              )}
            >
              {props.time.getMonth()}/{props.time.getDate()}
            </span>
          </div>
        )
      }
      <div className='timeline-item pr-3'>
        { /* small icon on the line  */}
        <div className='timeline-icon'>
          <i className={` fa fa-circle-o text-${ props.smallIconColor }`}></i>
        </div>
        <div className='timeline-item-inner pb-0'>
          { /* add date */}
          <span
            className={classNames(
              (props.asSignage ? classes['signage-time'] : ''),
              'timeline-item-time'
            )}
          >
            {(props.time.getHours() < 10 ? '0' : '') + props.time.getHours()}:
            {(props.time.getMinutes() < 10 ? '0' : '') + props.time.getMinutes() }
          </span>
          <div className='timeline-item-head pb-0'>
            {
              // circle icon or thumbnail
              props.iconCircle && (
                <div className='pull-left mr-2'>
                  <span className='fa-stack fa-lg'>
                    <i className={` fa fa-circle fa-stack-2x text-${props.iconCircleColor}`}></i>
                    <i className={` fa fa-stack-1x text-white fa-${props.iconCircle}`}></i>
                  </span>
                </div>
              ) || (
                <div className='pull-left mr-2'>
                  <img className={classNames(classes['signage-img'], 'mt-2 mb-4')}
                    src={props.logo}
                    alt={''}
                  />
                </div>
              )
            }
            {/* title and contents */}
            <div className='user-detail'>
              <h6 className={classNames(classes['signage-title'], 'mb-0')}>
                { props.title }
              </h6>
              <p className='lead'>
                { props.subtitle }
              </p>
            </div>
          </div>
          <div className="timeline-item-content">
            <div className={classNames(classes['signage-lead'])}>
              {props.lead}
            </div>
            <p className={classNames(classes['signage-content'])}>
              { props.content }
            </p>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
)

TimelineDefault.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  showPillDate: PropTypes.bool,
  asSignage: PropTypes.bool,
  smallIconColor: PropTypes.string,
  iconCircleColor: PropTypes.string,
  iconCircle: PropTypes.string,
};

TimelineDefault.defaultProps = {
  showPillDate: false,
  asSignage: false,
};

export { TimelineDefault };
