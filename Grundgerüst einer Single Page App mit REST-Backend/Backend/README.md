Travelblog: Backend
=========================

Inhaltsverzeichnis
------------------

1. [Kurzbeschreibung](#kurzbeschreibung)
2. [Start mit Docker Compose](#start-mit-docker-compose)

Kurzbeschreibung
----------------

Dies ist der backendseitige REST-Webservice der Travelblog-App. Es handelt sich
um ein einfaches nodeJS-Projekt mit dem Webframework [Restify](http://restify.com/).
Die Schnittstelle des Webservices ist in der Datei `src/api/openapi.yaml`
beschrieben. Dieser REST-Webservice dient zu Kommunikation mit dem Backend.

Start mit Docker Compose
------------------------

Am einfachsten lässt sich die App mit Docker Compose aus dem Wurzelverzeichnis
heraus starten. Das dort abgelegte README beschriebt die dafür notwendigen
Befehle im Detail:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien

