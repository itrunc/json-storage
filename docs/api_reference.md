## Classes

<dl>
<dt><a href="#Model">Model</a></dt>
<dd><p>Create / Get a model</p>
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
    * [.findAll(comparator)](#Model+findAll) ⇒ [<code>Array.&lt;ModelFindReturns&gt;</code>](#ModelFindReturns)
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

### model.findAll(comparator) ⇒ [<code>Array.&lt;ModelFindReturns&gt;</code>](#ModelFindReturns)
Get all objects which the comparator returns true

**Kind**: instance method of [<code>Model</code>](#Model)  

| Param | Type |
| --- | --- |
| comparator | <code>function</code> | 

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

