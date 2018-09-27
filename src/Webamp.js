import React, { Component } from "react";
import ReactDOM from "react-dom";
import client from "part:@sanity/base/client";
import Webamp from "webamp";
export default class Winamp extends Component {
  componentDidMount() {
    // Or, if you installed via a script tag, `Winamp` is available on the global `window`:
    // const Winamp = window.Webamp;
    // Check if Winamp is supported in this browser
    this.mountWebamp();
  }
  mountWebamp = () => {
    if (!Webamp.browserIsSupported()) {
      alert("Oh no! Webamp does not work!");
      throw new Error("What's the point of anything?");
    }
    return client
      .fetch(
        `*[_type == "episode"]{file{asset->}, title}|order(schedule.publish desc)`
      )
      .then(episodes => {
        const webamp = new Webamp({
          zIndex: 1000,
          initialTracks: episodes
            .filter(({ file = {} }) => file.asset)
            .map(({ title, file = {} }) => ({
              metaData: {
                artist: "Syntax.fm",
                title
              },
              url: file.asset.url
            }))
        });
        // Render after the skin has loaded.
        webamp.renderWhenReady(document.getElementById("webamp-container"));
        this.setState({ webamp });
      });
  };


  render() {
    return <div ref="webampContainer" id="webamp-container" />;
  }
}
