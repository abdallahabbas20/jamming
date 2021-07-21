import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = { searchResults : [], playlistName : 'QuranMix', playlistTracks: 
    []}
  }

  addTrack(track) {
    for (let i=0; i<this.state.playlistTracks.length; i++) {
      let current_track = this.state.playlistTracks[i];
      if (track.id === current_track.id) {
        return;
      }}
      const track_list = this.state.playlistTracks;
      track_list.push(track);
      this.setState( { playlistTracks : track_list});
      
    }

  removeTrack(track) {
    const track_list = this.state.playlistTracks;
    for (let i=0; i<this.state.playlistTracks.length; i++) {
      let current_track = this.state.playlistTracks[i];
      if (track.id === current_track.id) {
        track_list.splice(i, 1);
      }}
    this.setState( { playlistTracks : track_list});
  }

  updatePlaylistName(name) {
    this.setState( { playlistName : name} )
  }

  savePlaylist() {
    
    const trackURIs = [];
    for (let i=0; i<this.state.playlistTracks.length; i++) {
      let current_track = this.state.playlistTracks[i];
      trackURIs.push(current_track.uri)
      
    }
    Spotify.savePlaylist(this.state.playlistName, trackURIs).
    then(() => {
      this.setState({playlistName : 'New Playlist', playlistTracks: []})

    })
    
    }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState( {searchResults: searchResults})
    })
  }
  

  render() {
    return (
        <div>
      <h1>Quran<span className="highlight">Spot</span></h1>
      <div className="App">
        <SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
          <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
        </div>
      </div>
      </div>
    )
  }
}


export default App;
