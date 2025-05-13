app.get('/connections/degree', async (req, res) => {
    const { from_user_str_id, to_user_str_id } = req.query;
    if (from_user_str_id === to_user_str_id) return res.json({ degree: 0 });

    const visited = new Set();
    const queue = [[from_user_str_id, 0]];

    while (queue.length) {
        const [current, degree] = queue.shift();
        if (visited.has(current)) continue;
        visited.add(current);

        const conns = await Connection.find({
            $or: [{ user1: current }, { user2: current }]
        });

        const neighbors = conns.map(conn =>
            conn.user1 === current ? conn.user2 : conn.user1
        );

        for (const neighbor of neighbors) {
            if (neighbor === to_user_str_id) return res.json({ degree: degree + 1 });
            if (!visited.has(neighbor)) queue.push([neighbor, degree + 1]);
        }
    }

    res.json({ degree: -1, message: 'not_connected' });
});
