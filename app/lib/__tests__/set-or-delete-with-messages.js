import setOrDeleteWithMessages from '../set-or-delete-with-messages'

test('change the value of a property', () => {
  const dst = { a: 1 }
  const src = { a: 2 }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "a: changing 1 to 2",
    ]
  `)
})

test('change the value of a property and leave other property alone', () => {
  const dst = { a: 1, b: 2 }
  const src = { a: 2 }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject(src)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "a: changing 1 to 2",
    ]
  `)
})

test('adding an obj', () => {
  const dst = { a: 1, b: 2 }
  const src = { c: { d: 4, e: 5 } }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject(src)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "c: changing not-present to {
      \\"d\\": 4,
      \\"e\\": 5
    }",
    ]
  `)
})

test('deleting a property', () => {
  const dst = { a: 1, b: 2 }
  const src = { c: 3, a: undefined }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ b: 2, c: 3 })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "c: changing not-present to 3",
      "deleting a: 1",
    ]
  `)
})

test('make an array smaller', () => {
  const dst = [1, 2, 3]
  const src = [1, 2]
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject(src)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "deleting [2]: 3",
    ]
  `)
})

test('make an array within an object smaller', () => {
  const dst = { a: [1, 2, 3], b: 1, c: { a: 1 } }
  const src = { a: [1, 2] }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ a: [1, 2], b: 1, c: { a: 1 } })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "deleting a[2]: 3",
    ]
  `)
})

test('can not set an object to a string', () => {
  const dst = { a: 1 }
  const src = "can't set"
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject(dst)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "Can not change type object to string",
    ]
  `)
})

test('can set a deeper object to a string', () => {
  const dst = { a: 1, b: { c: 2 } }
  const src = { b: 'string' }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ a: 1, b: 'string' })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "b: changing {
      \\"c\\": 2
    } to \\"string\\"",
    ]
  `)
})

function be() {}
function func() {}
function b1() {
  return 1
}
function newFunc() {
  return 1
}

test('can work with functions', () => {
  const dst = { a: 1, b: be, c: { func: func } }
  const src = { a: 'string', b: b1, c: { newFunc: newFunc } }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ a: 'string', b: b1, c: { func: func, newFunc: newFunc } })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "a: changing 1 to \\"string\\"",
      "b: changing be() to b1()",
      "c.newFunc: changing not-present to newFunc()",
    ]
  `)
})

test('can work without messages', () => {
  const dst = { a: 1, b: be, c: { func: func } }
  const src = { a: 'string', b: b1, c: { newFunc: newFunc } }
  setOrDeleteWithMessages(dst, src)
  expect(dst).toMatchObject({ a: 'string', b: b1, c: { func: func, newFunc: newFunc } })
})

test('can sort of change an obj to an array', () => {
  const dst = { 0: 'a', 1: 'b', 2: 'c' }
  const src = ['d', 'e', 'f']
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ 0: 'd', 1: 'e', 2: 'f' })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "0: changing \\"a\\" to \\"d\\"",
      "1: changing \\"b\\" to \\"e\\"",
      "2: changing \\"c\\" to \\"f\\"",
    ]
  `)
})

test('can change false to true and numbers to strings and vice versa', () => {
  const dst = { a: true, b: false, c: 3, d: 'four' }
  const src = { a: false, b: true, c: 'three', d: 4 }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ a: false, b: true, c: 'three', d: 4 })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "a: changing true to false",
      "b: changing false to true",
      "c: changing 3 to \\"three\\"",
      "d: changing \\"four\\" to 4",
    ]
  `)
})

test('make changes to sparse arrays', () => {
  const dst = { a: ['a', 'b', 'c'], b: 6 }
  dst.a[7] = 'z'
  const src = { a: ['a', 'b', 'c'] }
  src.a[7] = 'zz'
  src.a[6] = 'six'
  const result = { a: ['a', 'b', 'c'], b: 6 }
  result.a[6] = 'six'
  result.a[7] = 'zz'
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject(result)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "a[6]: changing not-present to \\"six\\"",
      "a[7]: changing \\"z\\" to \\"zz\\"",
    ]
  `)
})

test('add a deep deep prop', () => {
  const dst = { a: 1 }
  const src = { b: { c: { d: { d: 2 } } } }
  let messages = []
  setOrDeleteWithMessages(dst, src, messages)
  expect(dst).toMatchObject({ a: 1, b: { c: { d: { d: 2 } } } })
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "b: changing not-present to {
      \\"c\\": {
        \\"d\\": {
          \\"d\\": 2
        }
      }
    }",
    ]
  `)
})
