# Product Backlog - The Crown of Ash (RO)

Acest fișier este sursa unică de adevăr pentru backlog-ul inițial derivat din user stories (US-01..US-28).

## Convenții
- **Status implicit**: `Backlog`
- **Prioritate**: `P0` (critic), `P1` (ridicat), `P2` (mediu)
- Lista originală conținea dubluri de numerotare pentru **US-07** și **US-12**; aici numerotarea este normalizată secvențial.

## Product backlog (user stories)

### US-01
- **Titlu**: Înregistrare cont
- **User story**: Ca jucător nou, vreau să îmi pot crea cont cu email și parolă, ca să pot accesa jocul.
- **Prioritate**: P0
- **Status**: Done — `POST /api/auth/register` (backend, repo `D-D`, branch `alexandru`) +
  `SignUp.tsx`/`src/api/authApi.ts` (acest repo, branch `LogareRegistrareCookies`).
  Parola este hash-uită cu `PasswordHasher<Account>`, nu e stocată în clar.
  Confirmarea contului = autentificare automată (sign-in direct pe cookie de
  sesiune) după înregistrare; nu există confirmare prin email (nu era cerută
  aici, doar cont creat + acces imediat).
- **Criterii de acceptare**:
  - Formular cu validare pentru email/parolă. ✅ (client + server, inclusiv
    lungime minimă parolă și unicitate email/username)
  - Contul este creat și utilizatorul primește confirmare. ✅ (vezi nota de mai sus)

### US-02
- **Titlu**: Autentificare
- **User story**: Ca utilizator, vreau să mă autentific în cont, ca să continui progresul meu.
- **Prioritate**: P0
- **Status**: Done — `POST /api/auth/login`/`GET /api/auth/me` (backend) +
  `Login.tsx`/`App.tsx` (frontend). Sesiunea e pe cookie `HttpOnly`
  (ASP.NET Core cookie auth, nu JWT) și rezistă la refresh de pagină.
- **Criterii de acceptare**:
  - Login cu credențiale valide funcționează. ✅
  - Mesaj clar la credențiale invalide. ✅ (mesajul real de la server, afișat în formular)

### US-03
- **Titlu**: Resetare parolă
- **User story**: Ca utilizator, vreau să îmi resetez parola când o uit, ca să recâștig accesul la cont.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Flux „Ai uitat parola”.
  - Link/token de resetare cu expirare.

### US-04
- **Titlu**: Gestionare profil
- **User story**: Ca utilizator, vreau să îmi văd și editez profilul, ca să îmi personalizez contul.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Vizualizare date profil.
  - Salvare modificări cu validare.

### US-05
- **Titlu**: Ștergere cont
- **User story**: Ca utilizator, vreau să îmi pot șterge contul, ca să controlez datele personale.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Confirmare explicită înainte de ștergere.
  - Contul devine inactiv/șters conform regulilor aplicației.

### US-06
- **Titlu**: Creare personaj
- **User story**: Ca jucător, vreau să îmi creez un personaj, ca să pot începe aventura.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Alegere nume și atribute inițiale.
  - Personajul este salvat în cont.

### US-07
- **Titlu**: Listă personaje
- **User story**: Ca jucător, vreau să văd personajele mele existente, ca să aleg cu care joc.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Lista afișează personajele create.
  - Pot selecta un personaj pentru sesiune.

### US-08
- **Titlu**: Abilități și vrăji
- **User story**: Ca jucător, vreau să gestionez abilitățile și vrăjile personajului, ca să folosesc opțiuni tactice în joc.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Vizualizare listă abilități/vrăji.
  - Condițiile de utilizare sunt afișate clar.

### US-09
- **Titlu**: Experiență și nivel
- **User story**: Ca jucător, vreau să câștig XP și să cresc în nivel, ca să simt progresul personajului.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - XP se acordă pentru acțiuni/rezultate relevante.
  - Trecerea de nivel actualizează statisticile asociate.

### US-10
- **Titlu**: Motor de zaruri
- **User story**: Ca jucător, vreau un sistem de aruncări de zaruri, ca să rezolv acțiuni bazate pe șansă.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Aruncările folosesc intervalele/corelațiile definite de regulile jocului.
  - Rezultatul este afișat transparent.

### US-11
- **Titlu**: Saving throws
- **User story**: Ca jucător, vreau să execut saving throws, ca să pot evita efecte negative.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Saving throw folosește atribute relevante.
  - Rezultatul modifică efectul aplicat.

### US-12
- **Titlu**: Scene narative
- **User story**: Ca jucător, vreau să parcurg scene de poveste cu alegeri, ca să influențez cursul aventurii.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Sunt afișate scene și opțiuni de alegere.
  - Alegerea salvează starea narativă.

### US-13
- **Titlu**: Inițiere combat
- **User story**: Ca jucător, vreau să intru într-un flux de luptă clar, ca să pot executa acțiuni pe ture.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Lupta pornește cu ordinea tururilor definită.
  - Interfața arată acțiunile disponibile în tură.

### US-14
- **Titlu**: Rezolvare damage
- **User story**: Ca jucător, vreau ca damage-ul să fie calculat corect, ca rezultatele luptei să fie corecte.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Damage ține cont de atac/apărare/modificatori.
  - HP se actualizează după fiecare acțiune.

### US-15
- **Titlu**: Recompense după luptă
- **User story**: Ca jucător, vreau să primesc recompense la final de luptă, ca să progresez.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - La final de luptă se acordă XP/loot conform rezultatului.
  - Recompensele sunt vizibile în sumar.

