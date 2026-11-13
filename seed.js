// seed.js
const https = require('https');
const fs = require('fs');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const OUTPUT_FILE = 'posts.json';

function fetchPosts() {
    https.get(API_URL, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Request failed: ${res.statusCode}`);
            res.resume(); // discard the response
            return;
        }

        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
            try {
                const posts = JSON.parse(body); // string -> array
                savePosts(posts);
            } catch (err) {
                console.error('Invalid JSON:', err.message);
            }
        });
    }).on('error', (err) => console.error(err.message));
}

function savePosts(posts) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`Saved ${posts.length} posts to ${OUTPUT_FILE}`);
}

fetchPosts();
