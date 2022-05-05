"use strict";

/**
 * Einheitliche Klasse zur Kapselung aller Backendzugriffe. Diese Klasse
 * stellt eine interne Schnittstelle zur Verfügung, die es einfacher macht,
 * die Funktionen des Backends aufzurufen. Insbesondere versteckt sie die
 * HTTP-Kommunikation vor ihren Verwendern.
 */
export default class Backend {
    /**
     * Konstruktor.
     */
    constructor() {
        this._url = "";
    }

    /**
     * Abruf der Backend-URL aus der Datei `api.url`. Diese kann über die
     * Umgebungsvariable API_URL beim Start des Docker-Containers überschrieben
     * werden.
     */
    async init() {
        // Backend-URL abrufen
        let response = await fetch("api.url");
        this._url = await response.text();

        // Angehnängte Slashes entfernen
        while (this._url.endsWith("/")) {
            this._url = this._url.slice(0, this._url.length - 1);
        }
    }

    async fetch(method, url, options) {
        options = options || {};

        // Query-Parameter an die URL anhängen
        if (options.query) {
            let parameters = new URLSearchParams();

            for (name in options.query) {
                parameters.append(name, options.query[name]);
            }

            url = `${url}?${parameters}`;
        }

        // HTTP Verb, Header Fields und Body übernehmen
        let fetchOptions = {
            method: method,
            headers: options.headers || {},
            credentials: "include",
        };

        if (method !== "GET") {
            fetchOptions.headers["Content-Type"] = "application/json";

            if (options.body) {
                fetchOptions.body = JSON.stringify(options.body);
            }
        }

        fetchOptions.headers["Accept"] = "application/json";

        // REST-Webservice aufrufen
        let response = await fetch(`${this._url}${url}`, fetchOptions);

        if (response.ok) {
            return await response.json();
        } else {
            // Exception werfen, wenn ein Fehler empfangen wurde
            let contentType = response.headers.get("Content-Type");

            if (contentType.includes("json")) {
                throw await response.json();
            } else {
                throw {
                    code: "SERVER_ERROR",
                    message: `HTTP ${response.status} ${response.statusText}: ${await response.text()}`,
                };
            }
        }
    }
}
