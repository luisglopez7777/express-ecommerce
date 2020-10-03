const { MongoClient, ObjectId } = require('mongodb')
const { config } = require('../config')

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = config.dbName


// const MONGO_URI = `mongodb://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/?authSource=${DB_NAME}`
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`


// class MongoLib {
//     constructor() {
//         this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//         this.dbName = DB_NAME;
//     }

//     connect() {
//         return new Promise((resolve, reject) => {
//             this.client.connect(error => {
//                 if (error) {
//                     reject(error);
//                 }

//                 console.log("Connected succesfully to mongo");
//                 resolve(this.client.db(this.dbName));
//             });
//         });
//     }

//     getAll(collection, query) {
//         return this.connect().then(db => {
//             return db
//                 .collection(collection)
//                 .find(query)
//                 .toArray();
//         });
//     }

//     get(collection, id) {
//         return this.connect().then(db => {
//             return db.collection(collection).findOne({ _id: ObjectId(id) });
//         });
//     }



//     create(collection, data) {
//         return this.connect()
//             .then(db => {
//                 return db.collection(collection).insertOne(data);
//             })
//             .then(result => result.insertedId);
//     }

//     update(collection, id, data) {
//         return this.connect()
//             .then(db => {
//                 return db
//                     .collection(collection)
//                     .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
//             })
//             .then(result => result.upsertedId || id);
//     }

//     delete(collection, id) {
//         return this.connect()
//             .then(db => {
//                 return db.collection(collection).deleteOne({ _id: ObjectId(id) });
//             })
//             .then(() => id);
//     }
// }

// module.exports = MongoLib


class MongoLib {
    constructor() {
        console.log('MONGO_URI', MONGO_URI);
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = DB_NAME;
    }

    async connect() {
        if (!MongoLib.connection) {
            try {
                await this.client.connect()
                console.log('Connected successfully to mongo')
                MongoLib.connection = this.client.db(this.dbName)
            } catch (error) {
                console.log(error)
            }
        }
        return MongoLib.connection
    }

    async getAll(collection, query) {
        try {
            const db = await this.connect()
            return await db.collection(collection).find(query).toArray()
        } catch (error) {
            console.log(error)
        }
    }

    async get(collection, id) {
        try {
            const db = await this.connect()
            return await db.collection(collection).findOne({ _id: ObjectId(id) })
        } catch (error) {
            console.log(error)
        }
    }

    async create(collection, data) {
        try {
            const db = await this.connect()
            const result = await db.collection(collection).insertOne(data)
            return result.insertedId;
        } catch (error) {
            console.log(error)
        }
    }

    async update(collection, id, data) {
        try {
            const db = await this.connect()
            const result = await db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
            return result.upsertedId || id;
        } catch (error) {
            console.log(error)
        }
    }

    async delete(collection, id) {
        try {
            const db = await this.connect()
            await db.collection(collection).deleteOne({ _id: ObjectId(id) })
            return id;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = MongoLib;