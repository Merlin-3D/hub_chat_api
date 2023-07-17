import { Request, Response } from "express";
import { Friend, Profile, User } from "../database/models";
import { Op } from "sequelize";

export async function sendInviation(req: Request, res: Response) {
  try {
    const { userId, friendId } = req.body;

    await Friend.create({
      userId,
      friendId,
      isPending: true,
    });
    res.status(201).json({ message: "Invitation envoyer" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

export async function getUserInvitation(req: Request, res: Response) {
  try {
    const keys = Object.keys(req.query);
    const values = Object.values(req.query);

    let filtersKeys = {};
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      const value = values[index];
      //@ts-ignore
      filtersKeys[element] = value === "0" ? true : false;
    }

    const friends = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
      include: [
        {
          model: Friend,
          as: "friends",
          where: {
            [Op.and]: [filtersKeys],
          },
          include: [
            {
              model: User,
              as: "user",
              attributes: { exclude: ["password", "updatedAt", "createdAt"] },
              include: [
                {
                  model: Profile,
                  as: "profile",
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(201).json({ data: friends?.friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue!" });
  }
}
