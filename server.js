const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on("connection", (socket) => {
    console.log("유저 접속됨:", socket.id);

    socket.on("create_room", () => {
        let roomCode = generateRoomCode();
        while (rooms[roomCode]) {
            roomCode = generateRoomCode();
        } // 중복 방지

        rooms[roomCode] = {
            players: [{ id: socket.id, ready: false }],
            isPlaying: false,
        };

        socket.join(roomCode);
        socket.emit("room_created", { roomCode: roomCode, isHost: true });
        io.to(roomCode).emit("lobby_update", rooms[roomCode].players);
    });

    socket.on("join_room", (roomCode) => {
        roomCode = roomCode.toUpperCase();
        const room = rooms[roomCode];

        if (!room) {
            socket.emit("error_msg", "존재하지 않는 방 코드입니다.");
            return;
        }
        if (room.isPlaying) {
            socket.emit("error_msg", "이미 게임이 진행 중인 방입니다.");
            return;
        }
        // 현재는 2인 제한 (향후 N인으로 확장 시 숫자만 수정하면 됨)
        if (room.players.length >= 2) {
            socket.emit("error_msg", "방이 가득 찼습니다.");
            return;
        }

        room.players.push({ id: socket.id, ready: false });
        socket.join(roomCode);
        socket.emit("room_joined", { roomCode: roomCode, isHost: false });
        io.to(roomCode).emit("lobby_update", room.players);
    });

    socket.on("toggle_ready", (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;

        const player = room.players.find((p) => p.id === socket.id);
        if (player) {
            player.ready = !player.ready;
            io.to(roomCode).emit("lobby_update", room.players);
        }
    });

    socket.on("request_start", (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;

        // 모든 플레이어가 레디 상태인지 확인
        const allReady = room.players.every((p) => p.ready);

        if (allReady && room.players.length > 1) {
            // 혼자 시작 방지
            room.isPlaying = true;
            const serverStartTime = Date.now() + 3000; // 3초 후 동시 시작
            io.to(roomCode).emit("start_game", { serverStartTime });
        } else {
            socket.emit("error_msg", "모든 플레이어가 준비되지 않았거나 인원이 부족합니다.");
        }
    });

    socket.on("update_score", (data) => {
        // 💡 수정: 누가 보낸 점수인지 식별하기 위해 id(socket.id)를 포함시켜 뿌려줍니다.
        socket.broadcast.to(data.room).emit("opponent_update", {
            id: socket.id,
            score: data.score,
            combo: data.combo,
        });
    });

    socket.on("disconnect", () => {
        console.log("유저 접속 종료:", socket.id);
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const playerIndex = room.players.findIndex((p) => p.id === socket.id);

            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);

                if (room.players.length === 0) {
                    delete rooms[roomCode]; // 방에 아무도 없으면 폭파
                } else {
                    if (room.isPlaying) {
                        io.to(roomCode).emit("opponent_disconnected");
                    } else {
                        io.to(roomCode).emit("lobby_update", room.players); // 로비에 남은 인원 갱신
                    }
                }
                break;
            }
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 서버 실행됨: http://localhost:${PORT}`);
});
