# adfj-fm
### A Spotify global recommender and visualizer (https://adfj-fm.herokuapp.com/)
### Team members: Angela Gao, Julie Lai, Daphne Yang, Frank Bruni

**Problem Statement**
* Current global top charts provides only a glimpse of the music created in different parts of the world and still is dominated by songs created in the US. 
By generating global song recommendations geared towards highlighting global talent and multilingual songs, our project seeks to create a more diverse experience to music listeners while also providing a novel and enhanced user experience by generating live, audio-responsive artistic visuals.

**Recommender System**
* for the sake of our MVP, song recommender limited to Japanese songs, using Japan-related playlists on Spotify
* our system uses KMeans to group together similar songs using audio track features as the feature inputs
* Recommendation Similarity Metric used to test how well the model is doing. This metric measures cosine similarity between the input songs, output songs, and a cross between them

**Visualizer**
* Realized Using Vue.js and the Spotify Web API + Web Playback SDK
* built off of https://github.com/zachwinter/wavesync as a template
