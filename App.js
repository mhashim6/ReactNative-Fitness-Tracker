import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

import AddEntry from "./components/AddEntry"
export default class App extends React.Component {
  store = createStore(reducer)
  render() {
    return (
      <Provider store={this.store}>
        <SafeAreaView>
          <AddEntry />
        </SafeAreaView>
      </Provider>
    );
  }
}
