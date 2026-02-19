import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { authMiddleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.flatten()
      });
    }

    const { email, password, name } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return res.status(201).json({
      message: "User created",
      userId: user.id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",error
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.flatten()
      });
    }

    const { email, password } = parsedData.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(403).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
});

app.post("/create-room" ,authMiddleware , async (req,res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if(!parsedData.success){
    return res.json({message:"incorrect inputs"})
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      const room = await prisma.room.create({
          data:{
            slug:parsedData.data.name,
            adminId:userId
          }
        })

        res.json({
          message:"Room created",
            roomId: room.id,
        })
  } catch (error) {
    res.status(411).json({
      message:"Room already exist with this name"
    })
  }

})

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
