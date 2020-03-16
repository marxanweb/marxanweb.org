/*global gapi*/
import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {VM_instances: []};
  }
  login() {
    //get the OAuth2 client library
    this.loadOAuth2Client().then(() => {
      //authenticate the user
      this.authenticate().then(() => {
        //load the Compute API
        this.loadClient().then(()=>{
          //get the list of instances
          this.getGCPVMs();
        });
      });
    });
  }
  loadOAuth2Client() {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", function() {
        gapi.auth2.init({ client_id: "956491209288-m1fj9h3udhiviuj0hdvajrp8o7pn13g8.apps.googleusercontent.com" });
        resolve();
      });
    });
  }
  authenticate() {
    return gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/compute.readonly" })
      .then(function() { console.log("Sign-in successful"); },
        function(err) { console.error("Error signing in", err); });
  }
  loadClient() {
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/compute/v1/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
        function(err) { console.error("Error loading GAPI client for API", err); });
  }
  getGCPVMs() {
    return gapi.client.compute.instances.list({
        "project": "marxan-web",
        "zone": "us-central1-a",
      })
      .then((response) =>{
          console.log("Response", response);
          this.setState({VM_instances: response.result.items});
        },
        function(err) { console.error("Execute error", err); });
  }
  render() {
    return (
      <div>
        <div>Marxan Web</div>
        <button onClick={this.login.bind(this)}>authorize and load</button>
    </div>
    );
  }
}

export default App;