### US-16
- **Titlu**: Inventar personaj
- **User story**: Ca jucător, vreau să îmi văd inventarul, ca să știu ce resurse am.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Inventarul listează itemele deținute.
  - Fiecare item are informații esențiale (tip, cantitate, efect).

### US-17
- **Titlu**: Consumabile
- **User story**: Ca jucător, vreau să folosesc iteme consumabile, ca să obțin efecte în joc.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Consumabilul aplică efectul definit.
  - Cantitatea scade corect după utilizare.

### US-18
- **Titlu**: Echipare iteme
- **User story**: Ca jucător, vreau să echipez/dezechipez iteme, ca să îmi optimizez statisticile.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Echiparea respectă sloturile disponibile.
  - Statisticile se recalculează după schimbare.

### US-19
- **Titlu**: Căutare și sortare inventar
- **User story**: Ca jucător, vreau să caut și să sortez inventarul, ca să găsesc rapid itemele utile.
- **Prioritate**: P2
- **Status**: Backlog
- **Criterii de acceptare**:
  - Există câmp de căutare după nume/tag.
  - Sortarea funcționează după criterii relevante.

### US-20
- **Titlu**: Salvare, încărcare și checkpoint
- **User story**: Ca jucător, vreau să salvez și să încarc progresul din checkpoint-uri, ca să pot continua ulterior.
- **Prioritate**: P0
- **Status**: Backlog
- **Criterii de acceptare**:
  - Există acțiuni de save/load.
  - Checkpoint-urile disponibile pot fi selectate.

### US-21
- **Titlu**: Colecție de cărți
- **User story**: Ca jucător, vreau să colecționez cărți/artefacte, ca să completez progresul de colecție.
- **Prioritate**: P2
- **Status**: Backlog
- **Criterii de acceptare**:
  - Cărțile obținute apar în colecție.
  - Colecția indică progresul (obținute/total).

### US-22
- **Titlu**: Călătorie pe hartă
- **User story**: Ca jucător, vreau să navighez pe hartă între locații, ca să explorez lumea jocului.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Locațiile disponibile sunt vizibile.
  - Schimbarea locației actualizează starea jocului.

### US-23
- **Titlu**: Administrare conținut (admin)
- **User story**: Ca administrator, vreau să gestionez conținutul jocului, ca să mențin experiența actualizată.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Adminul poate crea/edita/dezactiva entități gestionate.
  - Acțiunile admin sunt restricționate la roluri autorizate.

### US-24
- **Titlu**: Dashboard statistici (admin)
- **User story**: Ca administrator, vreau să văd statistici cheie de utilizare, ca să monitorizez sănătatea produsului.
- **Prioritate**: P2
- **Status**: Backlog
- **Criterii de acceptare**:
  - Dashboard-ul afișează metrici relevante.
  - Datele pot fi filtrate pe intervale de timp.

### US-25
- **Titlu**: Achievements
- **User story**: Ca jucător, vreau să deblochez achievements, ca să primesc obiective clare și feedback de progres.
- **Prioritate**: P2
- **Status**: Backlog
- **Criterii de acceptare**:
  - Achievement-urile au condiții de deblocare definite.
  - Deblocarea este înregistrată și vizibilă.

### US-26
- **Titlu**: Shop in-game
- **User story**: Ca jucător, vreau să cumpăr/vând iteme în shop, ca să gestionez resursele personajului.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Tranzacțiile verifică soldul și disponibilitatea itemelor.
  - Inventarul și moneda se actualizează după tranzacție.

### US-27
- **Titlu**: Interfață responsive
- **User story**: Ca utilizator, vreau o interfață responsive, ca să pot juca ușor de pe mobil și desktop.
- **Prioritate**: P1
- **Status**: Backlog
- **Criterii de acceptare**:
  - Ecranele principale sunt utilizabile pe viewport-uri mobile și desktop.
  - Navigarea principală rămâne accesibilă pe toate rezoluțiile suportate.

### US-28
- **Titlu**: Flux UX unificat
- **User story**: Ca jucător, vreau un flux UI coerent între module (profil, inventar, combat, hartă), ca să navighez intuitiv.
- **Prioritate**: P2
- **Status**: Backlog
- **Criterii de acceptare**:
  - Componentele partajează pattern-uri UI consistente.
  - Tranzițiile între module păstrează contextul utilizatorului.

## Cerințe tehnice / transversale (separate de product backlog)

Aceste elemente se recomandă în **technical backlog** (enabler stories/tasks), nu ca user stories de produs:

- **TECH-01 - Validare API și input sanitization**
  - Validare strictă request/response pe endpoint-uri.
  - Mesaje de eroare consistente.
- **TECH-02 - Logging & auditabilitate**
  - Logging structurat pentru acțiuni critice (auth, combat, admin).
  - Corelare evenimente pentru debugging.
- **TECH-03 - Backup & recovery**
  - Politică de backup periodic.
  - Procedură testată de restaurare.
- **TECH-04 - Observabilitate backend**
  - Metrici și alerte pentru disponibilitate/erori/latency.

## Mapping rapid pentru GitHub Projects
- **Title**: `US-XX - <Titlu>`
- **Body**: secțiunea „User story” + „Criterii de acceptare”
- **Status field**: `Backlog`
- **Priority field**: `P0/P1/P2`
- **Label recomandat**: `type:user-story` sau `type:tech-enabler` (pentru TECH-xx)
