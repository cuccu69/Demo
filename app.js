const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/blog"

app.set('view engine', 'ejs')

app.listen(3000, function () {
    console.log('listening on port 3000')
})

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('blog')
        const postCollection = db.collection('post')

        app.get('/', (req, res) => {
            postCollection.find().toArray()
                .then(results => {
                    // console.log(results)
                    res.render('index.ejs', {posts: results})
                })
                .catch(error => console.error(error))

        })

        app.post('/add', (req, res) => {
            postCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    console.log('add success!')
                    res.redirect('/')
                })
                .catch(error => console.log(error))
        })

        app.post('/edit', (req, res) => {
            const update = {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                }
            };
            const queryUpdate = { _id: req.body.id };
            // const options = { returnNewDocument: true };
            // postCollection.updateOne(queryUpdate, update, function(err, res) {
            //     if (err) throw err;
            //     console.log("1 document updated")
            //     res.redirect('/')
            // });
            postCollection.updateOne(queryUpdate, update)
                .then(result => {
                    console.log(result)
                    console.log('edit success!')
                    res.redirect('/')
                })
                .catch(error => console.log(error))
        })

        app.post('/delete', (req, res) => {
            const queryDele = {title: req.body.title}
            postCollection.deleteOne(queryDele, function (err, obj) {
                if (err) throw  err
                console.log('1 document deleted')
            })
            res.redirect('/')
        })

        app.get('/find', (req, res) => {
            postCollection.createIndex({name : 'text', description: "text" })
            postCollection.find( { $text: { $search: req.body.content } } )
                .then(findResult => {
                    console.log(findResult)
                    // res.render('post.ejs', {findingPost: findResult})
                    // res.redirect('/')
                })
                .catch(error => console.error(error))
        })
    })

