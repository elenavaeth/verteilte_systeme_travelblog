"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Wünschen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Reisen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class WishService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._wishes = DatabaseFactory.database.collection("wishes");
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
        let cursor = this._wishes.find(query, {
            sort: {
                place: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Wunsches.
     *
     * @param {Object} wish Zu speichernde Wunschdaten
     * @return {Promise} Gespeicherte Wunschdaten
     */
    async create(wish) {
        wish = wish || {};

        let newWish = {
            title: wish.title             || "",
            author:  wish.author          || "",
            description: wish.description || "",
            place: wish.place             || "",
            time: wish.time               || "",

        };

        let result = await this._wishes.insertOne(newWish);
        return await this._wishes.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines vorhandenen Wunsches anhand ihrer ID.
     *
     * @param {String} id ID dem gesuchten Wunsch
     * @return {Promise} Gefundene Wunschdaten
     */
    async read(id) {
        let result = await this._wishes.findOne({_id: new ObjectId(id)});
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
    async update(id, wish) {
        let oldWish = await this._wishes.findOne({_id: new ObjectId(id)});
        if (!oldWish) return;

        let updateDoc = {
            $set: {},
        }

        if (wish.title) updateDoc.$set.title = wish.title ;
        if (wish.author) updateDoc.$set.author  = wish.author;
        if (wish.description) updateDoc.$set.description  = wish.description;
        if (wish.place)updateDoc.$set.place = wish.place;
        if (wish.time) updateDoc.$set.time = wish.time;

        await this._wishes.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._wishes.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines Wunsches anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Wunsches
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._wishes.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}