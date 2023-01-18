process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
const items = require('../fakeDb');

let peanutButter = { name: 'peanut butter', price: 3.99 };
let jelly = { name: 'jelly', price: 4.50 };

beforeEach(function() {
    items.push(peanutButter);
    items.push(jelly);
});

afterEach(function() {
    items.length = 0;
})

describe('GET root', () => {
    test('Root should be empty', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual('Not Found');
    })
})

describe('GET /items', () => {
    test('show items page', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{peanutButter}, {jelly}]);
    })
})

// describe('POST /items', () => {
//     test
// })