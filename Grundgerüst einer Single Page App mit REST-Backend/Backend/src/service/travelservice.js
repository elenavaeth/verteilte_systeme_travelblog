"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Reisen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Reisen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class TravelService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._travels = DatabaseFactory.database.collection("travels");
    }

    /**
     * Reisen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Reisen
     */
    async search(query) {
        let cursor = this._travels.find(query, {
            sort: {
                place: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Reise.
     *
     * @param {Object} travel Zu speichernde Reisedaten
     * @return {Promise} Gespeicherte Reisedaten
     */
    async create(travel) {
        travel = travel || {};

        let newTravel = {
            title: travel.title             || "",
            author:  travel.author          || "",
            description: travel.description || "",
            place: travel.place             || "",
            time: travel.time               || "",
            
        };

        let result = await this._travels.insertOne(newTravel);
        return await this._travels.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Reise anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Reise
     * @return {Promise} Gefundene Reisedaten
     */
    async read(id) {
        let result = await this._travels.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Reise, durch Überschreiben einzelner Felder
     * oder des gesamten Reiseobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Reise
     * @param {[type]} travel Zu speichernde Reisedaten
     * @return {Promise} Gespeicherte Reisedaten oder undefined
     */
    async update(id, travel) {
        let oldTravel = await this._travels.findOne({_id: new ObjectId(id)});
        if (!oldTravel) return;

        let updateDoc = {
            $set: {},
        }

        if (travel.title) updateDoc.$set.title = travel.title ;
        if (travel.author) updateDoc.$set.author  = travel.author;
        if (travel.description) updateDoc.$set.description  = travel.description;
        if (travel.place)updateDoc.$set.place = travel.place;
        if (travel.time) updateDoc.$set.time = travel.time; 

        await this._travels.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._travels.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Reise anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Reise
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._travels.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}