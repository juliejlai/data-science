<template lang="pug">
#app
  app-header
  router-view
</template>

<template>

<body>
  <br>
    <div class="container-fluid cover" style="width: 100%; backdrop-filter: blur(3px) contrast(0.9)">
      <h1> Your Global Recommendations: </h1>
      <h2
            class="center pb-3"
            style="
                font-size: 1.5rem;
                color: white;
            "
      >
            Please allow a couple seconds for the recommended songs to load after you choose a song.
      </h2>
      
      <div class="row">
      <br>
        <div class="column" >
          <h2> Type to Search a Song: </h2>
          <input type="text" id="query" v-model="inputValue" class="form-control" placeholder="Find a Song!!" @keyup="searchSongs" autocomplete='off' style = "height: 30px; width: 300px; font-size: 18px"/>
            <div id='searchbar'>
              <ul style="list-style-type:none" class="dropdown">
                <li class='dd' v-for="song in tracks.items" :key='song.id' @click='fetchAPIData(song.id)'>
                  "{{song.name}}" by {{song.artists[0].name}}
                </li>
              </ul>
            </div>
        </div>
      
        <div class="column">
          <h2> For song ID: {{this.id}} </h2>
          <li class='rr' v-for='res in result' :key='res.track_id'>
            "{{res.name}}" by {{res.artists}}
          </li>

          <button v-if='responseAvailable' @click='writePlaylist' style="display: block; margin: 0 auto;"> Write to playlist! </button>
          <br><br><br><br>
          <h2 v-if='seePlaylist' 
            class="center pb-3"
            style="
                font-size: 1.5rem;
                position: 500px;
                color: #E4FDE1;
            "> Check your spotify for your new playlist! </h2>
          
        </div>

      </div>

      <div class="pt-5 pb-5 mb-0 text-white">
          <img
              style="
                  width: auto;
                  height: 400px;
                  margin-left: auto;
                  margin-right: auto;
                  backdrop-filter: blur(3px) contrast(0.9)"/>
      </div>

  </div>
</body>
</template>

<script>
import WaveSync from '@/wavesync'
import { get } from '../util/network'
import * as cookies from '../util/cookie'
import AppHeader from '@/components/AppHeader.vue'

export default {
  props: ['modelValue'],

  data () {
    return {
      responseAvailable: false,
      seePlaylist: false,
      result: {},
      tracks: {},
      inputValue: '',
      id:'',
      playlist_id:'',
      playlist_uri: '',
      user_id: ''
    }
  },

  watch: {
    searching (inputValue) {
      const values = this.searchSongs(inputValue)
      this.tracks = values
      }
    },

  methods: {
    async fetchAPIData(id) {
      await fetch("https://music-recommender-api.herokuapp.com/song?track_id=" + id, {
        "method":"GET"
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          alert("Server returned " + response.status + ' : ' + response.statusText);
        }
      })
      .then(response => {
        this.result = response;
        this.responseAvailable = true;
        this.id = id;
      }).then(getids => {

        for (const r in this.result) {
          var parsed = JSON.parse(JSON.stringify(this.result[r]));
          this.playlist_uri += '%2Cspotify%3Atrack%3A' + this.result[r].track_id;
        };
        console.log(this.playlist_uri);
      })
      .catch(err => {
        console.log(err);
      });


    },

    async searchSongs() {
      const refreshToken = cookies.get('SPOTIFY_REFRESH_TOKEN')
      if (!refreshToken) {
        window.location.href = '/'
      }
      const { data } = await get(`${process.env.PROJECT_ROOT}/refresh?token=` + refreshToken)
      const accessToken = data.access_token

      if (this.inputValue) {
        get("https://api.spotify.com/v1/search?q=" + this.inputValue + "&type=track%2Cartist&limit=10",
           {headers: {
             'Authorization': 'Bearer ' + accessToken,
             'Accept': 'application/json'
           }}
         ).then(response => {
           this.tracks = response.data.tracks;
         }).catch(err => {
           console.log(err);
         });
      }
    },

    async writePlaylist() {
      const refreshToken = cookies.get('SPOTIFY_REFRESH_TOKEN')
      if (!refreshToken) {
        window.location.href = '/'
      }
      const { data } = await get(`${process.env.PROJECT_ROOT}/refresh?token=` + refreshToken)
      const accessToken = data.access_token

      get("https://api.spotify.com/v1/me",
        {headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        }}).then(response => {
          this.user_id = response.data.id;
        }).then(play => {
          const playlist_info = {"name" : "Audio Recommender Output"}
          return fetch("https://api.spotify.com/v1/users/"+ this.user_id + "/playlists",
            {
            method: 'POST',
            body: JSON.stringify(playlist_info),
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }});
        }).then(response => {
          return response.json();
        }).then(playlist => {
          this.playlist_id = playlist.id;
          return fetch("https://api.spotify.com/v1/playlists/"+ this.playlist_id + "/tracks?uris=" + this.playlist_uri.substring(3),
            {
            method: 'POST',
            body: JSON.stringify(this.playlist_uri),
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            });
        }).then(response => {
          return response;
        }).then(response => {
            this.seePlaylist = true;
        }).catch(err => {console.log(err);});
      }

    },

    mounted () {
      this.wavesync = new WaveSync({fixed:true})
    }
}
</script>



<style lang="scss" scoped>

h1 {
  color: #FFFFFF;
  text-align: center;
  font-size: 80px;
}

h2 {
  color: gray;
  text-align: center;
  font-size: 32px;
}

ul {
  position: relative;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  width: 300px;
  display: inline-block;


}

.dd {
  &:hover {color:gray;}
}

.rr {
  color: #FFFFFF;
  text-align: center;
  font-size: 18px;
}

.column {
  float: left;
  width: 50%;
}

body {
  text-align: center;
}

button {
  @include button(white);
  @include position(absolute, 290px null null null);
  transform: translateX(50%) translateY(150px);
  margin: 0 auto;
  z-index:2;
  display: inline-block;
  text-align: center;
  left:55%;

  &:hover { color: black; }
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}

</style>
