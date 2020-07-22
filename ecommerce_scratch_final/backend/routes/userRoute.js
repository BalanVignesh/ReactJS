import express from 'express';
import Users from '../models/userModel';
import { getToken, isAuth } from '../util';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: getToken(updatedUser)
      });
    } else {
      res.status(404).send({ msg: 'User Not Found' });
    }
  
  });

router.post('/signin', async (req, res) => {

    const signinUser = await Users.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (signinUser) {
        res.send({
            _id: signinUser._id,
            name: signinUser.name,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: getToken(signinUser)
        });
    } else {
        res.status(401).send({ msg: 'Invalid Email or Password.' });
    }
});

router.post('/register', async (req, res) => {
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: true
    });
    const newUser = await user.save();
    if (newUser) {
        res.send({
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            isAdmin: newUser.isAdmin,
            token: getToken(newUser)
        })
    } else {
        res.status(401).send({ msg: 'Invalid User Data.' });
    }
});

router.get("/createadmin", async (req, res) => {
    try {
        const user = new Users({
            name: 'Balan',
            email: 'balan@gmail.com',
            password: '1234',
            isAdmin: false
        });
        const newUser = await user.save();
        res.send(newUser);
    } catch (error) {
        res.send({ msg: error.message });
    }
});
export default router;