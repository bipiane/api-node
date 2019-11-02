import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {Usuario} from '../../entity/Usuario';

class UsuarioController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(Usuario);
    const usuarios = await userRepository.find({
      select: ['id', 'username', 'role'], //We dont want to send the passwords on response
    });
    console.log('>>> listAll: ', usuarios);

    //Send the users object
    res.send(usuarios);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(Usuario);
    try {
      const usuarios = await userRepository.findOneOrFail(id, {
        select: ['id', 'username', 'role'], //We dont want to send the password on response
      });
      console.log('>>> getOneById: ', usuarios);

      res.send(usuarios);
    } catch (error) {
      res.status(404).send('Usuario no encontrado');
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let {username, password, role} = req.body;
    let user = new Usuario();
    user.username = username;
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(Usuario);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }

    //If all ok, send 201 response
    res.status(201).send('User created');
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get values from the body
    const {username, role} = req.body;

    //Try to find user on database
    const userRepository = getRepository(Usuario);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('User not found');
      return;
    }

    //Validate the new values on model
    user.username = username;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    const userRepository = getRepository(Usuario);
    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    await userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UsuarioController;