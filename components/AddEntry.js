import React, { Component } from "react"
import { View, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import UdaciSlider from "./UdaciSlider"
import UdaciSteppers from "./UdaciSteppers"
import DateHeader from "./DateHeader"
import TextButton from "./TextButton"

import { submitEntry, removeEntry } from '../utils/api'
import { connect } from "react-redux"
import { addEntry } from "../actions"

const SubmitButton = ({ onSubmit }) => (
    <TouchableOpacity onPress={onSubmit}>
        <Text>Submit</Text>
    </TouchableOpacity>
)

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)
        const currentValue = this.state[metric]
        this.setState({
            [metric]: Math.min(currentValue + step, max)
        })
    }
    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric)
        const currentValue = this.state[metric]
        this.setState({
            [metric]: Math.max(currentValue - step, 0)
        })
    }

    slide = (metric, value) => this.setState({ [metric]: value })

    submit = () => {
        const key = timeToString()
        const entry = this.state

        this.props.dispatch(addEntry({ [key]: entry }))

        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        })
        //navigate to home
        submitEntry({ entry, key })
        // clear local notification
    }

    reset = () => {
        const key = timeToString()
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        // route to home
        removeEntry(key)
        alert('reset!')
    }
    render() {
        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name='md-happy'
                        size={100}
                    />
                    <Text>You've already logged your info for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                        </TextButton>
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={new Date().toLocaleDateString()} />

                {Object.keys(metaInfo).map(metric => {
                    const { getIcon, type, ...rest } = metaInfo[metric]
                    const value = this.state[metric]
                    return (
                        <View key={metric}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider value={value}
                                    onChange={value => this.slide(metric, value)}
                                    {...rest} />

                                : <UdaciSteppers value={value}
                                    onIncrement={() => this.increment(metric)}
                                    onDecrement={() => this.decrement(metric)}
                                    {...rest} />}
                        </View>
                    )
                })}
                <SubmitButton onSubmit={this.submit} />
            </View>
        )
    }
}
function mapStateToProps(state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry) 