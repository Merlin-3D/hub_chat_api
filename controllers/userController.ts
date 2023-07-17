import { Request, Response } from "express";
import { Friend, Profile, User } from "../database/models";
import { Op } from "sequelize";

export async function userProfile(req: Request, res: Response) {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

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

export async function getUserInvitations(req: Request, res: Response) {
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

export async function acceptInvitation(req: Request, res: Response) {
  try {
    await Friend.update(
      {
        isPending: false,
        isAccepted: true,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "L'invitaion a bien été accepter" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue!" });
  }
}

export async function rejectInvitation(req: Request, res: Response) {
  try {
    await Friend.update(
      {
        isPending: false,
        isAccepted: false,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "L'invitaion a bien été rejeter" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue!" });
  }
}

export async function blockUser(req: Request, res: Response) {
  try {
    await Friend.update(
      {
        isPending: false,
        isAccepted: false,
        isBlocked: true,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "Utilisateur bloquer" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue!" });
  }
}

export async function unBlockUser(req: Request, res: Response) {
  try {
    await Friend.update(
      {
        isPending: false,
        isAccepted: true,
        isBlocked: false,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "Utilisateur débloquer" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue!" });
  }
}
