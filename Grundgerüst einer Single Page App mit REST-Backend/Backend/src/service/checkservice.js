"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Wünschen. Diese Klasse implementiert die
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
     * Wunsch suchen. Unterstützt wird lediglich eine ganz einfache Suche,
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
     * Speichern eines neuen Wunsches.
     *
     * @param {Object} check Zu speichernde Wunschdaten
     * @return {Promise} Gespeicherte Wunschdaten
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
     * Auslesen eines vorhandenen Wunsches anhand ihrer ID.
     *
     * @param {String} id ID dem gesuchten Wunsch
     * @return {Promise} Gefundene Wunschdaten
     */
    async read(id) {
        let result = await this._check.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Wunsches, durch Überschreiben einzelner Felder
     * oder des gesamten Wunschobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Wünsche
     * @param {[type]} travel Zu speichernde Wunschdaten
     * @return {Promise} Gespeicherte Wunschdaten oder undefined
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
     * Löschen eines Wunsches anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Wunsches
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._checks.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}