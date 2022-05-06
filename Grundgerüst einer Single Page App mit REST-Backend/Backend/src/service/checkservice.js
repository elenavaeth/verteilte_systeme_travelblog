"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von abgeschlossenen Reisen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Reisen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class CheckService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._checks = DatabaseFactory.database.collection("checks");
    }

    /**
     * Abgeschlossene Reisen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Wünsche
     */
    async search(query) {
        let cursor = this._checks.find(query, {
            sort: {
                place: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen abgeschlossenen Reise.
     *
     * @param {Object} check Zu speichernde Reisedaten
     * @return {Promise} Gespeicherte Reisedaten
     */
    async create(check) {
        check = check || {};

        let newCheck = {
            title: check.title             || "",
            author:  check.author          || "",
            description: check.description || "",
            place: check.place             || "",
            time: check.time               || "",

        };

        let result = await this._checks.insertOne(newCheck);
        return await this._checks.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen abgeschlossenen Reise anhand ihrer ID.
     *
     * @param {String} id ID der abgeschlossenen Reise
     * @return {Promise} Gefundene Reisedaten
     */
    async read(id) {
        let result = await this._check.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer abgeschlossenen Reise, durch Überschreiben einzelner Felder
     * oder des gesamten Reiseobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten abgeschlossenen Reisen
     * @param {[type]} travel Zu speichernde Reisedaten
     * @return {Promise} Gespeicherte Reisedaten oder undefined
     */
    async update(id, check) {
        let oldCheck = await this._checks.findOne({_id: new ObjectId(id)});
        if (!oldCheck) return;

        let updateDoc = {
            $set: {},
        }

        if (check.title) updateDoc.$set.title = check.title ;
        if (check.author) updateDoc.$set.author  = check.author;
        if (check.description) updateDoc.$set.description  = check.description;
        if (check.place)updateDoc.$set.place = check.place;
        if (check.time) updateDoc.$set.time = check.time;

        await this._checks.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._checks.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer abgeschlossenen Reise anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten abgeschlossenen Reise
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._checks.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}