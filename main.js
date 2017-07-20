import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, ListView, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';

import ContactList from './components/contact_list';

export default class App extends Component {
  constructor(props){
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.getContacts = this.getContacts.bind(this)
    this.requestContactPerm = this.requestContactPerm.bind(this)
    this.formatContacts = this.formatContacts.bind(this)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      contactsVis: false,
      contactPerm : null,
      contactsFull: null,
      contactsData: null,
      searchitem: null,
      ds: ds,
    }
  }

  async requestContactPerm(){
    const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
    this.setState({contactPerm: permission.status})
    this.getContacts()
  }

  async getContacts(){
    const contactsFull = await Expo.Contacts.getContactsAsync({
      fields: [ Expo.Contacts.PHONE_NUMBERS ],
      pageSize: 10000,
    });
    const contacts = contactsFull.data.filter((contact) => {
      return contact.phoneNumbers.length > 0;
    })

    const formattedContacts = this.formatContacts(contacts)

    this.setState({
      contactsFull: contactsFull.data,
      contactsData: this.state.ds.cloneWithRows(formattedContacts)
    })
  }

  formatContacts(contacts){
    return contacts.map((contact) => {
      const firstName = contact.firstName.charAt(0).toUpperCase() + contact.firstName.toLowerCase().slice(1)
      const lastName = contact.lastName.charAt(0).toUpperCase() + contact.lastName.toLowerCase().slice(1)
      for (var i = 0; i < contact.phoneNumbers.length; i++) {
        const label = contact.phoneNumbers[i].label ? contact.phoneNumbers[i].label : 'mobile';
        return {
          first: firstName,
          last: lastName,
          subtitle: label,
          phone: contact.phoneNumbers[i].number
        }
      }
    })
  }

  handlePress(){
    if (this.state.contactPerm !== 'granted') {
      alert("We're not the NSA! We need permission to access your contacts. Namaste!")
      this.requestContactPerm()
    } else {
      this.setState({contactsVis: true})
    }
  }

  handleSearch(name){
    const contacts = this.state.contactsFull.filter((contact) => {
      return (contact.name.indexOf(name) != -1)
    })
    const formattedContacts = this.formatContacts(contacts)
    this.setState({
      searchitem: name,
      contactsData: this.state.ds.cloneWithRows(formattedContacts)
    })
  }

  handleClose(){
    this.setState({
      contactsVis: false,
      searchitem: null,
    })
  }

  componentWillMount(){
    if (this.state.contactPerm !== 'granted') this.requestContactPerm()
    else if (this.state.contactsData === null) this.getContacts()
  }

  render(){
    return (
      <View style={styles.container}>

        { this.state.contactsVis
          ? <Modal animationType={"slide"} transparent={false} visible={this.state.isVisable} >
                 <ContactList isVisable={this.state.contactsVis}
                              contacts={this.state.contactsData}
                              searchitem={this.state.searchitem}
                              handleSearch={this.handleSearch}
                              handleClose={this.handleClose}
                              />
            </Modal>
          : null }

        <TouchableOpacity onPress={this.handlePress}>
          <Text style={styles.icon}>🙏</Text>
          <Text style={styles.title}>Send a Namaste</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 100,
  },
  title: {
    fontSize: 27,
  },
});

Expo.registerRootComponent(App);
