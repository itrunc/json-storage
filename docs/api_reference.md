## Classes

<dl>
<dt><a href="#Model">Model</a></dt>
<dd><p>Create / Get a model</p>
</dd>
<dt><a href="#Schema">Schema</a></dt>
<dd><p>Create / Get a schema</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ModelConstructorOptions">ModelConstructorOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ModelHasOptions">ModelHasOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ModelGetOptions">ModelGetOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ModelDelOptions">ModelDelOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ModelSetOptions">ModelSetOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ModelFindReturns">ModelFindReturns</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PaginateOptions">PaginateOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SchemaConstructorOptions">SchemaConstructorOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SchemaCountOptions">SchemaCountOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SchemaHasOptions">SchemaHasOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SchemaGetOptions">SchemaGetOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SchemaDelOptions">SchemaDelOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Model"></a>

## Model
Create / Get a model

**Kind**: global class  

* [Model](#Model)
    * [new Model(options)](#new_Model_new)
    * [.has(key, options)](#Model+has) ⇒ <code>boolean</code>
    * [.count()](#Model+count) ⇒ <code>int</code>
    * [.keys()](#Model+keys) ⇒ <code>Array</code>
    * [.version()](#Model+version) ⇒ <code>string</code>
    * [.get(key, options)](#Model+get) ⇒ <code>object</code> \| <code>null</code>
    * [.del(key, options)](#Model+del)
    * [.set(key, value, index, options)](#Model+set)
    * [.find(comparator)](#Model+find) ⇒ [<code>ModelFindReturns</code>](#ModelFindReturns) \| <code>null</code>
    * [.findAll(comparator, options)](#Model+findAll) ⇒ [<code>Array.&lt;ModelFindReturns&gt;</code>](#ModelFindReturns)
    * [.mset(data, options)](#Model+mset)
    * [.delAll(options)](#Model+delAll)

<a name="new_Model_new"></a>

### new Model(options)
Create a new model instance


| Param | Type |
| --- | --- |
| options | [<code>ModelConstructorOptions</code>](#ModelConstructorOptions) | 

**Example**  
```js
const model = new Model({  folder: 'path/to/model'})
```
<a name="Model+has"></a>

### model.has(key, options) ⇒ <code>boolean</code>
Check existence of a model with specific key.

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| options | [<code>ModelHasOptions</code>](#ModelHasOptions) | 

**Example**  
```js
const model = new Model()model.on('missed', key => console.log(`${key} is missing`))model.has('test')
```
<a name="Model+count"></a>

### model.count() ⇒ <code>int</code>
Get count of the objects

**Kind**: instance method of [<code>Model</code>](#Model)  
**Example**  
```js
const model = new Model()console.log(model.count())
```
<a name="Model+keys"></a>

### model.keys() ⇒ <code>Array</code>
Get all keys of the objects

**Kind**: instance method of [<code>Model</code>](#Model)  
**Example**  
```js
const model = new Model()console.log(model.keys())
```
<a name="Model+version"></a>

### model.version() ⇒ <code>string</code>
Get version of the model

**Kind**: instance method of [<code>Model</code>](#Model)  
**Example**  
```js
const model = new Model()console.log(model.version())
```
<a name="Model+get"></a>

### model.get(key, options) ⇒ <code>object</code> \| <code>null</code>
Get object with specific key, null will be returned if object not existed

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | ID of an object |
| options | [<code>ModelGetOptions</code>](#ModelGetOptions) |  |

**Example**  
```js
const model = new Model()model.on('error', (func, err, { key } = {}) => console.log(func, key, err))const data = model.get('key1')console.log(data)
```
<a name="Model+del"></a>

### model.del(key, options)
Delete object with specific key

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | ID of an object |
| options | [<code>ModelDelOptions</code>](#ModelDelOptions) |  |

**Example**  
```js
const model = new Model()model.on('deleted', (key, data) => console.log('deleted', key, data))model.on('error', (func, err, { key } = {}) => console.log(func, key, err))model.del('key1')
```
<a name="Model+set"></a>

### model.set(key, value, index, options)
Create of update an object with specific key

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | ID of an object |
| value | <code>object</code> | Data to be saved in the JSON file |
| index | <code>object</code> \| <code>undefined</code> | Data to be saved in meta |
| options | [<code>ModelSetOptions</code>](#ModelSetOptions) |  |

**Example**  
```js
const model = new Model()model.on('error', (func, err, { key, value, index } = {}) => console.log(func, key, err, value, index))model.on('set', (key, value, index, old) => console.log(key, value, index, old))model.set('key1', { name: 'Ben' })
```
<a name="Model+find"></a>

### model.find(comparator) ⇒ [<code>ModelFindReturns</code>](#ModelFindReturns) \| <code>null</code>
Get the first object which the comparator returns true

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| comparator | <code>function</code> | 

**Example**  
```js
const model = new Model()const data = model.find(item => item.id === 'key1')console.log(data)
```
<a name="Model+findAll"></a>

### model.findAll(comparator, options) ⇒ [<code>Array.&lt;ModelFindReturns&gt;</code>](#ModelFindReturns)
Get all objects which the comparator returns true

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| comparator | <code>function</code> | 
| options | [<code>PaginateOptions</code>](#PaginateOptions) | 

**Example**  
```js
const model = new Model()const data = model.findAll(item => item.role === 'admin')console.log(data)
```
<a name="Model+mset"></a>

### model.mset(data, options)
Bulk create or update objects

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 
| options | [<code>ModelSetOptions</code>](#ModelSetOptions) | 

**Example**  
```js
const model = new Model()model.mset({  'key1': {    value: { id: 'key1' }  },  'key2': {    value: { id: 'key2', name: 'Ben', role: 'admin' }    index: { role: 'admin' }  }})
```
<a name="Model+delAll"></a>

### model.delAll(options)
Delete all objects

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| options | [<code>ModelDelOptions</code>](#ModelDelOptions) | 

**Example**  
```js
const model = new Model()model.delAll()
```
<a name="Schema"></a>

## Schema
Create / Get a schema

**Kind**: global class  

* [Schema](#Schema)
    * [new Schema(options)](#new_Schema_new)
    * [.schemaCount([options])](#Schema+schemaCount) ⇒ <code>int</code>
    * [.modelCount([options])](#Schema+modelCount) ⇒ <code>int</code>
    * [.hasSchema(name, [options])](#Schema+hasSchema) ⇒ <code>boolean</code>
    * [.hasModel(name, [options])](#Schema+hasModel) ⇒ <code>boolean</code>
    * [.getSchema(name, [options])](#Schema+getSchema) ⇒ <code>object</code> \| <code>null</code>
    * [.getModel(name, [options])](#Schema+getModel) ⇒ <code>object</code> \| <code>null</code>
    * [.removeSchema(name, [options])](#Schema+removeSchema)
    * [.removeModel(name, [options])](#Schema+removeModel)
    * [.model(name, [index])](#Schema+model) ⇒ [<code>Model</code>](#Model)
    * [.schema(name, [index])](#Schema+schema) ⇒ [<code>Schema</code>](#Schema)

<a name="new_Schema_new"></a>

### new Schema(options)
Create a new schema instance


| Param | Type |
| --- | --- |
| options | [<code>SchemaConstructorOptions</code>](#SchemaConstructorOptions) | 

**Example**  
```js
const schema = new Schema({  folder: 'path/to/schema'})
```
<a name="Schema+schemaCount"></a>

### schema.schemaCount([options]) ⇒ <code>int</code>
Count of sub schemas

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type |
| --- | --- |
| [options] | [<code>SchemaCountOptions</code>](#SchemaCountOptions) | 

**Example**  
```js
const schema = new Schema()console.log(schema.schemaCount())
```
<a name="Schema+modelCount"></a>

### schema.modelCount([options]) ⇒ <code>int</code>
Count of sub models

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type |
| --- | --- |
| [options] | [<code>SchemaCountOptions</code>](#SchemaCountOptions) | 

**Example**  
```js
const schema = new Schema()console.log(schema.modelCount())
```
<a name="Schema+hasSchema"></a>

### schema.hasSchema(name, [options]) ⇒ <code>boolean</code>
Check existence of a specific sub schema

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the sub schema |
| [options] | [<code>SchemaHasOptions</code>](#SchemaHasOptions) |  |

**Example**  
```js
const schema = new Schema()console.log(schema.hasSchema('test'))
```
<a name="Schema+hasModel"></a>

### schema.hasModel(name, [options]) ⇒ <code>boolean</code>
Check existence of a specific sub model

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the sub model |
| [options] | [<code>SchemaHasOptions</code>](#SchemaHasOptions) |  |

**Example**  
```js
const schema = new Schema()console.log(schema.hasModel('test'))
```
<a name="Schema+getSchema"></a>

### schema.getSchema(name, [options]) ⇒ <code>object</code> \| <code>null</code>
Get meta data of the specific sub schema

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the sub schema |
| [options] | [<code>SchemaGetOptions</code>](#SchemaGetOptions) |  |

**Example**  
```js
const schema = new Schema()console.log(schema.getSchema('test'))
```
<a name="Schema+getModel"></a>

### schema.getModel(name, [options]) ⇒ <code>object</code> \| <code>null</code>
Get meta data of the specific sub model

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the sub model |
| [options] | [<code>SchemaGetOptions</code>](#SchemaGetOptions) |  |

**Example**  
```js
const schema = new Schema()console.log(schema.getModel('test'))
```
<a name="Schema+removeSchema"></a>

### schema.removeSchema(name, [options])
Delete a specific sub schema

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the specific sub schema |
| [options] | [<code>SchemaDelOptions</code>](#SchemaDelOptions) |  |

**Example**  
```js
const schema = new Schema()schema.removeSchema('test')
```
<a name="Schema+removeModel"></a>

### schema.removeModel(name, [options])
Delete a specific sub model

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the specific sub model |
| [options] | [<code>SchemaDelOptions</code>](#SchemaDelOptions) |  |

**Example**  
```js
const schema = new Schema()schema.removeModel('test')
```
<a name="Schema+model"></a>

### schema.model(name, [index]) ⇒ [<code>Model</code>](#Model)
Create or get an instance of sub model

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | folder name of the sub model |
| [index] | <code>object</code> | meta data of the sub model |

**Example**  
```js
const schema = new Schema()const model = schema.model('test')
```
<a name="Schema+schema"></a>

### schema.schema(name, [index]) ⇒ [<code>Schema</code>](#Schema)
Create or get an instance of sub schema

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | folder name of the sub schema |
| [index] | <code>object</code> | meta data of the sub schema |

**Example**  
```js
const schema = new Schema()const sub = schema.schema('test')
```
<a name="ModelConstructorOptions"></a>

## ModelConstructorOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [folder] | <code>string</code> | <code>&quot;&#x27;~/.data&#x27;&quot;</code> | Path of a folder in which data will be saved |

<a name="ModelHasOptions"></a>

## ModelHasOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether 'missed' event is triggered if not found |

<a name="ModelGetOptions"></a>

## ModelGetOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered if not found |
| [housekeep] | <code>boolean</code> | <code>false</code> | Indicates whether the JSON file will be removed when key not found but the data file exists |

<a name="ModelDelOptions"></a>

## ModelDelOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered if not found |
| [real] | <code>boolean</code> | <code>true</code> | Indicates whether the JSON file will be really removed, if false, JSON file won't be delete but just delete key in meta |

<a name="ModelSetOptions"></a>

## ModelSetOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered if not found |
| [override] | <code>boolean</code> | <code>true</code> | Indicates whether content of the JSON file will be overrided by the value in parameters |
| [saveMeta] | <code>boolean</code> | <code>true</code> | Indicates whether meta file will be updated immediate |

<a name="ModelFindReturns"></a>

## ModelFindReturns : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | ID of the object |
| data | <code>object</code> | The data saved in JSON file |
| options | <code>object</code> | The data saved in meta |

<a name="PaginateOptions"></a>

## PaginateOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [offset] | <code>int</code> | <code>0</code> | The first {offset} matched items are ignored |
| [limit] | <code>int</code> | <code>0</code> | Page size, if it is 0 then no limit |

<a name="SchemaConstructorOptions"></a>

## SchemaConstructorOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [folder] | <code>string</code> | <code>&quot;&#x27;~/.data&#x27;&quot;</code> | Path of a folder in which data will be saved |

<a name="SchemaCountOptions"></a>

## SchemaCountOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered |

<a name="SchemaHasOptions"></a>

## SchemaHasOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered |

<a name="SchemaGetOptions"></a>

## SchemaGetOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered |

<a name="SchemaDelOptions"></a>

## SchemaDelOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [event] | <code>boolean</code> | <code>true</code> | Indicates whether event is triggered |

