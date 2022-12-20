var express = require('express');
var router = express.Router();

const {body, validationResult} = require('express-validator');

const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballData', ['players', 'usuarios'])


router.get('/', function (req, res, next) {
  res.redirect('/api/v1/players/login');
})

router.get('/api/v1/players', (req, res) => {
    db.players.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('players', {elements: docs})
        }
    })
})

router.get('/api/v1/playersview', (req, res) => {
    db.players.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('playersDesdeUser', {elements: docs})
        }
    })
})

router.get('/api/v1/players/remove/:id', (req, res) =>{
    let id= req.params.id;
    db.players.remove({_id: mongojs.ObjectId(id)}, function (err){
        if(err){
            console.log('Error al borrar')
        }else{
            res.redirect('/api/v1/players')
        }
    })
})

router.get('/api/v1/players/add', function (req, res, next) {
    res.render('crearJugador');
})

router.post('/api/v1/players/add', function (req, res) {
      const jugadorNuevo = {
        id: req.body.id,
        name: req.body.izena,
        birthdate: req.body.birthdate,
        nationality: req.body.nationality,
        teamId: req.body.teamid,
        position: req.body.position,
        number: req.body.number,
        leagueId: req.body.leagueid
      };

      console.log(jugadorNuevo);

      db.players.insert(jugadorNuevo, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/api/v1/players/add');
        }
      })
})

router.get('/api/v1/players/edit/:id', (req, res) => {
    db.players.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            console.log(doc)
            res.render('edit', {element: doc})
        }
    })
})

router.post('/api/v1/players/edit/:id', (req, res) => {

    req.body.id = JSON.parse(req.body.id)
    req.body.teamId = JSON.parse(req.body.teamId)
    req.body.number = JSON.parse(req.body.number)
    req.body.leagueId = JSON.parse(req.body.leagueId)
    console.log(req.body)
    console.log(req.params.id)

    db.players.findAndModify({
            query: {_id: mongojs.ObjectId(req.params.id)},
            update: {$set: req.body}
        },
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/api/v1/players')
            }
        })
})



router.get('/api/v1/players/registrar', function (req, res, next) {
    res.render('usersRegister',{
        fallo: ''
    });
})

router.post('/api/v1/players/registrar',

    //body('email').isEmail().withMessage('El email no es correcto.'),
    //body('izena').isLength({min: 1}).withMessage('El nombre no puede estar vacío.'),

    function (req, res) {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        db.usuarios.findOne({email: req.body.email}, (err, doc) => {
            if (err) {
                res.send(err);
            } else {
                if(doc===null){
                    const userBerria = {
                        izena: req.body.izena,
                        abizena: req.body.abizena,
                        email: req.body.email,
                        rol: "user"
                    };

                    console.log(userBerria);

                    db.usuarios.insert(userBerria, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/api/v1/playersview');
                        }
                    })
                }else{
                    //res.redirect('/api/v1/players/registrar');
                   // console.log('pasa por aqui')
                    res.render('usersRegister', {
                        fallo: 'El email ya se encuentra en uso'
                    })

                }
            }
        })


    })


router.get('/api/v1/players/login', function (req, res, next) {
    res.render('usersLogIn',{
        fallo:''
    });
})

router.post('/api/v1/players/login',

    //body('email').isEmail().withMessage('El email no es correcto.'),
    //body('izena').isLength({min: 1}).withMessage('El nombre no puede estar vacío.'),

    function (req, res) {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        db.usuarios.findOne({email: req.body.email}, (err, doc) => {
            if (err) {
                res.send(err);
            } else {
                if(doc!==null){
                    if(req.body.email===doc.email && req.body.izena===doc.izena && req.body.abizena===doc.abizena){
                        if(doc.rol==="admin"){
                            res.redirect('/api/v1/players');
                        } else{
                            res.redirect('/api/v1/playersview');
                        }
                    }else{
                        res.redirect('/api/v1/players/login');
                    }
                }else{
                    console.log('no esta registrado')
                  //  res.redirect('/api/v1/players/login');
                    res.render('usersLogIn',{
                        fallo:'El usuario introducido no se encuentra registrado'
                    });
                }


            }
        })
    })


module.exports = router;
