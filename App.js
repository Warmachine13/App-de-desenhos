import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Image,
  PermissionsAndroid,
  CameraRoll,
  Dimensions
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial
} from 'react-native-admob'
let { width, height } = Dimensions.get('window');

//import { RNCamera } from 'react-native-camera';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';


export default class example extends Component {

  state = {
    example: 0,
    color: '#000',
    thickness: 5,
    message: '',
    photoPath: null,
    scrollEnabled: true,
    photos: [],
    uri: null
  }



  takePicture = async function () {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      this.setState({
        photoPath: data.uri.replace('file://', '')
      })
    }
  };

  async  requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permissão de fotos',
          message:
            'Permissão de fotos' +
            'Pegar suas fotos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissão de fotos',
            message:
              'Permissão de fotos' +
              'Pegar suas fotos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
          this._handleButtonPress();

        this._handleButtonPress();
      } else
        console.warn('Camera permission denied');

    } catch (err) {
      console.warn(err);
    }
  }
  _handleButtonPress = () => {
    CameraRoll.getPhotos({
      first: 300,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        //console.warn(err)
        //Error Loading Images
      });
  };

  componentDidMount() {
    // AdMobInterstitial.setTestDeviceID('EMULATOR');
    AdMobInterstitial.setAdUnitID('ca-app-pub-3408462666302033/7981755939');

    this.showAd = () => AdMobInterstitial.requestAd().then(() =>
      AdMobInterstitial.showAd()
    );
    this.requestCameraPermission()
  }

  render() {
    let { photos, example, uri } = this.state;
    // console.warn(uri);

    return (
      <View style={styles.container}>
        {
          example === 0 &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 30, fontFamily: 'serif' }}>
              Desenhos top
          </Text>
            <View style={{ justifyContent: 'center', alignContent: 'center', width: '80%', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: 'red',
                  alignContent: 'center',
                  justifyContent: 'center',
                  borderColor: 'black',
                  borderWidth: 0.6,
                  height: 50,
                  margin: 20,
                  borderRadius: 25,
                  borderStyle: "dotted"
                }} onPress={() => {
                  this.setState({ example: 1 })
                }}>
                <Text style={{ alignSelf: 'center', fontSize: 22, fontFamily: 'monospace', textAlign: 'center', color: '#0971B3' }}>Desenho livre</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
                width: '100%',
                backgroundColor: '#51007F',
                alignContent: 'center',
                justifyContent: 'center',
                borderColor: 'black',
                borderWidth: 0.6,
                height: 50,
                margin: 20,
                borderRadius: 25,
                borderStyle: "dotted"
              }} onPress={() => {
                this.setState({ example: 5 })
              }}>
                <Text style={{ color: '#0DA1FF', alignSelf: 'center', fontSize: 22, fontFamily: 'monospace', textAlign: 'center' }}>Desenho com foto</Text>
              </TouchableOpacity>

              <View style={{ bottom: 0 }}>
                <AdMobBanner
                  adSize="largeBanner"
                  adUnitID="ca-app-pub-3408462666302033/4924347752"
                  testDevices={[AdMobBanner.simulatorId]}
                  onAdFailedToLoad={error => console.warn(error)}
                />

              </View>
            </View>
          </View>
        }

        {
          example === 1 &&
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <RNSketchCanvas
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
              canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}

              onStrokeEnd={data => {
              }}
              closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Fechar</Text></View>}
              onClosePressed={() => {
                this.setState({ example: 0 })
                this.showAd();
              }}
              undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Voltar</Text></View>}
              onUndoPressed={(id) => {
                // Alert.alert('do something')
              }}
              clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Limpar</Text></View>}
              onClearPressed={() => {
                // Alert.alert('do something')
              }}
              eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Borracha</Text></View>}

              strokeComponent={color => (
                <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
              )}

              strokeSelectedComponent={(color, index, changed) => {
                return (
                  <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                )
              }}

              strokeWidthComponent={(w) => {
                return (
                  <View style={styles.strokeWidthButton}>
                    <View style={{
                      backgroundColor: 'lightgray',
                      width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                    }} />
                  </View>
                )
              }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
              savePreference={() => {
                return {
                  folder: "RNSketchCanvas",
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: "png"
                }
              }}
              onSketchSaved={(success, path) => {
                Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
              }}
              onPathsChange={(pathsCount) => {
                console.log('pathsCount', pathsCount)
              }}
            />
          </View>
        }

        {
          example === 5 && !uri &&
          <ScrollView>
            {photos.map((p, i) => {
              return (
                <TouchableHighlight onPress={() => this.setState({ uri: p.node.image.uri })}>
                  <Image
                    key={i}
                    style={{
                      width,
                      height: height / 3,
                    }}
                    source={{ uri: p.node.image.uri }}
                  />
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        }

        {
          uri &&
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <RNSketchCanvas
              //  localSourceImage={{ filename: 'whale.png', directory: SketchCanvas.MAIN_BUNDLE, mode: 'AspectFit' }}
              localSourceImage={{ filename: uri.replace('file://', ''), directory: null, mode: 'AspectFit' }}
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
              canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
              onStrokeEnd={data => {
              }}

              closeComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Fechar</Text></View>}
              onClosePressed={() => {
                this.setState({ example: 0, uri: undefined })
                this.showAd();
              }}
              undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Voltar</Text></View>}
              onUndoPressed={(id) => {
                // Alert.alert('do something')
              }}
              clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Limpar</Text></View>}
              onClearPressed={() => {
                // Alert.alert('do something')
              }}
              eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Borracha</Text></View>}

              strokeComponent={color => (
                <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
              )}

              strokeSelectedComponent={(color, index, changed) => {
                return (
                  <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                )
              }}
              strokeWidthComponent={(w) => {
                return (<View style={styles.strokeWidthButton}>
                  <View style={{
                    backgroundColor: 'white', marginHorizontal: 2.5,
                    width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                  }} />
                </View>
                )
              }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
              savePreference={() => {
                return {
                  folder: 'RNSketchCanvas',
                  filename: String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  includeImage: false,
                  cropToImageSize: false,
                  imageType: 'jpg'
                }
              }}
              onSketchSaved={(success, path) => {
                Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
              }}
              onPathsChange={(pathsCount) => {
                console.log('pathsCount', pathsCount)
              }}
            />
          </View>
        }


      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,

  },
  strokeWidthButton: {
    // marginLeft: 110,
    // marginTop: 40,
    marginHorizontal: 2.5,
    marginVertical: 11,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111'
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 35,
    width: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: 'darkslategray',
    borderWidth: 2,
    borderRadius: 6,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignSelf: 'stretch'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
  page: {
    flex: 1,
    height: 300,
    elevation: 2,
    marginVertical: 8,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 2
  }
});

AppRegistry.registerComponent('example', () => example);