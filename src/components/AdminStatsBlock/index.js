import React, { Component } from 'react';
import CircleStat from '../CircleStat';

export default class AdminStatsBlock extends Component {
    render() {
        return (
            <div className={"col-xs-12"}>
                <section className={"stats-block col-xs-12 col-sm-10"}>
                    {this.props.stats.map((stat, i) => (
                        <CircleStat key={i}
                            data={
                                {
                                    current: stat.current,
                                    title: stat.title,
                                    goal: stat.goal
                                }
                            }
                        />
                    ))}
                </section>
                <section className={"col-xs-12 col-sm-2"}>
                    {this.props.children}
                </section>
            </div>
        );
    }
}

AdminStatsBlock.propTypes = {
    stats: React.PropTypes.array,
};
