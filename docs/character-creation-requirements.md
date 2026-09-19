# Character Creation — Cerințe și comportament

## Scop

Se va adăuga o pagină nouă `CharacterCreation` în frontend. Pagina se deschide după apăsarea butonului `New Game` din `MainMenu`.

Imaginea de referință definește structura vizuală generală și proporțiile paginii.

## Referință de layout

Imaginea furnizată are un canvas aproximativ de `1227 × 696 px` și trebuie tratată ca referință pentru un ecran desktop widescreen.

- fundalul ocupă întregul canvas, fără margini albe sau spațiu exterior;
- panoul principal de joc ocupă aproximativ 71% din lățime;
- panoul `AttributesMenu` ocupă aproximativ 28% din lățime și este ancorat în partea dreaptă;
- banner-ul este centrat în zona principală, nu în raport cu întregul ecran;
- caruselul este poziționat sub banner, în zona superioară-centrală;
- `DisplayMenu` este poziționat în partea inferioară a zonei principale, sub carusel;
- `AttributesMenu` se întinde aproape pe toată înălțimea ecranului, de sus până jos;
- imaginea este referința pentru aliniere, scalare, spațiere și proporțiile dintre elemente.

### Poziționarea elementelor în referință

În raport cu canvas-ul de referință:

- banner-ul: sus, centrat în zona principală;
- săgeata stânga: în stânga caruselului, aproximativ la mijlocul vertical al cărților;
- cele trei cărți: în partea superioară-centrală, cu cartea activă mai mare în centru;
- săgeata dreapta: în dreapta caruselului, înainte de `AttributesMenu`;
- `DisplayMenu`: jos, în zona principală, cu cartea rasei în stânga și informațiile în dreapta;
- `AttributesMenu`: coloană verticală fixă în partea dreaptă.

### Poziționarea butoanelor

Butoanele sunt poziționate imediat sub `DisplayMenu`, în partea inferioară a zonei principale, pe aceeași axă orizontală cu panoul de afișare:

- când sunt disponibile ambele acțiuni, `Back` este în stânga, iar `Continue` este în dreapta;
- cele două butoane sunt aliniate pe aceeași linie și au dimensiuni vizuale comparabile;
- grupul de butoane este centrat în zona principală, nu în raport cu `AttributesMenu`;
- când este disponibil doar `Continue`, butonul este centrat singur sub `DisplayMenu`;
- butoanele nu intră peste `AttributesMenu`, carusel sau panoul `DisplayMenu`;
- asset-ul poate afișa textul `Confirm`, dar în flux acțiunea trebuie tratată ca `Continue`/confirmarea etapei curente.

## Asset-uri

Toate asset-urile necesare se află în:

```text
frontend/src/assets/CharacterCreation
```

Asset-urile disponibile includ:

- 4 rase: `Human`, `Elf`, `Dwarf`, `Orc`;
- 4 clase: `Warrior`, `Bard`, `Magician`, `Healer`;
- imagini pentru selecția raselor și clasele disponibile;
- imagini pentru `DisplayMenu`;
- simbolurile claselor;
- `SelectedFrame`;
- barele pentru atribute;
- fundalul, banner-ul, panourile, săgețile și butoanele UI.

## Structura vizuală

Pagina trebuie să reproducă structura din imaginea de referință:

- fundal pe întreaga pagină folosind `CharacterCreationBackground`;
- banner-ul `CreateYourCharacterBanner` în partea de sus;
- caruselul cu trei cărți în zona centrală;
- săgeată stânga și săgeată dreapta pentru carusel;
- panoul `AttributesMenu` în partea dreaptă;
- panoul `DisplayMenu` în partea inferioară;
- câmpuri pentru `Name`, `Race` și `Class`;
- afișarea rezistențelor și a descrierii personajului în `DisplayMenu`.

## Fonturi

- Tot textul trebuie să folosească fontul `Garamond`.
- Textele importante, titlurile și etichetele principale trebuie să folosească `Garamond Bold`.

## Fluxul de selecție

### Selectarea rasei

- Pagina începe în etapa de selectare a rasei.
- Sunt afișate mereu trei cărți: una în stânga, una în centru și una în dreapta.
- Cartea din centru este selecția curentă.
- În această etapă este afișat doar butonul `Continue`.
- După apăsarea `Continue`, rasa curentă este confirmată și se trece la selectarea clasei.

