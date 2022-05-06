"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("travelblog");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let travels = this.database.collection("travels");
        let wishes = this.database.collection("wishes");
        let checks = this.database.collection("checks");

        if (await travels.estimatedDocumentCount() === 0) {
            travels.insertMany([
                {
                    title: "In der Hauptstadt Florenz der Region Toskana",
                    author: "Elena Väth",
                    description: "Florenz ist vor allem bekannt für seine zahlreichen Kunst- und Architektur-Meisterwerke. Zu den berühmtesten Sehenswürdigkeiten zählt die Kathedrale Duomo. Atemberaubende Arbeit des Baumeisters Brunelleschi!Die Galleria dell'Accademia zeigt Michelangelos Statue David. Ebenfalss ein toller Hotspot.",
                    place: "Florenz - Italien",
                    time: "2 Wochen",
                    
                    
                },
                {
                    title: "Mexiko und seine Fassetten",
                    author: "Ayse Kocak",
                    description: "Mexiko-City eine so lebendige, kosmopolitische Stadt. Ich habe die Tacos und das unglaubliche Street Food, das man praktisch an jeder Ecke finden kann, schon immer geliebt, aber jetzt dekonstruieren Köche wie Enrique Olvera klassische Rezepte und bringen sie auf die nächste Ebene. Dann gibt es die Kunstszene, in der es nicht mehr nur um ikonische Künstler des 20. Jahrhunderts wie Frida Kahlo und Diego Rivera geht, sondern um neue Kunstinstitutionen von Weltklasse wie das Soumaya und das Museo Jumex, die beide in den letzten fünf Jahren entstanden sind. Auf jedan Fall nennenswerte Zwischenziele.",
                    place: "Mexiko-City",
                    time: " 10 Tage",
                    
                },
                {
                    title: "Das Herz des Orients",
                    author: "Melda Aydin",
                    description: "Unglaubliche Vielfalt von Kulturen vereint in einer Stadt. Die Istiklal caddesi ist geschmückt von Kirchen, Moscheen und weiteren historischen Denkmälern. Alles vereint auf engstem Raum. Eine Bootfahrt über die Meerenge des Bosborus und der Besuch der Kiz Kullesi ist atemberaubend und ebenfalls zu empfehlen. Der Grand Bazar mit seinen bunten Gewürzen und multikulturellen Käufern ist auf jeden Fall Instagram würdig.",
                    place: "Istanbul - Türkei",
                    time: "2 Wochen",
                    
                },
                {
                    title: "Zwischen den Wolkenkratzern in New York",
                    author: "Hüma Yilmaz",
                    description: "The Edge Aussichtsplattform: die höchste offene Plattform in New York, mein absolutes Highlight, aber leider sehr voll. Der Blick von der Aussichtsplattform des Empire State Buildings ist atemberaubend und etwas, was du sicherlich nicht so schnell vergessen wirst. Ein absolutes Muss bei einem Besuch in New York! Um auch hier längere Wartezeiten zu vermeiden am besten früh am morgen schon kommen. Die Resie war viel zu kurz, nehmt euch für eine so große, überweltigende Stadt auf jeden Fall mehr Zeit.",
                    place: "New York - USA",
                    time: "5 Tage",
                    
                },
                {
                    title: "In der Weltmetropole Tokio",
                    author: "Sabine Müller",
                    description: "Hier triffen eine hochmoderne Stadt mit der neuesten Technik und einer grandiosen Architektur auf eine langwierige Kultur mit buddhistischen Tempeln und einem ausgeprägten Glauben. Eine Stadt mit so vielen Kontrasten und Sehenswürdigkeiten! Mein absolutes Highlight der Reise:die Shibuya Kreuzung. Überall sind leuchtende Werbetafeln, riesige Hochhäuser, unzählige, teils skurril gekleidete Japaner und Touristen und mittendrin man selbst in der Menge verloren. Noch nie habe ich mich so klein gefühlt! Ein unvergessliches Erlebnis.",
                    place: "Tokio Japan",
                    time: "1 Wochen",
                    
                },

            ]);
        }
        if (await wishes.estimatedDocumentCount() === 0) {
            wishes.insertMany([
                {
                    title: "In der Hauptstadt Florenz der Region Toskana",
                    author: "Elena Väth",
                    description: "Florenz ist vor allem bekannt für seine zahlreichen Kunst- und Architektur-Meisterwerke. Zu den berühmtesten Sehenswürdigkeiten zählt die Kathedrale Duomo. Atemberaubende Arbeit des Baumeisters Brunelleschi!Die Galleria dell'Accademia zeigt Michelangelos Statue David. Ebenfalss ein toller Hotspot.",
                    place: "Florenz - Italien",
                    time: "2 Wochen",
                }
            ]);
        }
        if (await checks.estimatedDocumentCount() === 0) {
            checks.insertMany([
                {
                    title: "Mexiko und seine Fassetten",
                    author: "Ayse Kocak",
                    description: "Mexiko-City eine so lebendige, kosmopolitische Stadt. Ich habe die Tacos und das unglaubliche Street Food, das man praktisch an jeder Ecke finden kann, schon immer geliebt, aber jetzt dekonstruieren Köche wie Enrique Olvera klassische Rezepte und bringen sie auf die nächste Ebene. Dann gibt es die Kunstszene, in der es nicht mehr nur um ikonische Künstler des 20. Jahrhunderts wie Frida Kahlo und Diego Rivera geht, sondern um neue Kunstinstitutionen von Weltklasse wie das Soumaya und das Museo Jumex, die beide in den letzten fünf Jahren entstanden sind. Auf jedan Fall nennenswerte Zwischenziele.",
                    place: "Mexiko-City",
                    time: " 10 Tage",
                    
                }
            ]);
        }
    }
}

export default new DatabaseFactory();
