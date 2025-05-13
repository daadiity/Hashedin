app.post('/users', async (req, res) => {
    try {
        const { user_str_id, display_name } = req.body;
        const user = new User({ user_str_id, display_name });
        await user.save();
        res.json({ user_str_id, display_name, status: 'created' });
    } catch (err) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});
app.post('/connections', async (req, res) => {
    const { user1_str_id, user2_str_id } = req.body;
    if (user1_str_id === user2_str_id) return res.status(400).json({ error: "Can't connect user to self" });

    const [u1, u2] = [user1_str_id, user2_str_id].sort();
    const user1 = await User.findOne({ user_str_id: u1 });
    const user2 = await User.findOne({ user_str_id: u2 });

    if (!user1 || !user2) return res.status(404).json({ error: 'One or both users not found' });

    const existing = await Connection.findOne({ user1: u1, user2: u2 });
    if (existing) return res.status(409).json({ error: 'Connection already exists' });

    await Connection.create({ user1: u1, user2: u2 });
    res.json({ status: 'connection_added' });
});
app.delete('/connections', async (req, res) => {
    const { user1_str_id, user2_str_id } = req.body;
    const [u1, u2] = [user1_str_id, user2_str_id].sort();

    const deleted = await Connection.findOneAndDelete({ user1: u1, user2: u2 });
    if (!deleted) return res.status(404).json({ error: 'Connection not found' });

    res.json({ status: 'connection_removed' });
});
