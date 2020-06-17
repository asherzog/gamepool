import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from '@material-ui/core/Container'
import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login'

const responseGoogle = (response) => {
  console.log(response);
}

const responseFacebook = (response) => {
  console.log(response);
}
  
function App() {
  return (
    <Container maxWidth="sm" className="App">
      <img src={logo} className="App-logo" alt="logo" />
      Boogers
      <GoogleLogin
        clientId="636575399542-nkquvi1i6ign98otdc1sg8jt6ie6gc34.apps.googleusercontent.com"
        buttonText="Login With Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'} />
      OR
      <FacebookLogin
        appId="2341659142804664"
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook} />
    </Container>
  );
}

export default App;
