interface User {
  username: string;
  email: string;
  password: string;
  gender: "male" | "female";
  profilePic: string;
}

export { User };
