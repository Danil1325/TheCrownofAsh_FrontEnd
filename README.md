# The Crown of Ash

**The Crown of Ash** este un joc fantasy cu atmosferă medievală, aventură, explorare și elemente de RPG. Jucătorul pornește într-o lume misterioasă, cu castele, munți, păduri și teritorii periculoase, unde va putea crea un personaj, explora locații, lupta și progresa.

> Proiectul este în dezvoltare. În acest moment este implementată partea de front-end și experiența vizuală inițială.

## Loading Screen

La deschiderea jocului apare un loading screen animat, cu bară de progres, efecte audio și tranziție către meniul principal.

<img width="1913" height="860" alt="{B53DB276-DA5A-4309-9C11-45A5185393B1}" src="https://github.com/user-attachments/assets/191a50b4-6e65-4c58-b38f-6c3faf617f7a" />


### Funcționalități loading screen

- Bară de progres animată de la 0% la 100%.
- Ramă fantasy pentru loading bar.
- Gradient roșu-negru pentru progres.
- Sunet de fundal în timpul încărcării.
- Efect de fade-out pentru imagine și muzică.
- Tranziție fluidă către meniul principal.
- Buton pentru pornirea sunetului când browserul blochează autoplay.

## Meniu principal

Meniul principal permite jucătorului să acceseze opțiunile de bază ale jocului:

- New Game
- Load Game
- Skills
- Options
- Log Out

<img width="1918" height="863" alt="{85A0528D-55DB-4843-8912-47A56551CEB7}" src="https://github.com/user-attachments/assets/c493c57d-991f-4c82-8572-eb60eadc3f44" />


## Setări

În meniul de setări sunt disponibile:

- Control pentru volumul muzicii.
- Control pentru volumul efectelor sonore.
- Activare/dezactivare fullscreen.
- Activare/dezactivare tutorial hints.
- Efect audio la apăsarea butoanelor.
- 
<img width="1914" height="867" alt="{FEE72B7D-7D41-449B-954C-F3A420590153}" src="https://github.com/user-attachments/assets/087e0037-2c88-4d27-859d-d00a0b241d72" />

## Tehnologii

- React
- TypeScript
- Vite
- CSS
- HTML Audio API

## Stadiul actual

Partea vizuală de bază este implementată:

- Loading screen complet.
- Meniu principal.
- Meniu de opțiuni.
- Sistem de sunete pentru loading și butoane.
- Tranziții între ecrane.
- Design responsive pentru desktop și mobil.

## Următorii pași

- Creare personaj.
- Sistem de salvări.
- Inventar.
- Hartă și explorare.
- Scene narative și alegeri.
- Sistem de luptă.
- Abilități și progresul personajului.

## Rulare locală

```bash
npm install
npm run dev
