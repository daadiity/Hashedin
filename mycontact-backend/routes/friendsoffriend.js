const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login",loginUser );

router.get("/current",currentUser );
app.get('/users/:id/friends-of-friends', async (req, res) => {
    const user = req.params.id;

    // Get direct friends
    const connections = await Connection.find({
        $or: [{ user1: user }, { user2: user }]
    });

    const directFriends = new Set(connections.map(conn =>
        conn.user1 === user ? conn.user2 : conn.user1
    ));

    directFriends.add(user); // to exclude self

    // Collect second-degree connections
    const secondDegree = new Set();
    for (const friend of directFriends) {
        const friendConns = await Connection.find({
            $or: [{ user1: friend }, { user2: friend }]
        });

        for (const conn of friendConns) {
            const other = conn.user1 === friend ? conn.user2 : conn.user1;
            if (!directFriends.has(other)) {
                secondDegree.add(other);
            }
        }
    }

    const users = await User.find({ user_str_id: { $in: Array.from(secondDegree) } });
    res.json(users.map(u => ({ user_str_id: u.user_str_id, display_name: u.display_name })));
});

module.exports=router;
