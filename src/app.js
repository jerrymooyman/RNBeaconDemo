/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  DeviceEventEmitter
} from 'react-native';
import Beacons from 'react-native-beacons-manager'
import BluetoothState from 'react-native-bluetooth-state'

export default class RNBeaconDemo extends Component {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      bluetoothState: '',
      identifier: 'Oven',
      uuid: '36cc3cfc-5b54-43f2-8686-37b2032d9737',
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillMount() {

    // request for auth
    Beacons.requestWhenInUseAuthorization();

    // define region
    const region = {
      identifier: this.state.identifier,
      uuid: this.state.uuid
    }

    // range for beacons inside the region
    Beacons.startRangingBeaconsInRegion(region)
    // Beacons.startUpdatingLocation()
  }
  
  componentDidMount() {
    // Listen to beacon changes
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.beacons)
        })
      }
    )

    // listen bluetooth state change event
    BluetoothState.subscribe(
      bluetoothState => {
        this.setState({ bluetoothState })
      }
    )
    BluetoothState.initialize()
  }

  componentWillUnmount() {
    this.beaconsDidRange = null
  }

  renderRow = rowData => {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: { rowData.uuid ? rowData.uuid : 'NA' }
        </Text>
        <Text style={styles.smallText}>
          Major: { rowData.major ? rowData.major : 'NA' }
        </Text>
        <Text style={styles.smallText}>
          Minor: { rowData.minor ? rowData.minor : 'NA' }
        </Text>
        <Text style={styles.smallText}>
          Proximity: { rowData.proximity ? rowData.proximity : 'NA' }
        </Text>
        <Text style={styles.smallText}>
          Distance: { rowData.accuracy ? rowData.accuracy : 'NA' }
        </Text>

      </View>
    )
  }

  render() {
    const { bluetoothState, dataSource } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.bluetoothConnectionStatus}>
          Bluetooth connection status: { bluetoothState ? bluetoothState : 'NA'}
        </Text>
        <Text style={styles.headline}>
          All beacons in the area
        </Text>
        <ListView 
          dataSource={ dataSource }
          enableEmptySections
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bluetoothConnectionStatus: {
    fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    fontSize: 8,
    paddingTop:16 
  },
  smallText: {
    fontSize: 11
  }
});

AppRegistry.registerComponent('RNBeaconDemo', () => RNBeaconDemo);