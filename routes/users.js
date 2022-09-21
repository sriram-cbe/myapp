var express = require('express');
var router = express.Router();
var verifyToken = require("../common/verifyToken");
var userModel = require("../model/userModel");
/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     description: Register a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Details
 *         description: User details
 *         in: body
 *         default : '{"name":"Hary Barnes","email":"hary@yopmail.com","age":1, "password" : "userpassword"}'
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully created
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       age:
 *         type: string
 *       password:
 *         type: string
 */


router.post('/signup', function (req, res, next) {
  try {
    var params = req.body;

    userModel.signup(params).then((userData) => {
      res.status(200).send({
        message: "Registered successfully.",
        data: userData,
      });
    }).catch((error) => {
      res.status(400).send({
        message: error.message
      });
    });
  } catch (error) {
    res.status(400).send({
      message: "Unable to register the user."
    });
  }
});

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     tags:
 *       - Users
 *     description: get user profile details
 *     produces:
 *       - application/json 
 *     responses:
 *       200:
 *         description: To get user profile details
 */

router.get('/getAll', function (req, res) {
  userModel.getAll().then((response) => {
    res.status(200).json(response)
  }).catch((error) => {
    if (error) { res.status(403).json({ error: error.message }) }

  });
})

/**
 * @swagger
 * /users/getByEmail/{email}:
 *   get:
 *     summary: Get user by email
 *     tags:
 *       - Users
 *     description:  Get user by email
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved the user details by the email.
 */
router.get("/getByEmail/:email", function (req, res) {
  var email = req.params.email;
  userModel.getByEmail(email).then((data) => {
    res.status(200).json(data)
  })
    .catch((error) => {
      if (error) { res.status(403).json({ error: error.message }) }
    })
});


/**
 * @swagger
 * /users/updateUser:
 *   put:
 *     summary: Updates the user details
 *     tags:
 *       - Users
 *     description: Updates the user details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User details
 *         in: body
 *         default : "{\"name\":\"Sriram B\",\"age\":\"41\",\"email\":\"sriram.b@yopmail.com\"}"
 *         schema:
 *           $ref: '#/definitions/Users'
 *     responses:
 *       200:
 *         description: Successfully updated user details
 */

/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       email:
 *         type: string
 *       age:
 *         type: string
 *       name:
 *         type: string
 *         
 */

router.put('/updateUser', function (req, res, next) {
  try {
    params = {
      "email": req.body.email,
      "name": req.body.name,
      "age": req.body.age
    };
    userModel.updateUser(params, function (error, response) {
      if (error) {
        res.status(403).json({
          error: error.message
        })
      } else {
        res.status(200).json({
          data: response,
          message: "Successfully updated the user details"
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      message: error.message
    })
  }
});

/**
 * @swagger
 * /users/deleteUserById/{id}:
 *   delete:
 *     summary: Delete the user by his id
 *     tags:
 *       - Users
 *     description:  Delete the user by his id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted the user.
 */
router.delete('/deleteUserById/:id', (req, res) => {
  var _id = req.params.id;
  console.log(_id);
  try {
    userModel.deleteUserById(_id, (error, response) => {
      if (error) {
        res.status(403).json({
          message: error.message
        })
      } else {
        res.status(200).json({
          message: "Successfully deleted the user."
        })
      }
    });
  } catch (errir) {
    res.status(403).json({
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users/setIsDeleted/{id}:
 *   delete:
 *     summary: Soft delete the user by his id
 *     tags:
 *       - Users
 *     description:  Soft delete the user by his id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User Id
 *         in: path
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully soft deleted the user.
 */
router.delete('/setIsDeleted/:id', (req, res) => {
  var _id = req.params.id;

  console.log(_id);
  try {
    userModel.setIsDeleted(_id, (error, response) => {
      if (error) {
        res.status(403).json({
          message: error.message
        })
      } else {
        res.status(200).json({
          data: response,
          message: "Successfully soft deleted the user."
        })
      }
    });
  } catch (errir) {
    res.status(403).json({
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login for athlete and agent
 *     tags:
 *       - Users
 *     description: User login for athlete and agent
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: body
 *          description: send params for login
 *          in: body
 *          default: '{"email":"user@yopmail.com","password":"MyPassword@12"}'
 *          schema:
 *            $ref: '#/definitions/loginRef'
 *     responses:
 *       200:
 *         description: send user details if credentials is correct
 */

/**
 * @swagger
 * definitions:
 *    loginRef:
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 */
router.post('/login', async function (req, res, next) {
  try {
    data = await userModel.model().findOne({
      email: req.body.email
    });

    if (!data) {
      res.status(400).send({
        message: "Incorrect email/password1"
      })
      return;
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
    return;
  }

  userModel.login(req.body).then((userData) => {
    if (userData) {
      var token = utils.generateJwtToken({
        userId: userData._id,
      });

      res.status(200).send({
        message: "User logged in successfully.",
        data: userData,
        token: token
      })
    } else {
      res.status(200).send({
        message: "User logged in successfully.",
      })
    }
  }).catch((error) => {
    res.status(403).send({
      message: error.message,
      data: error
    })
  })
});



module.exports = router;
