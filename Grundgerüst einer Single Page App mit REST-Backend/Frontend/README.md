Travelblog: Frontend
==========================

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 2. [Start mit Docker Compose](#start-mit-docker-compose)

Kurzbeschreibung
----------------

Dies ist die clientseitige Single Page App mit dem Frontend des Travelblogs.
Es handelt sich dabei um eine einfache Webanwendung, die mit einfachem Javascript
ohne zusätzlichem Framework realisiert wurde.
Die Web-Applikation besteht aus einer Navigationsleiste mit verschiedenen Elementen.
Unter "Reisen", werden dem Benutzer alle gespeicherten Reisen des Travelblogs aufgelistet.
Man sieht alle Einträge mit Titel, Autor, Beschreibung, Ort und Dauer. Jeder Eintrag hat 
einen Button zum Bearbeiten. Man wird auf den Navigationspunkt "Reise bearbeiten" weitergeleitet
und kann Eingaben korrigieren und die Änderungen dann anschließend speichern. Neben dem Button
zum Bearbeiten besitzt jeder Eintrag auch einen Button zum Löschen. Über den Button "In die 
Wunschliste" können die verschiedenen Reisen in eine Wunschliste gespeichert werden. Man wird
auf den Navigationspunkt "Wunschliste" weitergeleitet und sieht dort eine Liste aller 
gespeicherten Wunschreiseziele. Einträge aus der Wunschliste können wieder gelöscht werden.
Ein Eintrag aus der Wunschliste kann als "abgeschlossen" markiert werden, wird somit aus der 
Wunschliste gelöscht und in der Liste mit den abgeschlossenen Reisen gespeichert. Alle abgeschlossenen
Reisen können unter dem entsprechenden Navigationelement erreicht werden. 

Start mit Docker Compose
------------------------

Am einfachsten lässt sich die App mit Docker Compose aus dem Wurzelverzeichnis
heraus starten. Das dort abgelegte README beschriebt die dafür notwendigen
Befehle im Detail:

 * `docker-compose -f docker-compose.dev.yml up -d` zum Starten aller Dienste
 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 * `docker system prune` zum Aufräumen nicht mehr benötigter Dateien
