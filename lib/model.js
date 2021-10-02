const os = require('os')
const path = require('path')
const fs2 = require('fs-extra')
const CreateLogger = require('debug')
const { EventEmitter } = require('events')
const { name: packageName } = require('../package.json')
const __logname = `${packageName}:model`

const defaults = {
    folder: path.resolve(os.homedir(), '.data')
}

const defaultMeta = () => {
    return {
        version: (new Date()).toISOString(),
        total: 0,
        data: {}
    }
}

/**
 * Create / Get a model
 */
class Model extends EventEmitter {
    /**
     * Create a new model instance
     * @example
     * const model = new Model({
     *   folder: 'path/to/model'
     * })
     * 
     * @constructor
     * @param {ModelConstructorOptions} options
     */
    constructor({
        folder = defaults.folder
    } = {}) {
        super()
        this.folder = path.resolve(folder, '.file')
        this.filename = '_m_.json'
        this.metaFile = path.resolve(folder, this.filename)
        this.meta = null
        this.isNew = false
        
        this.__init()
    }

    __init() {
        // Create folder if not existed
        fs2.ensureDirSync(this.folder)
        // Load meta data if existed
        this.meta = fs2.pathExistsSync(this.metaFile) && fs2.readJsonSync(this.metaFile)
        if (!this.meta) {
            this.meta = defaultMeta()
            this.isNew = true
            this.__save_meta_file()
        } else {
            // Migrated data of older version to folder .file
            // TODO
        }
    }

