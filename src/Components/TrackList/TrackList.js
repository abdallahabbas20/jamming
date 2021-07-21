import React from 'react';
import Track from '../Track/Track'
import '../TrackList/TrackList.css'

class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {this.props.tracks.map(this_track => {return <Track isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} onAdd={this.props.onAdd} key={this_track.id} track={this_track} />})}
            </div>
        )
    }
}

export default TrackList;