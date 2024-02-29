/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';

function App(): React.JSX.Element {
  const [url, setUrl] = useState('');
  const [loader, setLoader] = useState(false);

  const handleScan = async () => {
    setLoader(true);
    if (url !== '') {
      console.log('url');
      await BarCodeScanner.scanFromURLAsync(url)
        .then(val => {
          if (val && val.length > 0) {
            setLoader(false);
            Alert.alert('Decoded text: ', val[0].data);
          }
        })
        .catch(err => {
          console.log('err', err);
          setLoader(false);
        });
    }
  };
  const openImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        await BarCodeScanner.scanFromURLAsync(imageUri)
          .then(val => {
            if (val && val.length > 0) {
              setLoader(false);
              Alert.alert('Decoded text: ', val[0].data);
            }
          })
          .catch(err => {
            console.log('err', err);
            setLoader(false);
          });
      }
    });
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.Heading}>Login</Text>
      <View style={{paddingTop: 30, width: '90%'}}>
        <TextInput
          style={styles.input}
          placeholder="Enter URL for file"
          onChangeText={e => setUrl(e)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              alignItems: 'center',
              height: 35,
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={handleScan}>
            {loader ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: 'white'}}>Scan</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{width: '50%', marginLeft: 10}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'grey',
              alignItems: 'center',
              height: 35,
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={openImagePicker}>
            <Text style={{color: 'white'}}>Upload from gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  Heading: {
    fontSize: 20,
    fontWeight: '400',
  },
  input: {
    // backgroundColor: 'red',
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 5,
    height: 40,
    padding: 10,
  },
  buttonContainer: {
    paddingTop: 20,
    display: 'flex',

    flexDirection: 'row',
  },
});

export default App;
