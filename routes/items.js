const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require('../fakeDb');

router.get('/items', function(req,res) {
    return res.json({ items });
})

router.post('/items', function (req, res, next) {
    try {
        if(!req.body.name) throw new ExpressError('Item must have a name!', 400);
        if(!req.body.price) throw new ExpressError('Item must have a price!', 400);
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ added: {newItem} });
    } catch (e) {
        return next(e)
    }
})

router.get('/items/:name', function (req, res) {
    const foundItem = items.find(item => item.name === req.param.name);
    if(foundItem === undefined) {
        throw new ExpressError('Item not found!', 404);        
    } 
    return res.json({ item: foundItem });
})

router.patch('/items/:name', function (req, res) {
    const foundItem = items.find(item => item.name === req.param.name);
    if(foundItem === undefined) {
        throw new ExpressError('Item not found!', 404); 
    }
    const updatedItem = { name: req.body.name, price: req.body.price };
    foundItem = updatedItem;
    return res.status(200).json({ updated: {updatedItem} });
})

router.delete('/items/:name', function (req, res) {
    const foundItem = items.find(item => item.name === req.param.name);
    if(foundItem === undefined) {
        throw new ExpressError('Item not found!', 404); 
    }
    items.splice(foundItem, 1);
    res.status(200).json({ message: 'Deleted' });
})

module.exports = router;