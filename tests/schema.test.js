const path = require('path')
const fs2 = require('fs-extra')
const { expect } = require('chai')
const Mock = require('mockjs')
const { Schema, Model } = require('../index')
const { instance } = require('./helper')

const DATAPATH = path.resolve(__dirname, '.data', instance)
fs2.ensureDir(DATAPATH)

describe('Schema', function() {
    this.timeout(0)
    const folder = path.resolve(DATAPATH, 'schema')
    const schema = new Schema({ folder })
    const key = Mock.mock('@word(10)')

    describe('#constructor', () => {
        it(`should create an instance of schema as well as the folder ${folder}`, () => {
            expect(schema).to.be.an.instanceOf(Schema)
            const folderCreated = fs2.pathExistsSync(folder)
            const metaCreated = fs2.pathExistsSync(schema.metaFile)
            expect(folderCreated).to.be.true
            expect(metaCreated).to.be.true
        })

        it(`should create meta file correctly`, () => {
            const meta = fs2.pathExistsSync(schema.metaFile) && fs2.readJsonSync(schema.metaFile)
            expect(meta).to.be.an('object').that.to.have.all.keys(['models', 'schemas'])
            expect(meta.models).to.be.an('object').that.to.have.all.keys(['total', 'data'])
            expect(meta.schemas).to.be.an('object').that.to.have.all.keys(['total', 'data'])
        })
    })

    describe('#schema', () => {
        const name = Mock.mock('@word(10)')
        const sub = schema.schema(name)
        it(`should create sub schema as well as the folder ${sub.folder}`, () => {
            expect(sub).to.be.an.instanceOf(Schema)
            const folderCreated = fs2.pathExistsSync(sub.folder)
            const metaCreated = fs2.pathExistsSync(sub.metaFile)
            expect(folderCreated).to.be.true
            expect(metaCreated).to.be.true
        })

        it(`should return count of sub schemas`, () => {
            schema.schema(Mock.mock('@word(10)'))
            let count = schema.schemaCount()
            expect(count).to.be.a('number').that.to.equal(2)
            
            schema.schema(name)
            count = schema.schemaCount()
            expect(count).to.be.a('number').that.to.equal(2)
        })
        
        it(`should return true if sub schema exists`, () => {
            const hasSchema = schema.hasSchema(name)
            expect(hasSchema).to.be.true
        })

        it(`should return false if sub schema not existed`, () => {
            const hasSchema = schema.hasSchema('ttt')
            expect(hasSchema).to.be.false
        })

        it(`should return meta of sub schema`, () => {
            const meta = schema.getSchema(name)
            expect(meta).to.be.an('object').that.to.have.all.keys(['id'])
            expect(meta.id).to.equal(name)
        })

        it(`should remove both folder and meta of specific sub schema`, () => {
            const folder = sub.folder
            const metaFile = sub.metaFile
            schema.removeSchema(name)
            const count = schema.schemaCount()
            expect(count).to.be.a('number').that.to.equal(1)
            const folderExist = fs2.pathExistsSync(folder)
            const metaExist = fs2.pathExistsSync(metaFile)
            expect(folderExist).to.be.false
            expect(metaExist).to.be.false
        })
    })

    describe('#model', () => {
        const name = Mock.mock('@word(10)')
        const sub = schema.model(name)
        it(`should create sub model as well as the folder ${sub.folder}`, () => {
            expect(sub).to.be.an.instanceOf(Model)
            const folderCreated = fs2.pathExistsSync(sub.folder)
            const metaCreated = fs2.pathExistsSync(sub.metaFile)
            expect(folderCreated).to.be.true
            expect(metaCreated).to.be.true
        })

        it(`should return count of sub models`, () => {
            schema.model(Mock.mock('@word(10)'))
            let count = schema.modelCount()
            expect(count).to.be.a('number').that.to.equal(2)

            schema.model(name)
            count = schema.modelCount()
            expect(count).to.be.a('number').that.to.equal(2)
        })
        
        it(`should return true if sub model exists`, () => {
            const has = schema.hasModel(name)
            expect(has).to.be.true
        })

        it(`should return false if sub model not existed`, () => {
            const has = schema.hasModel('ttt')
            expect(has).to.be.false
        })

        it(`should return meta of sub model`, () => {
            const meta = schema.getModel(name)
            expect(meta).to.be.an('object').that.to.have.all.keys(['id'])
            expect(meta.id).to.equal(name)
        })

        it(`should remove both folder and meta of specific sub model`, () => {
            const folder = sub.folder
            const metaFile = sub.metaFile
            schema.removeModel(name)
            const count = schema.modelCount()
            expect(count).to.be.a('number').that.to.equal(1)
            const folderExist = fs2.pathExistsSync(folder)
            const metaExist = fs2.pathExistsSync(metaFile)
            expect(folderExist).to.be.false
            expect(metaExist).to.be.false
        })
    })
})