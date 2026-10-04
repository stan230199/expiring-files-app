

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
