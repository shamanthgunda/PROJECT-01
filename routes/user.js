const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/user");

const router = express.Router();

/*router.get("/users", async (req, res) => {
  const allDbusers = await User.find({});
  const html = `
    <ul>
    ${allDbusers
      .map((user) => `<li>${user.firstName}-${user.email}</li>`)
      .join("")}
    </ul>
    `;
  res.send(html);
});*/

router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
