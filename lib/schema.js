const os = require('os')
const path = require('path')
const fs2 = require('fs-extra')
const CreateLogger = require('debug')
const { EventEmitter } = require('events')
const Model = require('./model')
const { name: packageName } = require('../package.json')
const __logname = `${packageName}:schema`

const defaults = {
    folder: path.resolve(os.homedir(), '.data')
}

const defaultMeta = () => {
    return {
        models: {
            total: 0,
            data: {}
        },
        schemas: {
            total: 0,
            data: {}
        }
    }
}

const TYPE_MODEL = 'model'
const TYPE_SCHEMA = 'schema'

/**
 * Create / Get a schema
 */
class Schema extends EventEmitter {
    /**
     * Create a new schema instance
     * @example
     * const schema = new Schema({
     *   folder: 'path/to/schema'
     * })
     * 
     * @constructor
     * @param {SchemaConstructorOptions} options
     */
    constructor({
        folder = defaults.folder
    } = {}) {
        super()
        this.folder = folder
        this.modelFolder = path.resolve(folder, '.model')
        this.schemaFolder = path.resolve(folder, '.schema')
        this.filename = '_s_.json'
        this.metaFile = path.resolve(folder, this.filename)
        this.meta = null
        this.isNew = false
        
        this.__init()
    }

    __init() {
        // Create folder if not existed
        fs2.ensureDirSync(this.modelFolder)
        fs2.ensureDirSync(this.schemaFolder)
        // Load meta data if existed
        this.meta = fs2.pathExistsSync(this.metaFile) && fs2.readJsonSync(this.metaFile)
        if (!this.meta) {
            this.meta = defaultMeta()
            this.isNew = true
            this.__save_meta_file()
        }
    }

    __save_meta_file() {
        if (!this.meta || !this.metaFile) throw new TypeError('Schema not yet initialized')
        fs2.outputJsonSync(this.metaFile, this.meta) 
    }

    __key_validator(key) {
        if (typeof key !== 'string') return false
        const keys = [
            '_m_',
            '_s_',
            'model',
            'schema',
            path.basename(this.filename, '.json')
        ]
        return /^[\w\-]+$/i.test(key) && !keys.includes(key.toLowerCase().trim())
    }

    __key__(key) {
        if (!this.__key_validator(key)) throw new TypeError(`Invalid Key: ${key}`)
        return key.toLowerCase().trim()
    }

    __meta__(type) {
        if (!this.meta) throw new Error('Schema not yet initialized')
        type = type.toLowerCase().trim()
        if (![TYPE_MODEL, TYPE_SCHEMA].includes(type)) throw new Error(`Invalid Type: ${type}`)
        return this.meta[`${type}s`] || null
    }

    __get_folder_path(name, type) {
        const folder = path.resolve(type === TYPE_MODEL && this.modelFolder || this.schemaFolder, this.__key__(name))
        if (fs2.pathExistsSync(folder) && fs2.lstatSync(folder).isDirectory()) return folder
        return false
    }

    __count(type, {
        event = true
    } = {}) {
        const __funcname = 'count'
        let result = 0
        try {
            const meta = this.__meta__(type)
            result = meta && meta.total || 0
        } catch (error) {
            if (event) {
                this.emit('error', error, {
                    method: __funcname,
                    type
                })
            } else {
                throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
            }
        }
        return result
    }

    /**
     * Count of sub schemas
     * @example
     * const schema = new Schema()
     * console.log(schema.schemaCount())
     * 
     * @param {SchemaCountOptions} [options]
     * @returns {int}
     */
    schemaCount(options) {
        return this.__count(TYPE_SCHEMA, options)
    }

    /**
     * Count of sub models
     * @example
     * const schema = new Schema()
     * console.log(schema.modelCount())
     * 
     * @param {SchemaCountOptions} [options]
     * @returns {int}
     */
    modelCount(options) {
        return this.__count(TYPE_MODEL, options)
    }

    __keys(type, {
        event = true
    } = {}) {
        const __funcname = 'keys'
        let result = []
        try {
            const meta = this.__meta__(type)
            result = meta && meta.data && Object.keys(meta.data) || []
        } catch (error) {
            if (event) {
                this.emit('error', error, {
                    method: __funcname,
                    type
                })
            } else {
                throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
            }
        }
        return result
    }

    /**
     * All keys of sub schemas
     * @example
     * const schema = new Schema()
     * console.log(schema.schemaKeys())
     * 
     * @param {SchemaKeysOptions} [options]
     * @returns {Array}
     */
     schemaKeys(options) {
        return this.__keys(TYPE_SCHEMA, options)
    }

    /**
     * All keys of sub models
     * @example
     * const schema = new Schema()
     * console.log(schema.modelKeys())
     * 
     * @param {SchemaKeysOptions} [options]
     * @returns {Array}
     */
    modelKeys(options) {
        return this.__keys(TYPE_MODEL, options)
    }

    __has(type, name, {
        event = true
    } = {}) {
        const __funcname = 'has'
        let result = false
        try {
            const key = this.__key__(name)
            const meta = this.__meta__(type)
            if (meta && meta.data && meta.data[key]) result = true
        } catch (error) {
            if (event) {
                this.emit('error', error, {
                    method: __funcname,
                    type,
                    name
                })
            } else {
                throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
            }
        }
        return result
    }

    /**
     * Check existence of a specific sub schema
     * @example
     * const schema = new Schema()
     * console.log(schema.hasSchema('test'))
     * 
     * @param {string} name - name of the sub schema
     * @param {SchemaHasOptions} [options] 
     * @returns {boolean}
     */
    hasSchema(name, options) {
        return this.__has(TYPE_SCHEMA, name, options)
    }

