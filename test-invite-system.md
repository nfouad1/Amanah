# Test av Invite System

## Steg för att testa:

1. **Logga in som admin**
   - Email: admin@example.com
   - Password: password123

2. **Gå till Manage Invites**
   - Klicka på "Manage Invites" knappen i Quick Actions

3. **Skapa en ny invite-kod**
   - Klicka på "+ Create Invite"
   - Lämna 30 dagar som standard
   - Klicka "Create Invite"
   - En ny kod ska skapas (format: FAM-XXXXXX)

4. **Kopiera invite-länken**
   - Klicka på kopiera-ikonen bredvid koden
   - Länken ska kopieras till clipboard
   - Format: http://localhost:3000/register?invite=FAM-XXXXXX

5. **Testa registrering med koden**
   - Öppna registreringssidan
   - Om du använde länken ska koden redan vara ifylld
   - Annars, ange koden manuellt
   - Fyll i namn, email, lösenord
   - Klicka "Create Account"

6. **Verifiera att koden används**
   - Gå tillbaka till Manage Invites
   - Koden ska nu visa "Used by: [användarnamn]"
   - Status ska vara "Used" istället för "Active"

## Default testkod:
- Kod: FAMILY2024
- Status: Active
- Kan användas för att testa registrering

## Möjliga problem:

### Problem 1: Koden valideras inte korrekt
**Symptom**: Får felmeddelande "Invalid or expired invite code" trots giltig kod
**Lösning**: Kontrollera att koden är exakt samma (case-insensitive)

### Problem 2: Koden markeras inte som använd
**Symptom**: Kan registrera flera användare med samma kod
**Lösning**: Kontrollera att `useInviteCode()` anropas efter lyckad registrering

### Problem 3: Koden syns inte i listan
**Symptom**: Skapade koder visas inte på Manage Invites-sidan
**Lösning**: Kontrollera localStorage: `amanah_invite_codes`

### Problem 4: Kopiera-funktionen fungerar inte
**Symptom**: Inget händer när man klickar på kopiera-ikonen
**Lösning**: Kontrollera att `navigator.clipboard` är tillgängligt (kräver HTTPS eller localhost)

## Debugging:

Öppna browser console och kör:
```javascript
// Se alla invite-koder
JSON.parse(localStorage.getItem('amanah_invite_codes'))

// Rensa och återställ till default
localStorage.removeItem('amanah_invite_codes')
location.reload()

// Testa validering
const { validateInviteCode } = await import('./src/lib/mockData')
validateInviteCode('FAMILY2024')
```
