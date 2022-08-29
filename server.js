const express= require('express'),
swig = require('swig'),
path =require('path'),
bodyParser = require('body-parser');

const mongoose= require('mongoose');

mongoose.connect('mongodb+srv://hothiadiao:Hothiadiao93@cluster0.hkacgty.mongodb.net/Blog?retryWrites=true&w=majority',
 {useNewUrlParser: true,
  useUnifiedTopology: true})
  
.then(() => console.log('connexion MongoDB réussie!!'))
.catch(() => console.log('connexion MongoDB échouée!!'));

//db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
  //console.log("connecté à Mongoose")
//});


app = express();


//app.use(express.logger());
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', swig.renderFile);


//Moteur de templates
app.set('view engine', 'html');
app.set('views',__dirname+'/views');

//mongoose.connect('https://cloud.mongodb.com/v2/628c9aa4b7c1473a4de8b054/Blog')


//var  Article = mongoose.model('Article', {title: String, content: String, updated: Date});

//Routes
var  Article = mongoose.model('Article', {title: String, author: String, content: String, updated: Date});
app.get('/', function(req, res){  
      Article.find({}).sort({updated: -1}).exec(function(err, articles){
        if(err){throw err;}
        data = {title: 'Mon super blog', articles: articles};
        res.render('index', data);
      });

});
app.get('/article/:id', function(req, res){
   var article = Article.findById(req.params.id, function(err, article){
        if(err){throw err}
        var data = {article: article, title: article.title};
        res.render('article', data);
   });
});
app.post('/update/:id', function(req, res){
Article.update({_id : req.params.id},{
  title: req.body.titre, author: req.body.auteur, content: req.body.contenu, updated: new Date()
},
function(err){
if(err){throw err;}
res.redirect('/');

});
});

app.get('/edit/:id', function(req, res){
  var article = Article.findById(req.params.id, function(err, article){
    if(err){throw err}
    var data = {article: article, title: 'Modifier '+ article.title};
    res.render('edit', data);
});
});

app.get('/destroy/:id', function(req, res){
  Article.deleteOne({_id : req.params.id}, function(err){
    if(err){throw err;}
    res.redirect('/');
  });
});


app.get('/create', function(req, res){
    var data = {title: 'Ajouter un article'};
    res.render('create', data);
});

app.post('/store', function(req, res){
  var article = new Article ({
    title: req.body.titre,
    content: req.body.contenu,
    author: req.body.auteur,
    updated: new Date()

  });
  article.save(function(err,  article){
    if(err){throw err;}
    res.render('created');

  });

});

app.listen(3000);
//console.log('App running http://localhost:3000');