### Selectarea clasei

- În etapa de clasă sunt afișate tot trei cărți.
- Clasa `Warrior` este selectată implicit la intrarea în această etapă.
- Sunt afișate butoanele `Back` și `Continue`.
- `Back` revine la etapa de selectare a rasei și permite schimbarea rasei.
- `Continue` confirmă clasa curentă.

## Comportamentul caruselului

Ordinea circulară a raselor este:

```text
Human → Elf → Dwarf → Orc → Human
```

Caruselul trebuie să poată fi rotit la infinit în ambele direcții.

- La apăsarea săgeții dreapta, cartea din dreapta devine cartea selectată din centru.
- La apăsarea săgeții stânga, cartea din stânga devine cartea selectată din centru.
- Cărțile laterale sunt decorative și nu pot fi selectate prin click direct.
- Selecția se schimbă instant atunci când o carte ajunge în centru.
- Cartea din centru trebuie să aibă `SelectedFrame` și glow.
- Cărțile laterale trebuie să fie mai mici și ușor întunecate.
- Schimbarea trebuie să fie vizibilă: fiecare carte se deplasează animat din poziția curentă în noua poziție.
- Cartea care ajunge în centru trebuie să primească animația de apariție, frame-ul și glow-ul.

Pentru clase se folosește același comportament de carusel, cu următoarea selecție inițială:

```text
Warrior → Bard → Magician → Healer → Warrior
```

## DisplayMenu

După selectarea unei rase:

- în `DisplayMenu` apare imaginea rasei selectate din:

```text
CharacterCreation/Rase/DisplayMenu
```

- imaginea se schimbă imediat când se schimbă selecția din carusel;
- câmpul `Race` afișează numele rasei selectate.

După selectarea unei clase:

- câmpul `Class` afișează numele clasei selectate;
- simbolul clasei apare în cercul superior al imaginii rasei din `DisplayMenu`;
- simbolul trebuie centrat vizual în cercul existent în fiecare imagine de rasă;
- fiecare rasă poate avea o configurație proprie pentru poziția X, poziția Y și dimensiunea simbolului, deoarece cercul diferă între imagini;
- se vor folosi simbolurile din `CharacterCreation/Class/ClassSymbols`.

## Atribute

- Fiecare rasă are un set propriu de modificatori de atribute.
- Fiecare clasă adaugă modificatori suplimentari peste valorile rasei.
- Valorile inițiale vor fi alese echilibrat pe baza rolului rasei și clasei.
- Panoul de atribute trebuie să actualizeze dinamic barele în funcție de valoarea fiecărui atribut.
- Atributele vizibile sunt:
  - Health;
  - Strength;
  - Dexterity;
  - Intelligence;
  - Charisma.
- Valorile calculate trebuie să fie reflectate atât vizual în bare, cât și în valorile derivate afișate, precum damage, dodge chance, mana pool și escape chance.

## Butoane și interacțiuni

- Efectele de interacțiune ale butoanelor trebuie reutilizate din folderul existent `frontend/src/styles`.
- Săgețile trebuie să aibă stări vizuale și animații la hover și click.
- `Continue` și `Back` trebuie să folosească asset-urile și efectele existente ale proiectului.
- Nu se vor crea efecte vizuale complet diferite de stilul deja folosit în aplicație.

## Cerințe de implementare

- Pagina trebuie conectată la fluxul existent al `MainMenu`.
- Selectarea unei rase și a unei clase trebuie păstrată în state-ul paginii.
- Caruselul trebuie să funcționeze circular fără index invalid.
- Selecția curentă trebuie actualizată imediat în `DisplayMenu` și în panoul de atribute.
- Implementarea trebuie să păstreze structura React/Vite existentă a proiectului.
- După implementare trebuie rulate build-ul și lint-ul frontend-ului.

## Elemente care pot fi decise în implementare

- valorile numerice exacte pentru atribute și bonusurile fiecărei rase/clase pot fi alese echilibrat în funcție de rolul fiecărei rase și clase;
- comportamentul de după apăsarea ultimului `Continue` din selectarea clasei;
- dacă numele personajului este obligatoriu înainte de continuare;
- lista exactă de rezistențe pentru fiecare rasă;
- textele complete pentru descrierea fiecărei rase și clase.
