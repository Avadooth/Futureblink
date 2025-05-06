import bcrypt from "bcrypt";
import userScheme from "../Models/userCreate.model.js";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "all field required " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userScheme.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// MONGO_URI=mongodb+srv://Avadooth2919:Avadooth%402919@cluster0.7p6ib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// PORT=5000



export default { createUser };
