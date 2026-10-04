# 📱 Expiring File Sharing - Revolut Wallet Anleitung

Datei-Sharing mit automatischem Ablaufdatum. Schicke die Datei via WhatsApp und sie funktioniert nur 4 Tage lang!

---

## 🚀 Quick Start mit Replit (kostenlos)

### Schritt 1: Replit Fork
1. Gehe zu https://replit.com
2. Erstelle einen neuen **Node.js** Repl
3. Kopiere diese Dateien rein:
   - `server.js`
   - `package.json`
   - `expiring-wrapper.html`
   - `revolut-anleitung.html`

### Schritt 2: Starten
```bash
npm install
npm start
```

Replit zeigt dir automatisch die URL, z.B.: `https://expiring-files.username.repl.co`

### Schritt 3: Token generieren
Gehe zu:
```
https://expiring-files.username.repl.co/api/generate?days=4
```

Du bekommst diese Antwort:
```json
{
  "token": "abc123xyz...",
  "expires": "2026-10-08T12:30:00.000Z",
  "shareLink": "https://expiring-files.username.repl.co/wrapper-abc123xyz.html"
}
```

### Schritt 4: Teilen
Schicke den `shareLink` via WhatsApp!

---

## 📊 Wie es funktioniert

```
Du                    Empfänger              Server
|                        |                     |
+--generateToken-------->|                     |
|                        |<---checkToken------>|
|                        |     (gültig?)       |
|                    (öffnet Link)             |
|                        |<---loadContent----->|
|                        |   (wenn gültig)     |
|                    (sieht Anleitung)        |
|                        |                     |
[Nach 4 Tagen]           |                     |
|                        |<---checkToken------>|
|                        |     (ungültig!)     |
|                    (⏰ Abgelaufen!)         |
```

---

## ⚙️ Erweiterte Nutzung

### Verschiedene Ablaufdauern
```
# 1 Tag
/api/generate?days=1

# 7 Tage
/api/generate?days=7

# 24 Stunden
/api/generate?days=1
```

### Token-Status checken
```
/api/tokens
```
Zeigt alle aktiven Tokens mit Ablaufdatum.

### Eigene Datei verwenden
1. Ersetze `revolut-anleitung.html` mit deiner HTML-Datei
2. Benenne sie in `revolut-anleitung.html` um
3. Starte den Server neu

---

## 🔒 Sicherheit

- ✅ Tokens sind zufällig generiert (16 Bytes Hex)
- ✅ Ablaufdatum ist serverside gespeichert
- ✅ CORS aktiviert für verschiedene Domänen
- ✅ Abgelaufene Tokens werden automatisch gelöscht

---

## 🐛 Troubleshooting

**"Server nicht erreichbar"**
- Replit-Repl muss laufen
- URL muss richtig sein (in `expiring-wrapper.html` angepasst)

**Wrapper lädt nicht**
- Console öffnen (F12) → Errors prüfen
- Server-URL in `expiring-wrapper.html` prüfen

**Datei wird nicht geladen**
- Datei `revolut-anleitung.html` existiert?
- `/api/tokens` checken → Token gültig?

---

## 📝 Änderungen für deine Needs

### Server-URL anpassen
In `expiring-wrapper.html`:
```javascript
const SERVER = "https://DEINE-REPLIT-URL.repl.co";
```

### Design ändern
Wrapper-HTML editieren (in `expiring-wrapper.html`)

### Inhalts-Datei wechseln
`revolut-anleitung.html` durch deine Datei ersetzen

---

## 🎯 Beispiel-Workflow

```bash
# 1. Link generieren
curl "https://expiring-files.username.repl.co/api/generate?days=4"

# 2. Link in WhatsApp schicken
https://expiring-files.username.repl.co/wrapper-abc123.html

# 3. Empfänger öffnet, sieht Status
# Status prüft: /api/check?token=abc123
# Falls gültig: "Anleitung anzeigen" Button erscheint

# 4. Klick auf Button lädt echte HTML

# 5. Nach 4 Tagen: "⏰ Abgelaufen!"
```

---

## 💡 Tipps

- **Desktop-Link**: Auch per Email nutzbar
- **QR-Code**: URL in QR-Code konvertieren für einfacheres Teilen
- **Analytics**: `/api/tokens` zeigt wie oft Links genutzt werden
- **Mehrere Dateien**: Pro Datei einen anderen Replit-Repl starten

---

## 📞 Support

Fehler? Console öffnen (F12) und Errors posten. 

Viel Spaß! 🚀
