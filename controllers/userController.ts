import { Request, Response } from "express";
import { Friend, Profile, User } from "../database/models";
import { Op } from "sequelize";
import { cloneDeep } from "lodash";

let pendingInvitations: Friend;
let clients: any[] = [];

function sendInvitationsUpdate(friend: Friend) {
  if (clients.length > 0) {
    pendingInvitations = friend;
    const clientInvitations = cloneDeep(pendingInvitations);
    const data = JSON.stringify(clientInvitations);
    clients.forEach((client) => {
      client.res.write(`data: ${data}\n\n`); // Écriture de la mise à jour dans le flux SSE
    });
  }
}

export async function invitationStream(req: Request, res: Response) {
  // Réglage des en-têtes SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  // Ajouter le client à la liste des clients connectés
  const client = { id: Date.now(), res };
  clients.push(client);

  // Supprimer le client de la liste lorsque la connexion est fermée
  req.on("close", () => {
    clients = clients.filter((c) => c.id !== client.id);
  });
}

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

export async function findUserByUserName(req: Request, res: Response) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Profile,
          as: "profile",
          where: {
            username: {
              [Op.iLike]: req.params.username,
            },
          },
        },
        {
          model: Friend,
          as: "friends",
        },
      ],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}

export async function sendInviation(req: Request, res: Response) {
  try {
    const { userId, friendId } = req.body;

    const invitation = await Friend.create({
      userId,
      friendId,
      isPending: true,
    });
    
    const friendPending = await User.findOne({
      where: { id: invitation.userId },
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
      include: [
        {
          model: Friend,
          as: "friends",
          where: {
            id: invitation.id,
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
        {
          model: Profile,
          as: "profile",
        },
      ],
    }); 
    res
      .status(201)
      .json({ message: "Invitation envoyer", data: friendPending });
    sendInvitationsUpdate(friendPending?.friends!);
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
          // where: {
          //   [Op.and]: [filtersKeys],
          // },
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
    res.status(200).json({ data: friends?.friends });
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
      },
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
