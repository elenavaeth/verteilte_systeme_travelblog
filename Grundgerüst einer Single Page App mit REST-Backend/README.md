Anwendung: Travelblog
=================================

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 2. [Start mit Docker Compose](#start-mit-docker-compose)
 

Kurzbeschreibung
----------------

Bei dieser Anwendung handelt es sich um einen Travelblog, der als einfache Single Page App
zur Verwaltung von Reisedaten implementiert wurde. Unsere App bietet Nutzern eine Plattform,
auf der sie ihre Reisen und Erfahrungen teilen können. Verschiedene Reisen können hinzugefügt,
bearbeitet und auch wieder gelöscht werden. Ein Eintrag in den Reiseblog besteht aus einem Titel,
einem Autor, einer Beschreibung, einer Ortsangabe und einer Aufenthaltsdauer. 
Die Applikation beinhaltet das Feature einer Wunschliste. Die verschiedenen geteilten Reisen
können vom Benutzer auf eine Wunschliste gesetzt werden. Somit können sich die verschiedenen
Nutzer individuelle Reisepläne zusammenstellen. 
Darüber hinaus besitzt die Anwendung das Feature, die in der Wunschliste gespeicherten Reisen
als "abgeschlossen" zu markieren. Abgeschlossene Reisen werden in einer separaten Liste angezeigt,
damit die Benutzer der Applikation eine Übersicht über bereits abgeschlossene Reisen haben.

Diese Anwendung beinhaltet neben der Benutzeroberfläche des Travelblogs auch ein vollständiges
REST-Backend zur Ablage der Reisen, Wünsche und abgeschlossenen Reisen in einer zentralen 
Datenbank.

Start mit Docker Compose
------------------------

Das Wurzelverzeichnis beinhaltet zwei Docker Compose Files, mit denen die
Anwendung im Entwicklungs- oder Produktivmodus gestartet werden kann:

 * `docker-compose.dev.yml`: Entwicklungsmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. MongoDB Admin GUI (erreichbar auf http://localhost:8081)
     3. Backend (erreichbar auf http://localhost:3000)
     4. Frontend (erreichbar auf http://localhost:8080)

 Frontend und Backend führend den lokalen Quellcode in einer einfachen
 Node.js-Laufzeitumgebung aus. Änderungen werden dadurch sofort aktiv, wobei
 sich das Backend bei einer Änderung automatisch neustartet und bei einer
 Änderung am Frontend einfach nur die Seite im Browser neugeladen werden
 muss.

 * `docker-compose.prod.yml`: Produktivmodus mit folgenden Diensten:

     1. MongoDB (von Außen nicht erreichbar)
     2. Backend (von Außen nicht erreichbar)
     3. Frontend (von Außen nicht erreichbar)
     4. Gateway (erreichbar auf http://localhost:8080)

Im Unterschied zum Entwicklungsmodus werden hier anhand der in den jeweiligen
Verzeichnissen abgelegten Datei `Dockerfile` eigenständige Container Images
für Frontend und Backend gebaut und ausgeführt. Der Quellcode wird hierfür
einmalig in die Images hinein kopiert, so dass Änderungen daran erst wirksam
werden, wenn die Images neu erstellt werden. Dies kann entweder in den
jeweiligen Verzeichnissen manuell oder durch Neustarten von Docker Compose
erreicht werden.

Ebenso sind die meisten Services in dieser Version von Außen nicht mehr
erreichbar, sondern hinter einem Gateway-Server versteckt. Die Architektur
sieht somit in etwa so aus:

```mermaid
graph LR
    E(Externe Aufrufer) --> G[Gateway];
    G[Gateway] --> F[Frontend];
    G[Gateway] --> B[Backend];
    B[Backend] --> M[MongoDB];
```

Das Vorgehen zum Starten und Stoppen der Anwendung ist für beide Modus gleich.
Lediglich der Dateiname muss in den folgenden Befehlen angepasst werden:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

Im Falle der Produktivversion werden die Container für Frontend und Backend von
Docker Compose nur einmalig gebaut, dann aber nicht mehr erneut gebaut, wenn
sich der zugrunde liegende Quellcode verändert. Vor der nächsten Ausführung
müssen sie daher bei einer Änderung mit folgendem Befehl erneut gebaut werden:

```sh
docker-compose -f docker-compose.prod.yml build
```

In der Produktivversion kann durch Setzen der Umgebungsvariable API_URL die
Adresse des Backendservices definiert werden, mit der sich das Frontend zu
verbinden versucht:

```sh
export API_URL=http://api.beispiel.de
docker-compose -f docker-compose.prod.yml up -d
```

Dies Funktioniert, indem die Umgebungsvariable in der `docker-compose.prod.yml`
an die gleichnamige Umgebungsvariable des Frontend-Containers übergeben und
bei dessen Start durch ein Startskript ausgewertet wird. Das Skript schreibt
den Inhalt in eine statische Datei, die das Frontend unter der Addresse
`api.url` abrufen kann. Der Mechanismus ist im Grunde genommen derselbe, wie
Docker ihn für "Secrets" und "Configs" bereitstellt. Auch diese werden einfach
über eine Datei im Container sichtar gemacht. Leider bietet Docker diese
Funktion aber nur in Zusammenhang mit Docker Swarm an. Zwar lässt sich die
App unverändert auch mit Docker Swarm ausführen, dies wird hier allerdings
absichtlicht nicht beschrieben, da es auf Docker Compose aufbaut und Docker
Compose davon abgesehen für uns zunächst ausreicht.