    /**
     * Check existence of a specific sub model
     * @example
     * const schema = new Schema()
     * console.log(schema.hasModel('test'))
     * 
     * @param {string} name - name of the sub model
     * @param {SchemaHasOptions} [options] 
     * @returns {boolean}
     */
    hasModel(name, options) {
        return this.__has(TYPE_MODEL, name, options)
    }

    __get(type, name, {
        event = true
    } = {}) {
        const __funcname = 'get'
        let result = null
        try {
            const key = this.__key__(name)
            const meta = this.__meta__(type)
            result = meta && meta.data && meta.data[key] || null
        } catch (error) {
            if (event) {
                this.emit('error', error, {
                    method: __funcname,
                    type,
                    name
                })
            } else {
                throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
            }
        }
        return result
    }

    /**
     * Get meta data of the specific sub schema
     * @example
     * const schema = new Schema()
     * console.log(schema.getSchema('test'))
     * 
     * @param {string} name - name of the sub schema
     * @param {SchemaGetOptions} [options]
     * @returns {object | null}
     */
    getSchema(name, options) {
        return this.__get(TYPE_SCHEMA, name, options)
    }

    /**
     * Get meta data of the specific sub model
     * @example
     * const schema = new Schema()
     * console.log(schema.getModel('test'))
     * 
     * @param {string} name - name of the sub model
     * @param {SchemaGetOptions} [options]
     * @returns {object | null}
     */
    getModel(name, options) {
        return this.__get(TYPE_MODEL, name, options)
    }

    __del(type, name, {
        event = true
    } = {}) {
        const __funcname = 'del'
        try {
            const key = this.__key__(name)
            const meta = this.__meta__(type)
            const folder = this.__get_folder_path(key, type)
            if (meta && meta.data && meta.data[key]) {
                delete meta.data[key]
                meta.total--
                this.__save_meta_file()
                // remove folder
                if (folder && fs2.pathExistsSync(folder)) fs2.removeSync(folder)
                if (event) this.emit('deleted', key, type, name)
            }
        } catch (error) {
            if (event) {
                this.emit('error', error, {
                    method: __funcname,
                    type,
                    name
                })
            } else {
                throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
            }
        }
    }

    /**
     * Delete a specific sub schema
     * @example
     * const schema = new Schema()
     * schema.removeSchema('test')
     * 
     * @param {string} name - name of the specific sub schema
     * @param {SchemaDelOptions} [options] 
     */
    removeSchema(name, options) {
        return this.__del(TYPE_SCHEMA, name, options)
    }

    /**
     * Delete a specific sub model
     * @example
     * const schema = new Schema()
     * schema.removeModel('test')
     * 
     * @param {string} name - name of the specific sub model
     * @param {SchemaDelOptions} [options] 
     */
    removeModel(name, options) {
        return this.__del(TYPE_MODEL, name, options)
    }

    /**
     * Create or get an instance of sub model
     * @example
     * const schema = new Schema()
     * const model = schema.model('test')
     * 
     * @param {string} name - folder name of the sub model
     * @param {object} [index] - meta data of the sub model
     * @returns {Model}
     */
    model(name, index, {
        rules
    } = {}) {
        const __funcname = 'model'
        const debug = CreateLogger(`${__logname}:${__funcname}`)
        try {
            const key = this.__key__(name)
            const meta = this.__meta__(TYPE_MODEL)
            const result = new Model({
                folder: path.resolve(this.modelFolder, key),
                rules
            })
            result.on('error', (err, { method } = {}) => {
                debug(`Error occurred on Model method: ${method}, message: ${err && err.message}`)
            })
            if (result.isNew) {
                meta.data[key] = index || { id: key }
                meta.total++
                this.__save_meta_file()
            } else if (index) {
                meta.data[key] = index
                this.__save_meta_file()
            }
            return result
        } catch (error) {
            debug(`Error occurred: ${error && error.message}`)
            throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
        }
    }

    /**
     * Create or get an instance of sub schema
     * @example
     * const schema = new Schema()
     * const sub = schema.schema('test')
     * 
     * @param {string} name - folder name of the sub schema
     * @param {object} [index] - meta data of the sub schema
     * @returns {Schema}
     */
    schema(name, index) {
        const __funcname = 'schema'
        const debug = CreateLogger(`${__logname}:${__funcname}`)
        try {
            const key = this.__key__(name)
            const meta = this.__meta__(TYPE_SCHEMA)
            const result = new Schema({
                folder: path.resolve(this.schemaFolder, key)
            })
            result.on('error', (err, { method } = {}) => {
                debug(`Error occurred on Schema method: ${method}, message: ${err && err.message}`)
            })
            if (!this.hasSchema(key)) {
                meta.data[key] = index || { id: key }
                meta.total++
                this.__save_meta_file()
            } else if (index) {
                meta.data[key] = index
                this.__save_meta_file()
            }
            return result
        } catch (error) {
            debug(`Error occurred: ${error && error.message}`)
            throw new Error(error && error.message || `Fatal Error in ${__funcname}`)
        }
    }
}

/**
 * @typedef {Object} SchemaConstructorOptions
 * @property {string} [folder = '~/.data'] - Path of a folder in which data will be saved
 */

/**
 * @typedef {Object} SchemaCountOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered
 */

/**
 * @typedef {Object} SchemaKeysOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered
 */

/**
 * @typedef {Object} SchemaHasOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered
 */

/**
 * @typedef {Object} SchemaGetOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered
 */

/**
 * @typedef {Object} SchemaDelOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered
 */


module.exports = Schema
