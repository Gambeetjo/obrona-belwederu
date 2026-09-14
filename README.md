# Obrona Belwederu 3D

Gra przeglądarkowa w jednym pliku HTML, z Three.js r128. Otwórz `index.html` w przeglądarce. Połączenie internetowe jest potrzebne do pobrania Three.js i fontu.

## Sterowanie

- Ruch: WASD, strzałki lub lewy joystick dotykowy. Siła wychylenia kontroluje prędkość.
- Atak: Enter, lewy przycisk myszy lub przycisk ATAK; przytrzymanie ma tę samą szybkość co klikanie.
- Dash: spacja, Shift, prawy przycisk myszy lub UNIK. Chroni przed wszystkimi źródłami obrażeń.
- Pauza: P / Esc lub przycisk pauzy na telefonie. Utrata fokusu również pauzuje walkę.
- Instrukcja: H lub przycisk ?. Instrukcja zatrzymuje symulację i wraca do poprzedniego ekranu.

## Zmiany rozgrywki

- Działające podpalenie, rzut węglem i eksplozje węgla. Wybuchowy Węgiel pojawia się dopiero po zdobyciu Rzutu Węglem.
- Maksymalny Rzut Węglem + Wybuchowy Węgiel: eksplozja wypuszcza sześć odłamków.
- Maksymalne Latające Mleczko + Mleczna Tarcza: przechwycenie pocisku co sześć sekund; jedna butelka znika podczas odnowienia.
- Początek zamachu odbija wrogie pociski z podwójnymi obrażeniami. Odbity pocisk zwiększa ogłuszenie bossa o 35% progu.
- Fale specjalne: Oblężenie Poczty (Listonosze i MOPS z dwóch stron) oraz Sprint Ekoludków. Przeplatają się ze zwykłymi falami, z pominięciem fal bossów.
- Bossowie zatrzymują zegar fal. Mają indywidualne HP bez dodatkowego mnożnika fali. Zwycięstwo uruchamia kolejną falę po wyborze nagrody.
- Combo zwiększa mnożnik punktów do ×5. Pięć najlepszych wyników zapisuje się lokalnie w przeglądarce. Tryb WARMIA nie trafia do rankingu.
- Restart resetuje ulepszenia domu, efekty, wejście i kamerę. Zasoby usuniętych obiektów są zwalniane, gdy nie korzystają z nich już inne obiekty sceny.

## Testy

Wymagania: Node.js, pakiet `playwright` i zainstalowany Google Chrome. Testy uruchamiają odizolowaną przeglądarkę i nie używają osobistego profilu.

```sh
npm install --no-save playwright
node tests/gameplay.cjs
```

Można wskazać własną lokalizację Playwright zmienną `PLAYWRIGHT_MODULE`. Zrzut testowego widoku zapisuje się w `work/mobile.png`.

Testy obejmują działanie ulepszeń, obrażenia i obronę, podejście wrogów, fale bossów, kolejkę awansów, restart, pauzę instrukcji, odbijanie, ewolucje, zapis zwycięstwa, stabilność liczby geometrii i niezależność dotyku. Układ mobilny sprawdzono dodatkowo w emulacji Chrome 390×844. Nie zastępuje to testu wydajności na fizycznym telefonie ani pełnego strojenia balansu przez rozgrywkę.
