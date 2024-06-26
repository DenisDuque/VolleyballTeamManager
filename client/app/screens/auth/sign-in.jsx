import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../../assets/ball.png';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.0.30:3000';

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, introduce tu correo electrónico y contraseña.');
      return;
    }
  
    try {
      const response = await fetch('http://'+ apiUrl +'/users/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('Inicio de sesión exitoso:', userData);
        setUser(userData);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Error logging in. Please try again later.');
    }
  };  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode='contain' />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign in to your account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <Button style={styles.button} title="Sign in" onPress={handleLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1F24',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 128,
    height: 128,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    color: '#539DF3',
  }
});