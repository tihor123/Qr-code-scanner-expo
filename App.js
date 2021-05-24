import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import QrScanner from './Components/QrScanner';
import { FectCityDetails } from './Services/Temperature';
import AsyncStorage from '@react-native-community/async-storage';

export default class App extends Component {

  state = {
    modalVisible: false,
    cityDetails: []
  }

  componentDidMount = async () => {
    var a = await AsyncStorage.getItem("cityDetails");
    console.log("a", a)
    var details = JSON.parse(a);
    var updatedDetails = [];
    details.forEach(element => {
      FectCityDetails(element.city, (data) => {
        console.log("data", data)
        if (data.cod == "200") {
          var cityData = {
            city: element.city,
            temperature: (data.main.temp - 273.15).toFixed(2),
            id: data.id
          }
          this.setState({ cityDetails: [...this.state.cityDetails, cityData] })
        }
        else {
          this.setState({ cityDetails: [...this.state.cityDetails, element] })
        }
      })
    });
  }
  _renderItem = ({ item }) => (
    <View style={[styles.buttonView,{marginBottom:2}]} key={item.id}>
      <Text>{item.city}</Text>
      <Text>{item.temperature}</Text>
    </View>
  )

  openModal = () => {
    this.setState({ modalVisible: true });
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  fetchCityDetails = (city) => {
    console.log(city)
    var cityExists = false;
    if (this.state.cityDetails.length > 0) {
      this.state.cityDetails.forEach(element => {
        if (element.city == city) {
          cityExists = true
        }
      });
    }

    if (cityExists) {
      alert("City already exists")
    }
    else {
      FectCityDetails(city, async (data) => {
        if (data.cod == "200") {
          let CurrentCityDetais = {
            city,
            temperature: (data.main.temp - 273.15).toFixed(2),
            id: data.id
          }

          this.setState({ cityDetails: [...this.state.cityDetails, CurrentCityDetais] })
          await AsyncStorage.setItem('cityDetails', JSON.stringify(this.state.cityDetails))
        }
        else {
          alert("Given city not found")
        }

      });
    }


  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>TEMPERATURE</Text>
        </View>

        <StatusBar style='light' />
        <View style={styles.content}>
          <View style={styles.buttonView}>
            <Text style={styles.boldText2}>CITY</Text>
            <Text style={styles.boldText2}>TEMPERATURE (In Celcius)</Text>
          </View>
          <View style={{marginTop:4}}>
            <FlatList
              data={this.state.cityDetails}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
            />
          </View>

        </View>
        <TouchableOpacity style={styles.button} onPress={this.openModal}>
          <Text style={[styles.text, styles.boldText]}>ADD CITY</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.toggleImage}
        >
          <QrScanner closeModal={this.closeModal} fetchCityDetails={this.fetchCityDetails} />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingVertical: 26,
    backgroundColor: '#000'
  },
  headerText: {
    color: '#fff',
    paddingHorizontal: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  content: {
    flex: 1,
    padding: 8,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 14
  },
  text: {
    color: '#fff'
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  boldText2: {
    fontWeight: 'bold',
    fontSize: 15
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})