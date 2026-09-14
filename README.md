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
- Początek zamachu odbija wrogie pociski z podwójnymi obrażeniami. Odbity pocisk zwiększa ogłuszenie bossa o 20% progu.
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

## Łagodniejszy początek

Fale 1–3 zaczynają się od 3, 3 i 4 przeciwników; dodatkowi wrogowie pojawiają się o 35% rzadziej (fala 4: o 15%). Fale specjalne zaczynają się od fali 6. Sam dotyk zwykłego wroga nie rani: atak wręcz ma 0,32 s zamachu i ponownie sprawdza zasięg. Listonosz i Młodzież Bandycka ranią przy dotyku co najwyżej raz na 0,75 s. Od fali 16 Listonosza zastępuje Młodzież Bandycka z podwójnym HP i obrażeniami, przy tej samej prędkości i częstotliwości strzałów. Gimbus daje 1 XP, Latex 3 XP, Listonosz 3 XP, a Młodzież Bandycka 7,5 XP.

## Legendarny Piesek Nerko

Od fali 15 każdy wybór ulepszenia ma 25% szansy na złotą kartę Pieska Nerko (zastępuje jedną ze zwykłych kart). Można go zdobyć tylko raz w rozgrywce. Owczarek niemiecki ściga najbliższego żywego Listonosza lub Młodzież Bandycką i utrzymuje cel do jego śmierci. Gryzie jednego wroga co 0,65 s, zadając połowę aktualnych bazowych obrażeń Konona, bez krytyków i efektów kulachy. Nie otrzymuje obrażeń; bez celu biega wokół gracza. Restart usuwa towarzysza.

## Presja bossów i cele Nerko

Bossowie mają o 35% więcej HP i o 25% większą prędkość niż poprzednio oraz częściej używają umiejętności. Próg ogłuszenia wzrósł o 50%, a po jego zakończeniu boss przez 4 s nie zbiera nowego staggeru (nadal otrzymuje obrażenia). Odbicie pocisku daje 20% progu staggeru. Każda zwykła fala od 16 zaczyna się z co najmniej dwoma M. Bandyckimi. Nerko przy braku dystansowych atakuje innych zwykłych wrogów, ale nie bossów; pojawienie się dystansowego natychmiast zmienia jego priorytet.
