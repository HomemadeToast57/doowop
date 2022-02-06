# Doowop

![Screen Shot 2022-02-06 at 11 59 43 AM](https://user-images.githubusercontent.com/54961512/152691947-0fe60b00-5509-41e7-aac9-131d503421e9.png)

Run using 'npm start' in the root directory.

### Developed by Jack Singer, Noa Rogoszinski, Jingxin Song, and Brian Ni for 2022 HackBU (SUNY Binghamton) Hackathon

# Inspiration
We wanted to streamline the music discovery process by condensing the whole process into one app by catering to the familiarity of quick-swipe social media platforms.

# What it does
The user begins by linking their Spotify account to doowop. The app uses the songs, artists, and genres currently present in the user's Spotify library to create a list of song recommendations. Each recommendation is displayed to the user one at a time with the song title, artist, album cover, and a short preview. Based on this information, the user decides if they would like to save the song to their library or skip to the next song.

# How we built it
We used HTTP get and post requests to communicate with Spotify's API. In order to authenticate a user, we generated a unique access token that would be used to make all API calls. From there, we gathered a large collection of data about the user's music taste to customize a call to Spotify's recommendation API that imports tracks the user may be interested in. We scan this list to make sure no tracks already present in the user's library gets recommended to the user, then go through this list one by one to display each individual song recommendation.

# Challenges we ran into
Our main challenges came from implementing Spotify's API and using non-static data structures.

# Accomplishments that we're proud of
Three out of four members of our team came into this project with no prior experience with React.js or using APIs. We, the three teammates, are so proud to have developed a functioning web app for the first time in 24 hours following the guidance of one teammate, and are so proud of this teammate for leading the way and teaching us so much.

# What we learned
We learned how to code with React.js and use APIs made available to us on the internet.

# What's next for doowop
We have many ideas for the continuation of doowop. These include providing mobile support, sharing with friends, saving songs to playlists, and improving the UI.
