import { search } from "language-tags";

let accessToken;
const clientID = "bd7f944dcb22416ea3e71610d6d5abcd";
const redirectURI = "http://quranspot.surge.sh";

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            
            return accessToken;

        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }

    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
          }).then(response => {
              return response.json();
          }).then(jsonResponse => {
              if (!jsonResponse.tracks) {
                  return [];
              }
              return jsonResponse.tracks.items.map(track => ({
                name: track.name, artist: track.artists[0].name, album: track.album.name, id: track.id, uri: track.uri

              }))
          })
    },

    savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }
        let accessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`};
        let userID;

        return fetch('https://api.spotify.com/v1/me', {headers : headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers:headers,
            method: 'POST',
            body: JSON.stringify({name: playlistName}) 
            }).then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, 
                {
                    headers:headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris}) 

                })
            })
        }) 
    }
}

export default Spotify;