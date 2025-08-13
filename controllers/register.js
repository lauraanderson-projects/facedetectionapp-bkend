const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordPattern.test(password)) {
    return res
      .status(400)
      .json("Password does not meet security requirements.");
  }
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  console.log("Hash generated:", hash);
  // Store hash in your password DB
  db.transaction((trx) => {
    trx
      .insert({
        password: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            console.log("User registered:", user);
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch((error) => {
        console.error("Transaction error:", error);
        trx.rollback();
        res.status(400).json("Unable to register");
      });
  });
};

module.exports = {
  handleRegister: handleRegister,
};
