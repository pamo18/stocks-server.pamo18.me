## jsramverk, Stocks server

Denna micro-service hanterar prisarna till Trading Plattformen Pamocoin Pro deployed at [stocks-server.pamo18.me](https://stocks-server.pamo18.me)

## Realtid

Micro-servicen är byggt med JavaScript ramverket Express och webbsocket [socket.io](https://socket.io/).  Med en webbsocket kan man öppna upp en kommunikations portal som är konstant uppkopplade för att kunna skicka och ta emot data med minimala resurser.  Denna teknik kallas för realtidskommunikation och används i Trading Plattformen för att hantera prisarna för de olika digitala valutorna.  För att matematisk simulerar marknadspriserna används en Wiener process.  Tjänsten startas med fyra olika objekt ihop med relaterande priskonfigurationer.  De två stycken digitala valutor, PamoCoin och BTHCoin, har var sin priskonfiguration mot kronor samt var sin priskonfiguration mot varandra.  Det blir då fyra olika prissättningar som är helt oberoende av varandra, något som fungerar för denna Trading Plattform men inte är verklighets realistiskt eftersom prissättningen är oftast påverkade av andra valutor i marknaden samt många andra faktorer som är svåra att återskapa programmeringsmässigt.

Funktionen för att uppdatera prisarna är kallade regelbundet varje fem sekunder och resultatet är skickat genom webbsocketen direkt till klienten.  Klienten är konfigurerat mot denna micro-service webbsocket och är kopplade till olika funktioner beroende på vad som skickas.  Med hjälp av NoSQL databasen MongoDB lagras 2 dagar med prisändringarna innan databasen återställs.  Dessa lagrade priser används sedan av klienten för att snabbt rita ut 500 prisändringar.

för att kunna relativt snabbt återskapa pris statistiken på klientsidan.

Trade sidan i klienten grafiskt presenterar nuvarande priser med hjälp av en Rickshaw Graph.  Denna sida visar också de aktuella priserna hämtade från denna micro-service prishanterare.  Som hjälpmedel till användaren är varje prisändring grafiskt presenterad mot tiden i grafen, där det finns fyra olika grafer att välja emellan.  Varje graf är färgkodad för enklare visning och det finns en grafväljare meny för att enkelt visa eller gömma de önskade grafer.  När Trade sidan först laddas, ritas det ut en ny graf med nuvarande priser, eller man kan simulera 500 prisändringar genom att klicka på knappen ’Simulate 500’, där resultatet visas efter några sekunder.  Funktionalitet för Rickshaw Graph importeras i Trade komponenten på klienten.  Varje gång priserna uppdateras aktiveras en funktion i komponenten för att ta emot de nya priserna och uppdatera den kopplade Rickshaw Graph.

Realtidskommunikation med en webbsocket är ett väldigt kraftfullt verktyg och skapar funktionalitet som annars är mer komplicerade och resurs intensiva.  Den är speciellt effektiv när data behöver skickas snabbt och kontinuerligt i båda riktningar mellan en server och klient.  Som prishanterare för denna Trading Platform är en webbsocket en väldigt effektiv teknik att använda.
