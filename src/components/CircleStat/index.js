import React, { Component } from 'react';
import classNames from 'classnames';
import * as constants from '../../common/constants';
import { Circle } from 'rc-progress';

import ReactFitText from 'react-fittext';

export default class CircleStat extends Component {
  valueWithPrefix(){
    const prefix = this.props.data.prefix || '';
    const value = Math.round(this.props.data.current);
    return `${prefix}${value}`;
  }

  render() {
    let percentage = 0;

    if(this.props.data.current && this.props.data.goal){
        percentage = this.props.data.current / this.props.data.goal * 100;
    }

    return (
      <div className="stat-progress-container">
        <div
          className={classNames(
            'stat-progress',
            {
              'stat-progress-circle__empty': !this.props.data.goal,
            }
          )}
        >
          <Circle
            percent={Math.min(percentage, 100)}
            strokeWidth={constants.STAT_PROGRESS_WIDTH}
          />
            <div className="stat-content">
              <ReactFitText compressor={0.4}>
                <span className="stat-current">
                  {this.valueWithPrefix()}
                </span>
              </ReactFitText>
              <ReactFitText compressor={0.75}>
                <span className="stat-title">{this.props.data.title}</span>
              </ReactFitText>
            </div>
        </div>
      </div>
    );
  }
}

CircleStat.propTypes = {
  data: React.PropTypes.shape({
    goal: React.PropTypes.number,
    current: React.PropTypes.number,
    title: React.PropTypes.string,
    prefix: React.PropTypes.string,
  }),
};
