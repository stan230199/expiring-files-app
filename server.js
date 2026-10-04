const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Speichert Tokens mit Ablaufdatum
const tokens = new Map();

// Original-Datei laden
const originalContent = fs.readFileSync('revolut-anleitung.html', 'utf-8');

// ============ API ENDPOINTS ============

// 1. Token generieren (du rufst das auf, um einen Download-Link zu erzeugen)
app.get('/api/generate', (req, res) => {
    const expiryDays = parseInt(req.query.days) || 4;
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);

    tokens.set(token, { expiresAt, created: new Date() });

    // HTML-Wrapper mit Token erstellen
    const wrapperPath = `wrapper-${token}.html`;
    const wrapper = fs.readFileSync('expiring-wrapper.html', 'utf-8')
        .replace('{{ TOKEN }}', token)
        .replace('https://dein-server.de', `https://${req.get('host')}`);

    fs.writeFileSync(wrapperPath, wrapper);

    res.json({
        token,
        expires: new Date(expiresAt),
        downloadUrl: `/${wrapperPath}`,
        shareLink: `${req.protocol}://${req.get('host')}/${wrapperPath}`
    });
});

// 2. Token prüfen (wird von Wrapper aufgerufen)
app.get('/api/check', (req, res) => {
    const token = req.query.token;
    const data = tokens.get(token);

    if (!data) {
        return res.json({ valid: false, reason: 'Token nicht gefunden' });
    }

    if (Date.now() > data.expiresAt) {
        tokens.delete(token); // Aufräumen
        return res.json({ valid: false, reason: 'Abgelaufen' });
    }

    res.json({
        valid: true,
        expiresAt: new Date(data.expiresAt),
        hoursLeft: Math.round((data.expiresAt - Date.now()) / (1000 * 60 * 60))
    });
});

// 3. Content laden (wird von Wrapper aufgerufen)
app.get('/api/content', (req, res) => {
    const token = req.query.token;
    const data = tokens.get(token);

    if (!data || Date.now() > data.expiresAt) {
        return res.status(401).send('<p>Nicht autorisiert oder abgelaufen</p>');
    }

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(originalContent);
});

// 4. Token-Status (optional - zum Verwalten)
app.get('/api/tokens', (req, res) => {
    const allTokens = Array.from(tokens.entries()).map(([token, data]) => ({
        token: token.substring(0, 8) + '...',
        created: data.created,
        expiresAt: new Date(data.expiresAt),
        hoursLeft: Math.round((data.expiresAt - Date.now()) / (1000 * 60 * 60))
    }));
    res.json(allTokens);
});

// ============ STATISCHE DATEIEN ============
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf Port ${PORT}`);
    console.log(`📝 Token generieren: http://localhost:${PORT}/api/generate`);
    console.log(`📊 Tokens anschauen: http://localhost:${PORT}/api/tokens`);
});
