import mongoose, { Schema } from "mongoose";
import { type } from "os";
const userSchema = mongoose.Schema(
    {
      username: {
        type: String,
      },
      password: {
        type: String,
      },
      email: {
        type: String,
        required: true
      },
      createAt : {
        type: Date,
        default: Date.now
      },
    }
  );

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  export default User;  