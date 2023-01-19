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
        expect(res.body).toEqual('Not Found')
    })
})

describe('GET /items', () => {
    test('show items page', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{peanutButter}, {jelly}])
    })
})

describe('POST /items', () => {
    test('post new item', async () => {
        const res = await request(app).post('/items').send({name: 'oatmeal', price: 4.99});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": {"name": "oatmeal", "price": 4.99}});
    })
    test('respond with 400 for empty name', async () => {
        const res = await request(app).post('/items').send({ price: 5.00 });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Item must have a name!');
    })
    test('respond with 400 for empty price', async () => {
        const res = await request(app).post('/items').send({ name: 'tacos'});
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Item must have a price!');
    })
})


describe('GET /items/:name', () => {
    test('show individual item page', async () => {
        const res = await request(app).get(`/items/${jelly.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(`${jelly}`);
    })
    test('show 404 response for invalid name', async () => {
        const res = await request(app).get('/items/beefjerky');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual('Item not found!');
    })
})

describe('PATCH /items/:name', () => {
    test('update item data', async () => {
        const res = await request(app).patch(`/items/${peanutButter.name}`).send({ name: "nutella", price: 4.00 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": {"name": "nutella", "price": 4.00} })
    })
    test('respond with 404 for invalid item', async () => {
        const res = await (await request(app).patch('/items/noodles')).send({name: "doesn't matter", price: 'no gonna send'});
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual('Item not found!');
    })
})

describe('DELETE /items/:name', () => {
    test('update item data', async () => {
        const res = await request(app).delete(`/items/${jelly.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" })
    })
    test('respond with 404 for invalid name', async () => {
        const res = await request(app).delete('/items/apples');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual('Item not found!');
    })
})