const test = require('ava')
const tailorr = require('./tailorr')

test('trim objects that match a model', (t) => {
  const input = {
    a: {
      b: 'blah'
    },
    c: 'testing'
  };

  const model = {
    a: {
      b: ''
    },
    c: ''
  }

  const populated = tailorr.trim(input, model)
  // return value should match the input object
  // because all keys existed in the model and were the same type
  t.deepEqual(input, populated)
})

test('trim objects that do not match a model', (t) => {
  const input = {
    a: {
      b: 'blah'
    },
    c: 'testing'
  };

  const model = {
    a: '',
    c: ''
  }

  const ret = tailorr.trim(input, model)
  // return value won't have b because it wasn't in the model
  // and it won't have a because the model type for a was a string
  t.deepEqual(ret, { a: null, c: 'testing' })
})

test('trim deep objects that do not match a model', (t) => {
  const input = {
    a: {
      b: {
        hello: 'world'
      }
    },
    c: 'testing',
    d: 0
  };

  const model = {
    a: {
      b: {
        hello: ''
      }
    },
    c: '',
    d: ''
  }

  const ret = tailorr.trim(input, model)
  // return value won't have b because it wasn't in the model
  // and it won't have a because the model type for a was a string
  t.deepEqual(ret, { 
    a: {
      b: {
        hello: 'world'
      }
    },
    c: 'testing',
    d: null
   })
})

test('trim object that differ from model by type only', (t) => {
  const input = {
    a: {
      b: 'blah'
    },
    c: 'testing',
    d: 'not a number',
    e: 'a string'
  };

  const model = {
    a: {
      b: ''
    },
    c: '',
    d: 0,
    e: ''
  }

  const options = { strict: true }

  const ret = tailorr.trim(input, model, options)
  // d's type doesn't match the model, so it will be left out
  t.deepEqual(ret, {
    a: {
      b: 'blah'
    },
    c: 'testing',
    d: null,
    e: 'a string'
  })
})

test('trim object that differ from model by type but strict is set to false', (t) => {
  const input = {
    a: {
      b: 'blah'
    },
    c: 'testing',
    d: 'not a number',
    e: 'a string'
  };

  const model = {
    a: {
      b: ''
    },
    c: '',
    d: 0,
    e: ''
  }

  const options = { strict: false }

  const ret = tailorr.trim(input, model, options)
  // d's type doesn't match the model but it will be left in (strict:false)
  t.deepEqual(ret, {
    a: {
      b: 'blah'
    },
    c: 'testing',
    d: 'not a number',
    e: 'a string'
  })
})

test('trim object that contains arrays', (t) => {
  const input = {
    a: {
      b: ['blah', ['a nested array']]
    },
    c: 'testing',
    d: [ { x: 'object in array' }, { y: 'another one' } ],
    e: 'a string'
  };

  const model = {
    a: {
      b: ['', ['']]
    },
    c: '',
    d: [ { x: '', }, { y: '' } ],
  }

  const options = { strict: true }

  const ret = tailorr.trim(input, model, options)
  // should remove e but nothing else
  t.deepEqual(ret, {
    a: {
      b: ['blah', ['a nested array']]
    },
    c: 'testing',
    d: [ { x: 'object in array' }, { y: 'another one' } ]
  })
})