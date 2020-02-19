import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
class App extends Component<{}> {
  ws: WebSocket|null = null;
  componentDidMount = () => {
    if (!this.ws) {
      const self = this;
      this.ws = new WebSocket("ws://localhost:8080/echo");
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = function() {
          const name = "Player "+Math.floor(Math.random() * 1000000);
          let buffer = new ArrayBuffer(1 + name.length);
          let view = new DataView(buffer);
          view.setInt8(0, 1)

          for (let i = 0; i < name.length; i++) {
            view.setUint8((i+1), name.charCodeAt(i));
          }
          console.log(view);
          self.ws && self.ws.send(buffer);
      }
      this.ws.onclose = function() {
        console.log("CLOSE");
          self.ws = null;
      }
      this.ws.onmessage = function(evt: any) {
        let view = new DataView(evt.data);
        const event = view.getUint8(0);
        console.log('event', event);
        let str = '';
        for (let i = 1; i < evt.data.byteLength; i++) {
          str += String.fromCharCode(view.getUint8(i))
        }
        console.log(evt.data.byteLength, str)
        console.log("RESPONSE: ", evt.data);
      }
      this.ws.onerror = function(evt: any) {
        console.log("ERROR: ", evt.data);
      }
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
export default App;