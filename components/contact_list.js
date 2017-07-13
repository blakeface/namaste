import React, { Component } from 'react';
import { StyleSheet, Modal, View, Text, TouchableHighlight, TextInput, ListView } from 'react-native';

import ContactRow from './contact_row';

class ContactList extends Component {
  constructor(props){
    super(props)

    this.renderModalBody = this.renderModalBody.bind(this)
    this.handlePress = this.handlePress.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      searchitem: null,
      isVisable: props.isVisable,
      contacts: props.contacts,
    }
  }

  componentWillReceiveProps(vis, contacts){
    this.setState({
      isVisable: vis,
      contacts: contacts
    })
  }

  handlePress(){
    this.setState({ isVisable: false })
  }

  handleSearch(name){
    this.setState({ searchitem: name })
  }

  renderModalBody(){
    if (this.state.contacts === null) {
      return (
        <View style={styles.modalError}>
          <Text>🤔 Having some trubs getting your contacts.</Text>
          <Text>Let's try this again. Namaste 🙏</Text>
          <TouchableHighlight onPress={this.handlePress} >
            <Text>Close</Text>
          </TouchableHighlight>
        </View>
      )
    } else return (
      <View style={styles.modalSuccess}>
        <TextInput onChangeText={this.handleSearch}
                   value={this.state.searchitem}
                   style={styles.searchBar}
                   />
        <ListView dataSource={this.state.contacts}
                  renderRow={(data) => <ContactRow {...data} />}
                  renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                  />
        <TouchableHighlight onPress={this.handlePress} >
          <Text>Close</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <Modal animationType={"slide"}
             transparent={false}
             visible={this.state.isVisable} >
        { this.renderModalBody() }
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 30,
  },
  modalSuccess: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
    height: '90%',
  },
  searchBar: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    width: '100%',
    height: 30,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})

export default ContactList;
