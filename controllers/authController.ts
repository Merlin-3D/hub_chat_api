import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Profile, User } from "../database/models";
import config from "../utils/config";

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Cet utilisateur existe déjà" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tag = `@${makeTag()}`;

    const newUser = await User.create({
      email,
      password: hashedPassword,
      tag: tag,
    });
    console.log({
      username,
    })
    await Profile.create({
      userId: newUser.id,
      username,
      email
    });

    res.status(201).json({ message: "Inscription réussie", user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'inscription" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["updatedAt", "createdAt"] },
    });
    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }

    const token = generateToken(user.id);

    res.json({ message: "Connexion réussie", data: { user, token } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la connexion" });
  }
}

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret!, { expiresIn: "12h" });
}

function makeTag() {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 4) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