    __save_meta_file() {
        if (!this.meta || !this.metaFile) throw new TypeError('Model not yet initialized')
        this.meta.version = (new Date()).toISOString()
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

    __get_file_path(key) {
        return path.resolve(this.folder, `${this.__key__(key)}.json`)
    }

    /**
     * Check existence of a model with specific key. 
     * @example
     * const model = new Model()
     * model.on('missed', key => console.log(`${key} is missing`))
     * model.has('test')
     * 
     * @param {string} key 
     * @param {ModelHasOptions} options
     * 
     * @returns {boolean}
     */
    has(key, {
        event = true
    } = {}) {
        if (!this.meta) throw new Error('Model not yet initialized')
        key = this.__key__(key)

        const exists = this.meta.total > 0 && this.meta.data && !!this.meta.data[key] || false
        if (!exists && event) this.emit('missed', key)

        return exists
    }

    /**
     * Get count of the objects
     * @example
     * const model = new Model()
     * console.log(model.count())
     * 
     * @returns {int}
     */
    count() {
        return this.meta && this.meta.total || 0
    }

    /**
     * Get all keys of the objects
     * @example
     * const model = new Model()
     * console.log(model.keys())
     * 
     * @returns {Array}
     */
    keys() {
        const data = this.meta && this.meta.data || {}
        return Object.keys(data)
    }

    /**
     * Get version of the model
     * @example
     * const model = new Model()
     * console.log(model.version())
     * 
     * @returns {string}
     */
    version() {
        return this.meta && this.meta.version || (new Date()).toISOString()
    }

    /**
     * Get object with specific key, null will be returned if object not existed
     * @example
     * const model = new Model()
     * model.on('error', (func, err, { key } = {}) => console.log(func, key, err))
     * const data = model.get('key1')
     * console.log(data)
     * 
     * @param {string} key - ID of an object
     * @param {ModelGetOptions} options
     * 
     * @returns {object | null}
     */
    get(key, {
        event = true,
        housekeep = false
    } = {}) {
        const __funcname = 'get'
        let data = null
        try {
            key = this.__key__(key)
            const file = this.__get_file_path(key)
            if (this.has(key, { event })) {
                data = fs2.pathExistsSync(file) && fs2.readJsonSync(file) || null
            } else if (housekeep && fs2.pathExistsSync(file)) {
                this.del(key, { event: false, real: true })
            }
        } catch (error) {
            if (event) {
                this.emit('error', error, { method: __funcname, key })
            } else {
                throw new Error(error && error.message || 'Fatal Error')
            }
        }
        return data
    }

    /**
     * Delete object with specific key
     * @example
     * const model = new Model()
     * model.on('deleted', (key, data) => console.log('deleted', key, data))
     * model.on('error', (func, err, { key } = {}) => console.log(func, key, err))
     * model.del('key1')
     * 
     * @param {string} key - ID of an object
     * @param {ModelDelOptions} options 
     */
    del(key, {
        event = true,
        real = true
    } = {}) {
        const __funcname = 'del'
        try {
            key = this.__key__(key)
            const file = this.__get_file_path(key)
            // Update meta
            if (this.has(key, { event })) {
                delete this.meta.data[key]
                this.meta.total--
                this.__save_meta_file()
            }
            // Delete file
            if (real && fs2.pathExistsSync(file)) {
                const data = fs2.readJsonSync(file)
                if (event) {
                    fs2.removeSync(file)
                    this.emit('deleted', key, data)
                } else {
                    fs2.removeSync(file)
                    return { key, data }
                }
            } else {
                if (event) {
                    this.emit('deleted', key, null)
                } else {
                    return { key }
                }
            }
        } catch (error) {
            if (event) {
                this.emit('error', error, { method: __funcname, key })
            } else {
                throw new Error(error && error.message || 'Fatal Error')
            }
        }
    }

    /**
     * Create of update an object with specific key
     * @example
     * const model = new Model()
     * model.on('error', (func, err, { key, value, index } = {}) => console.log(func, key, err, value, index))
     * model.on('set', (key, value, index, old) => console.log(key, value, index, old))
     * model.set('key1', { name: 'Ben' })
     * 
     * @param {string} key - ID of an object
     * @param {object} value - Data to be saved in the JSON file
     * @param {object | undefined} index - Data to be saved in meta
     * @param {ModelSetOptions} options 
     */
    set(key, value = {}, index = undefined, {
        override = true,
        event = true,
        saveMeta = true
    } = {}) {
        const __funcname = 'set'
        try {
            key = this.__key__(key)
            const file = this.__get_file_path(key)
            const isNew = !this.has(key, { event})
            const old = !isNew && fs2.pathExistsSync(file) && fs2.readJsonSync(file) || null
            // Save file
            let data = Object.assign({
                createdAt: old && old.createdAt || Date.now()
            }, value, {
                updatedAt: Date.now()
            })
            if (!override && old) data = Object.assign({}, old, value, {
                updatedAt: Date.now()
            })
            if (isNew) data.createdAt = data.updatedAt
            fs2.outputJsonSync(file, data)
            // Update meta
            if (isNew) {
                this.meta.data[key] = index || { id: key }
                this.meta.total++
                if (saveMeta) this.__save_meta_file()
            } else if (!!index) {
                this.meta.data[key] = index
                if (saveMeta) this.__save_meta_file()
            }
            if (event) this.emit('set', key, value, index, old)
        } catch (error) {
            if (event) {
                this.emit('error', error, { method: __funcname, key, value, index })
            } else {
                throw new Error(error && error.message || 'Fatal Error')
            }
        }
    }

    /**
     * Get the first object which the comparator returns true
     * @example
     * const model = new Model()
     * const data = model.find(item => item.id === 'key1')
     * console.log(data)
     * 
     * @param {function} comparator
     * 
     * @returns {ModelFindReturns | null}
     */
    find(comparator = (obj) => { return false }, {
        loadData = true
    } = {}) {
        let result = null
        if (this.meta && this.meta.data) {
            for (const [key, index = {}] of Object.entries(this.meta.data)) {
                const file = this.__get_file_path(key)
                if (comparator(index)) {
                    const data = loadData && fs2.pathExistsSync(file) && fs2.readJsonSync(file) || undefined
                    result = { id: key, data, options: index }
                    break
                }
            }
        }
        return result
    }

    /**
     * Get all objects which the comparator returns true
     * @example
     * const model = new Model()
     * const data = model.findAll(item => item.role === 'admin')
     * console.log(data)
     * 
     * @param {function} comparator
     * @param {PaginateOptions} options
     * 
     * @returns {ModelFindReturns[]}
     */
    findAll(comparator = (obj) => { return true }, {
        offset = 0,
        limit = 0
    } = {}) {
        if (!this.meta) throw new Error('Model not yet initialized')
        offset = parseInt(offset) || 0
        limit = parseInt(limit) || 0
        const result = []
        let match = 0
        let valid = 0
        for (const [key, index = {}] of Object.entries(this.meta.data || {})) {
            const file = this.__get_file_path(key)
            if (comparator(index)) {
                match += 1
                if (match > offset) {
                    const data = fs2.pathExistsSync(file) && fs2.readJsonSync(file) || null
                    if (data) {
                        result.push({ id: key, data, options: index })
                        valid += 1
                        if (limit > 0 && valid === limit) break
                    }
                }
            }
        }
        return result
    }

    /**
     * Bulk create or update objects
     * @example
     * const model = new Model()
     * model.mset({
     *   'key1': {
     *     value: { id: 'key1' }
     *   },
     *   'key2': {
     *     value: { id: 'key2', name: 'Ben', role: 'admin' }
     *     index: { role: 'admin' }
     *   }
     * })
     * 
     * @param {object} data 
     * @param {ModelSetOptions} options 
     */
    mset(data, {
        override = true,
        event = true,
        saveMeta = true
    } = {}) {
        const __funcname = 'mset'
        const debug = CreateLogger(`${__logname}:${__funcname}`)
        try {
            if (!data || Array.isArray(data) || typeof data !== 'object') throw new TypeError('Invalid Data')
            for (const [id, { value = {}, index = { id }}] of Object.entries(data)) {
                this.set(id, value, index, {
                    override,
                    saveMeta: false,
                    event: false
                })
            }
            if (saveMeta) this.__save_meta_file()
        } catch (error) {
            debug(`Error occurred, message: ${error && error.message}`)
            if (event) {
                this.emit('error', error, { method: __funcname, data })
            } else {
                throw new Error(error && error.message || 'Fatal Error')
            }
        }
    }

    /**
     * Delete all objects
     * @example
     * const model = new Model()
     * model.delAll()
     * 
     * @param {ModelDelOptions} options 
     */
    delAll({
        event = true,
        real = true
    } = {}) {
        if (!this.meta) throw new Error('Model not yet initialized')
        if (real) {
            Object.keys(this.meta.data).forEach(key => this.del(key, { event, real }))
        } else {
            this.meta = defaultMeta()
            this.__save_meta_file()
        }
    }
}

/**
 * @typedef {Object} ModelConstructorOptions
 * @property {string} [folder = '~/.data'] - Path of a folder in which data will be saved
 */

/**
 * @typedef {Object} ModelHasOptions
 * @property {boolean} [event = true] - Indicates whether 'missed' event is triggered if not found
 */

/**
 * @typedef {Object} ModelGetOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered if not found
 * @property {boolean} [housekeep = false] - Indicates whether the JSON file will be removed when key not found but the data file exists
 */

/**
 * @typedef {Object} ModelDelOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered if not found
 * @property {boolean} [real = true] - Indicates whether the JSON file will be really removed, if false, JSON file won't be delete but just delete key in meta
 */

/**
 * @typedef {Object} ModelSetOptions
 * @property {boolean} [event = true] - Indicates whether event is triggered if not found
 * @property {boolean} [override = true] - Indicates whether content of the JSON file will be overrided by the value in parameters
 * @property {boolean} [saveMeta = true] - Indicates whether meta file will be updated immediate
 */

/**
 * @typedef {Object} ModelFindReturns
 * @property {string} key - ID of the object
 * @property {object} data - The data saved in JSON file
 * @property {object} options - The data saved in meta
 */

/**
 * @typedef {Object} PaginateOptions
 * @property {int} [offset = 0] - The first {offset} matched items are ignored
 * @property {int} [limit = 0] - Page size, if it is 0 then no limit
 */

module.exports = Model
