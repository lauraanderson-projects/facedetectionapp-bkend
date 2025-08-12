const getProfile = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    });
};

module.exports = {
  handleProfileGet: getProfile,
};
