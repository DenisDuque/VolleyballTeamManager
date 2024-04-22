import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Logo from '../../../assets/logo.png'

const login = () => {
  return (
    <View>
      <Image 
        source={Logo} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
  )
}

export default login

const styles = StyleSheet.create({
  logo: {
    width: '5rem',
  }
})