import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import SignIn from './Components/SignIn/SignIn';
import Rank from './Components/Rank/Rank';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'b73bd9e5acfa4706b630034c2e4425d0'
});

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};


class App extends Component {
  //define Constructor
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',
      isSignedIn: false,
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    // console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
    
  }  

  displayFaceBox = (box) => {
    console.log(box);
    this.setState( {box: box } ) 
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onBtnSubmit = () => {
    this.setState({imageUrl: this.state.input});

    app.models
        .predict(
          Clarifai.FACE_DETECT_MODEL, 
          this.state.input)
        .then( (response) => {
                // do something with response
                this.displayFaceBox(this.calculateFaceLocation(response));
                // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
              }
        )
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState( {isSignedIn: false} );
    } else if (route ==='home') {
      this.setState({isSignedIn: true});
    }
    this.setState( {route: route} );
  }

  render() {
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={ this.state.isSignedIn } onRouteChange={ this.onRouteChange }/>
        { this.state.route === 'home' 
          ?  <div> 
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onBtnSubmit={this.onBtnSubmit}
              />
              <FaceRecognition 
                box={this.state.box}
                imageUrl={this.state.imageUrl}
              />
            </div>
          
          : (
              this.state.route === 'signin'
              ? <SignIn onRouteChange={ this.onRouteChange } />
              : <Register onRouteChange={this.onRouteChange} />
              
            )
        }   
      </div>
    );
  }

}

export default App;
