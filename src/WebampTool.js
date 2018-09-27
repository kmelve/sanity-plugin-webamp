import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import client from 'part:@sanity/base/client'
import Webamp from 'webamp'

export default class Winamp extends Component {
  state = {}
  componentDidMount() {
    // Only load one instance of Webamp
    if (!document.getElementById('webamp')) {
      this.mountWebamp()
    }
  }

  mountWebamp = () => {
    if (!Webamp.browserIsSupported()) {
      alert('Oh no! Webamp does not work!')
      throw new Error("What's the point of anything?")
    }
    return client
      .fetch(
        `*[extension in ["mp3", "wav"]]{url,"metaData": {"title": originalFilename}}`
      )
      .then(tracks => {
        const webamp = new Webamp({
          zIndex: 1000,
          initialTracks: tracks
        })
        // Render after the skin has loaded.
        webamp.renderWhenReady(document.getElementById('webamp-container'))
        this.setState({ webamp })
      })
  }
  render() {
    return <div ref="webampContainer" id="webamp-container" />
  }
}
