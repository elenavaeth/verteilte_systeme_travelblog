"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
 * Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten einer Reise
 * zur Verfügung.
 */
export default class PageEdit extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {Integer} editId ID des bearbeiteten Datensatzes
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        this._dataset = {
            title: "",
            author: "",
            description: "",
            place: "",
            time: "",
        };

        // Eingabefelder
        this._titleInput = null;
        this._authorInput  = null;
        this._descriptionInput     = null;
        this._placeInput     = null;
        this._timeInput     = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();

        // Bearbeiteten Datensatz laden
        if (this._editId) {
            this._url = `/travel/${this._editId}`;
            this._dataset = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset.title}`;
        } else {
            this._url = `/travel`;
            this._title = "Reise hinzufügen";
        }

        // Platzhalter im HTML-Code ersetzen
        let html = this._mainElement.innerHTML;
        html = html.replace("$TITLE$", this._dataset.title);
        html = html.replace("$AUTHOR$", this._dataset.author);
        html = html.replace("$DESCRIPTION$", this._dataset.description);
        html = html.replace("$PLACE$", this._dataset.place);
        html = html.replace("$TIME$", this._dataset.time);
        this._mainElement.innerHTML = html;

        // Event Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder zur späteren Verwendung merken
        this._titleInput = this._mainElement.querySelector("input.title");
        this._authorInput  = this._mainElement.querySelector("input.author");
        this._descriptionInput     = this._mainElement.querySelector("input.description");
        this._placeInput     = this._mainElement.querySelector("input.place");
        this._timeInput     = this._mainElement.querySelector("input.time");
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
     * in die Listenübersicht zurück.
     */
    async _saveAndExit() {
        // Eingegebene Werte prüfen
        this._dataset._id        = this._editId;
        this._dataset.title = this._titleInput.value.trim();
        this._dataset.author  = this._authorInput.value.trim();
        this._dataset.description      = this._descriptionInput.value.trim();
        this._dataset.place      = this._placeInput.value.trim();
        this._dataset.time     = this._timeInput.value.trim();

        if (!this._dataset.title) {
            alert("Geben Sie erst einen Titel ein.");
            return;
        }

        // Datensatz speichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
            }
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/";
    }
};
