const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { response } = require('express');

const port = 8085;
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use('/public', express.static('coverimg'))

app.get('/', (req, res) =>{
    const conn = mongoose.createConnection('mongodb://localhost:27017/books');
    const model = conn.model('modelname',  mongoose.Schema({}), 'bookdetails')
    model.find()
    .then((response) => {
        if(response.length == 0){
            res.json({msg:"NoBooks"})
        }else{
            console.log(response)
            res.json(response)
        }
    })
    .catch((response) => { res.json({msg:"Error fething books"}) })
})

const storage = multer.diskStorage({
    destination: (r,f,c) =>{
        c(null, './coverimg')
    },
    filename: (r,f,c) =>{
        c(null, Date.now() + '.jpeg')
    }
})
const upload = multer({storage:storage});

app.post('/', upload.single('coverimg'),(req, res) =>{
    let img = req.file
    const {title, content} = req.body;

    const conn = mongoose.createConnection('mongodb://localhost:27017/books');
    const model = conn.model('modelname',  mongoose.Schema({}, { strict: false }), 'bookdetails')
    const obj = new model({
        'title':title,
        'cover':img,
        'content':content
    })
    obj.save()
    // res.json({msg:"published"})
})

app.listen(port, () =>{
    console.log(`server started on http://localhost:${port}`);
});