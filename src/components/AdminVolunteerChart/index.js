import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';
import classNames from 'classnames';
import * as Constants from '../../common/constants.js';
import moment from 'moment';

let node = null;
let previous = null;
let next = null;

export default class AdminVolunteerChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previousVisible: false,
            nextVisible: false,
            totalHours: 0,
            graphData: [],
            currentDay: 1,
        };
    }

    componentWillMount() {
        this.prepareGraphData(this.props.data);
    }

    componentDidMount() {
        node = document.getElementById('graph');
        previous = document.getElementById('previous');
        next = document.getElementById('next');

        if (node.scrollWidth - node.offsetWidth !== 0) {
            this.setState({ nextVisible: true });
        }
    }

    componentWillUnmount() {
        node = null;
        previous = null;
        next = null;
    }

    getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    getDaysWithHours = () => {
        return this.props.data.length;
    };

    prepareGraphData = (rawData) => {
        const daysInMonth = this.getDaysInMonth(this.props.currentMonth, this.props.currentYear);

        rawData.map((dataPoint, i) => {
            if (dataPoint.date.getMonth() === this.props.currentMonth) {
                if (i >= 1 && dataPoint.date.getDate() === this.state.graphData[this.state.graphData.length - 1].date.getDate()) {
                    // If this datePoint is for the same day of the last preccessed date
                    // Increment this.state.totalHours
                    this.state.totalHours += dataPoint.new;

                    // Update the last precessed entry
                    const lastItem = this.state.graphData.slice(-1)[0];

                    lastItem.total = this.state.totalHours;
                    lastItem.new += dataPoint.new;

                    this.state.graphData[this.state.graphData.length - 1] = lastItem;
                } else {
                    // Increment this.state.totalHours
                    this.state.totalHours += dataPoint.new;
                    dataPoint.total = this.state.totalHours;

                    // push data
                    this.state.graphData.push(dataPoint);
                    this.state.currentDay++;
                }
            }
        });

        if (Constants.GRAPH_ACTIVATE_EMPTY_BARS && !(this.state.currentDay > daysInMonth)) { // If month is incomplete
            const diff = daysInMonth - this.state.graphData.length;

            // Add missing item(s)
            for (let i = 0; i < diff; i++) {
                this.state.graphData.push({
                    'new': 0,
                    total: this.state.totalHours,
                });
                this.state.currentDay++;
            }
        }
    };

    animate = (increment) => {
        const endValue = node.scrollLeft + increment;

        const loop = setInterval(
            () => {
                node.scrollLeft += increment / 5;
                if (
                    node.scrollLeft === 0
                    || node.scrollLeft >= (node.scrollWidth - node.offsetWidth)
                    || (increment > 0 && node.scrollLeft > endValue)
                    || (increment < 0 && node.scrollLeft < endValue)
                ) {
                    clearInterval(loop);
                }

                // Hide / show scroll buttons
                if (node.scrollLeft === 0 && this.state.previousVisible === true) {
                    this.setState({ previousVisible: false });
                } else {
                    this.setState({ previousVisible: true });
                }

                if (node.scrollLeft >= (node.scrollWidth - node.offsetWidth) && this.state.nextVisible === true) {
                    this.setState({ nextVisible: false });
                } else {
                    this.setState({ nextVisible: true });
                }
            }, 30
        );
    };

    scrollLeft = () => {
        this.animate(-Constants.GRAPH_SCROLL_INCREMENT);
    };

    scrollRight = () => {
        this.animate(Constants.GRAPH_SCROLL_INCREMENT);
    };

    render() {
        const container = ReactFauxDOM.createElement('div');

        // Width and height
        const barPadding = 5;
        const barWidth = 20;

        const w = Constants.GRAPH_ACTIVATE_EMPTY_BARS
                    ? (this.getDaysInMonth(this.props.currentMonth, this.props.currentYear) * (barWidth + barPadding))
                    : (this.getDaysWithHours() * (barWidth + barPadding));

        const h = 320;
        const innerH = h - 65;
        let maxOfGoalAndTotalHours;

        if (this.state.totalHours < this.props.goal) {
            maxOfGoalAndTotalHours = this.props.goal;
        } else {
            maxOfGoalAndTotalHours = this.state.totalHours;
        }
        const borderRadius = 7;

        let svg = d3.select(container)
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        svg.selectAll('bar')
            .data(this.state.graphData)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                return i * (barWidth + barPadding);
            })
            .attr('y', 0)
            .attr('width', barWidth)
            .attr('height', h)
            .attr('fill', (d, i) => {
                if (d.date) {
                    return 'rgb(110, 107, 108)';
                } else {
                    return 'rgb(218, 218, 218)';
                }
            });

        svg.selectAll('total')
            .data(this.state.graphData)
            .enter()
            .append('rect')
                .attr('x', (d, i) => {
                    return i * (barWidth + barPadding);
                })
                .attr('y', (d) => {
                    return h - (d.total / maxOfGoalAndTotalHours * innerH);
                })
                .attr('width', barWidth)
                .attr('height', (d) => {
                    return d.total / maxOfGoalAndTotalHours * innerH;
                })
                .attr('rx', borderRadius)
                .attr('ry', borderRadius)
                .attr('fill', (d, i) => {
                    if (d.date) {
                        return 'rgb(53, 51, 52)';
                    } else {
                        return 'rgb(204, 204, 204)';
                    }
                });

        svg.selectAll('new')
            .data(this.state.graphData)
            .enter()
            .append('rect')
                .attr('x', (d, i) => {
                    return i * (barWidth + barPadding);
                })
                .attr('y', (d) => {
                    return h - (d.total / maxOfGoalAndTotalHours * innerH);
                })
                .attr('width', barWidth)
                .attr('height', (d) => {
                    return d.new / maxOfGoalAndTotalHours * innerH;
                })
                .attr('rx', borderRadius)
                .attr('ry', borderRadius)
                .attr('fill', 'rgb(189, 212, 66)')
                .append('title')
                        .text((d) => { return d.new + ' hrs'; });

        svg.selectAll('text')
            .data(this.state.graphData)
            .enter()
            .append('text')
                .text((d) => {
                    if (d.date) {
                        const year = d.date.getFullYear();
                        let month = d.date.getMonth() + 1;
                        let day = d.date.getDate();

                        if (month.toString().length === 1) {
                            month = `0${month}`;
                        }
                        if (day.toString().length === 1) {
                            day = `0${day}`;
                        }

                        return `${year}-${month}-${day}`;
                    } else {
                        return '';
                    }
                })
                .attr('x', (d, i) => {
                    return -60;
                })
                .attr('y', (d, i) => {
                    return i * (barWidth + barPadding) + 14;
                })
                .attr('font-family', 'sans-serif')
                .attr('font-size', '11px')
                .attr('fill', 'white')
                .attr('transform', 'rotate(-90)');

        return (
            <div className={'graph-container'}>

                {
                    this.state.graphData.length > 0 ?
                    (
                        <div>
                            <div
                                className={classNames({
                                    'scroll-button__visible': this.state.previousVisible,
                                    'scroll-button__hidden' : !this.state.previousVisible,
                                })}
                                id="previous"
                                onClick={this.scrollLeft}
                            >
                                <i className="fa fa-chevron-left"/>
                            </div>

                            <div id="graph">
                                {container.toReact()}
                            </div>

                            <div
                                className={classNames({
                                    'scroll-button__visible': this.state.nextVisible,
                                    'scroll-button__hidden' : !this.state.nextVisible,
                                })}
                                id="next"
                                onClick={this.scrollRight}
                            >
                                <i className="fa fa-chevron-right"/>
                            </div>
                        </div>
                    )
                    :
                        <div id={'empty-graph'}>
                            <img src={'/assets/images/empty-graph.png'}/>
                        </div>
                }


                <div className={'legends'}>
                    <div className="legend legend-new"><span className={'circle'}></span>{'New hours'}</div>
                    <div className="legend legend-total"><span className={'circle'}></span>{'Combined hours'}</div>
                </div>
            </div>
        )
    }
}

AdminVolunteerChart.propTypes = {
    data: React.PropTypes.array,
    goal: React.PropTypes.number,
    currentMonth: React.PropTypes.number,
    currentYear: React.PropTypes.number,
};
