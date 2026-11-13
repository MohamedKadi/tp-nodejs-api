// postManager.js
const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, 'posts.json');

// Lire tous les posts
function getAllPosts(callback) {
    fs.readFile(POSTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        try {
            const posts = JSON.parse(data);
            callback(null, posts);
        } catch (parseError) {
            callback(parseError);
        }
    });
}

// Obtenir un post par ID
function getPost(id, callback) {
    getAllPosts((err, posts) => {
        if (err) return callback(err);

        const post = posts.find((p) => p.id === Number(id));
        if (!post) {
            return callback(new Error(`Post ${id} introuvable`));
        }
        callback(null, post);
    });
}

// Insérer un nouveau post
function insertPost(newPost, callback) {
    getAllPosts((err, posts) => {
        if (err) return callback(err);

        const maxId = posts.reduce((max, p) => Math.max(max, p.id), 0);
        const post = { ...newPost, id: maxId + 1 };
        posts.push(post);

        savePosts(posts, (saveErr) => {
            if (saveErr) return callback(saveErr);
            callback(null, post);
        });
    });
}

// Mettre à jour un post
function updatePost(id, updatedPost, callback) {
    getAllPosts((err, posts) => {
        if (err) return callback(err);

        const index = posts.findIndex((p) => p.id === Number(id));
        if (index === -1) {
            return callback(new Error(`Post ${id} introuvable`));
        }

        // On fusionne les champs, mais l'id ne change jamais
        posts[index] = { ...posts[index], ...updatedPost, id: posts[index].id };

        savePosts(posts, (saveErr) => {
            if (saveErr) return callback(saveErr);
            callback(null, posts[index]);
        });
    });
}

// Supprimer un post
function deletePost(id, callback) {
    getAllPosts((err, posts) => {
        if (err) return callback(err);

        const remaining = posts.filter((p) => p.id !== Number(id));
        if (remaining.length === posts.length) {
            return callback(new Error(`Post ${id} introuvable`));
        }

        savePosts(remaining, (saveErr) => {
            if (saveErr) return callback(saveErr);
            callback(null, { message: `Post ${id} supprimé` });
        });
    });
}

// Fonction utilitaire pour sauvegarder les posts
function savePosts(posts, callback) {
    fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8', callback);
}

// Exporter les fonctions
module.exports = {
    getAllPosts,
    getPost,
    insertPost,
    updatePost,
    deletePost
};