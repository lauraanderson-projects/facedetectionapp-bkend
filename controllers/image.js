const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((error) => {
      console.error("Error updating user entries:", error);
      res.status(500).json({ error: "Failed to update user entries" });
    });
};

module.exports = {
  handleImage: handleImage,
};
