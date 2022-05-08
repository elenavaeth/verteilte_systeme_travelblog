"use strict";

import Page from "../page.js";
import HtmlTemplate from "./wish-list.html";

/**
 * Klasse WishList: Stellt die Wunschlistenübersicht zur Verfügung
 */
export default class WishList extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Wunschliste";

        // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
        let data = await this._app.backend.fetch("GET", "/wish");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if (data.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();

        for (let index in data) {
            // Platzhalter ersetzen durch den ersten Wunsch
            let dataset = data[index];
            let html = templateHtml;

            html = html.replace("$ID$", dataset._id);
            html = html.replace("$TITLE$", dataset.title);
            html = html.replace("$AUTHOR$", dataset.author);
            html = html.replace("$DESCRIPTION$", dataset.description);
            html = html.replace("$PLACE$", dataset.place);
            html = html.replace("$TIME$", dataset.time);

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            // Event Handler registrieren
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
            liElement.querySelector(".action.check").addEventListener("click", () => this._addToChecklist(dataset._id));
        }
    }
    /**
     * Löschen des übergebenen Wunsches. Zeigt einen Popup, ob der Anwender
     * den Wunsch löschen will und löscht diese dann.
     *
     * @param {Integer} id ID des zu löschenden Datensatzes
     */
    async _askDelete(id) {
        // Sicherheitsfrage zeigen
        let answer = confirm("Soll der ausgewählte Wunsch wirklich gelöscht werden?");
        if (!answer) return;

        // Datensatz löschen
        try {
            this._app.backend.fetch("DELETE", `/wish/${id}`);
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // HTML-Element entfernen
        this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

        if (this._mainElement.querySelector("[data-id]")) {
            this._emptyMessageElement.classList.add("hidden");
        } else {
            this._emptyMessageElement.classList.remove("hidden");
        }
    }
        /**
     * Eine Kopie des Wunsches in die Checkliste einfügen. Ermöglicht dem Nutzer, seine abgeschlossenen Reisen
     * aus der Wunschliste auszuwählen und in die Checkliste zu kopieren.
     *
     * @param {Integer} id ID des  Datensatzes
     */
    async _addToChecklist(id) {
        // Sicherheitsfrage zeigen
        let answer = confirm("Wurde die ausgewählte Reise abgeschlossen?");
        if (!answer) return;

        // Datensatz speichern
        let dataset = await this._app.backend.fetch("GET", `/wish/${id}`);

        try {
            await this._app.backend.fetch("POST", `/check`, {body: dataset});
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Navigiere zur Checkliste
        location.hash = "#/check";
    }
};
