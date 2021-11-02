import axios from 'axios';
const KEY = 'AIzaSyChZvAe9xKylCp3j0Il3RrXHGjnYsCrsRI'; // mention your youtube API key here

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet',
        maxResults: 1,
        key: KEY
    }
})