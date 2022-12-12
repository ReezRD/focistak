const express = require('express')
const fs = require("fs");
const bodyParser = require("body-parser")
const uniqid = require('uniqid'); 
const sanitizeHtml = require('sanitize-html');

const dataFile = "./data/products.json";
const port = 3000

const app = express()

//get product by id
app.get('/products/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let products = JSON.parse(data);

        //megkeressük a megfelelő product-ot id alján
        const productsById = products.find(product => product.id === id)
        if (!productsById) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //visszaküldjük
        res.send(productsById);
    });
})

//get products
app.get('/products', function (req, res) {
    fs.readFile(dataFile, (error, data)=>{
        let products = data;
        res.send(products);
    });
})


//delete product by id
app.delete('/products/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let products = JSON.parse(data);

        //megkeressük a megfelelő product indexét id alján
        const productsIndexById = products.findIndex(product => product.id === id)

        if (productsIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //letöröljük
        products.splice(productsIndexById, 1);

        //visszaír: obj -> json
        products = JSON.stringify(products)
        fs.writeFile(dataFile, products, (error)=>{
            console.log(error);
            //visszaküldjük, hogy melyik id-t töröltük
            res.send({id: id});
        })
    });
})

//put product by id
app.put('/products/:id', bodyParser.json(),function (req, res) {
    let id = req.params.id;
    let putProduct = {
        id: id, 
        name: sanitizeHtml(req.body.name),
        quantity: req.body.quantity,
        price: req.body.price,
        type: sanitizeHtml(req.body.type)
    }
    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let products = JSON.parse(data);

        //megkeressük a megfelelő product indexét id alján
        const productsIndexById = products.findIndex(product => product.id === id)

        if (productsIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //felülírjuk
        products[productsIndexById] = putProduct;

        //visszaír: obj -> json
        products = JSON.stringify(products)
        fs.writeFile(dataFile, products, (error)=>{
            console.log(error);
            //visszaküldjük, a módosított rekordot
            res.send(putProduct);
        })
    });
})

//post
app.post('/products',bodyParser.json(), function (req, res) {
    let newProduct = {
        id: uniqid(), 
        name: sanitizeHtml(req.body.name),
        quantity: req.body.quantity,
        price: req.body.price,
        type: sanitizeHtml(req.body.type)
    }

    
    fs.readFile(dataFile,(error, data)=>{
        //beolvas, json -> obj
        let products = JSON.parse(data);
        //push
        products.push(newProduct);
        //visszaír: obj -> json
        products = JSON.stringify(products)
        fs.writeFile(dataFile, products, (error)=>{
            console.log(error);
            res.send(newProduct);
        })

    })

})

app.listen(port)

//<script>alert('betörtem')</scrip>