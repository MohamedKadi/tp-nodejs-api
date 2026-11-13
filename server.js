// server.js
const http = require('http');
const url = require('url');
const postManager = require('./postManager');

const PORT = 3000;

// Fonction pour parser le body JSON
function parseJsonBody(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Envoyer une réponse JSON
function sendJson(response, status, data) {
    response.writeHead(status);
    response.end(JSON.stringify(data));
}

// Erreur "introuvable" -> 404, sinon 500
function sendError(response, err) {
    if (err.message.includes('introuvable')) {
        sendJson(response, 404, { error: err.message });
    } else {
        sendJson(response, 500, { error: 'Erreur serveur' });
    }
}

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;

    // Headers CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Content-Type', 'application/json');

    // Extraire l'id des routes /api/posts/:id
    const match = pathname.match(/^\/api\/posts\/(\d+)$/);
    const id = match ? match[1] : null;

    // Requête preflight du navigateur (CORS)
    if (method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
    }

    // GET /api/posts - Obtenir tous les posts
    else if (pathname === '/api/posts' && method === 'GET') {
        postManager.getAllPosts((err, posts) => {
            if (err) return sendError(response, err);
            sendJson(response, 200, posts);
        });
    }

    // GET /api/posts/:id - Obtenir un post par ID
    else if (id && method === 'GET') {
        postManager.getPost(id, (err, post) => {
            if (err) return sendError(response, err);
            sendJson(response, 200, post);
        });
    }

    // POST /api/posts - Créer un nouveau post
    else if (pathname === '/api/posts' && method === 'POST') {
        parseJsonBody(request, (parseErr, data) => {
            if (parseErr) {
                return sendJson(response, 400, { error: 'JSON invalide' });
            }
            postManager.insertPost(data, (err, post) => {
                if (err) return sendError(response, err);
                sendJson(response, 201, post);
            });
        });
    }

    // PUT /api/posts/:id - Mettre à jour un post
    else if (id && method === 'PUT') {
        parseJsonBody(request, (parseErr, data) => {
            if (parseErr) {
                return sendJson(response, 400, { error: 'JSON invalide' });
            }
            postManager.updatePost(id, data, (err, post) => {
                if (err) return sendError(response, err);
                sendJson(response, 200, post);
            });
        });
    }

    // DELETE /api/posts/:id - Supprimer un post
    else if (id && method === 'DELETE') {
        postManager.deletePost(id, (err, result) => {
            if (err) return sendError(response, err);
            sendJson(response, 200, result);
        });
    }

    // Route non trouvée
    else {
        sendJson(response, 404, { error: 'Route non trouvée' });
    }
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`✅ Serveur API démarré sur http://localhost:${PORT}`);
    console.log('Routes disponibles:');
    console.log('  GET    /api/posts');
    console.log('  GET    /api/posts/:id');
    console.log('  POST   /api/posts');
    console.log('  PUT    /api/posts/:id');
    console.log('  DELETE /api/posts/:id');
});