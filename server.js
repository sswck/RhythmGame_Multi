const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let waitingPlayer = null;

io.on("connection", (socket) => {
    console.log("유저 접속됨:", socket.id);

    if (waitingPlayer) {
        // 매칭 성공! 방(Room) 생성
        const roomName = `room_${socket.id}`;
        socket.join(roomName);
        waitingPlayer.join(roomName);

        // 양쪽 플레이어의 정보를 서로에게 저장
        socket.roomName = roomName;
        waitingPlayer.roomName = roomName;
        socket.opponent = waitingPlayer;
        waitingPlayer.opponent = socket;

        console.log(`매칭 성공: ${waitingPlayer.id} vs ${socket.id} (${roomName})`);

        io.to(roomName).emit("match_found", { room: roomName });

        // 💡 [동시 시작 로직] 매칭 완료 1초 후, 서버가 직접 카운트다운(3초) 후 시작하라고 명령함
        setTimeout(() => {
            const startTime = Date.now() + 3000; // 현재 시간 기준 3초 뒤!
            io.to(roomName).emit("start_game", { serverStartTime: startTime });
        }, 1000);

        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
        socket.emit("waiting", { message: "상대방을 기다리는 중..." });
    }

    socket.on("update_score", (data) => {
        socket.broadcast.to(data.room).emit("opponent_update", data);
    });

    socket.on("disconnect", () => {
        console.log("유저 접속 종료:", socket.id);

        if (waitingPlayer === socket) {
            waitingPlayer = null;
        }

        // 💡 [Disconnect 로직] 방에 소속된 상태로 나갔다면, 상대방에게 도망갔다고 알림
        if (socket.roomName && socket.opponent) {
            socket.opponent.emit("opponent_disconnected");
            // 게임 끝났으니 남은 사람도 방에서 내보냄 (초기화)
            socket.opponent.leave(socket.roomName);
            socket.opponent.roomName = null;
            socket.opponent.opponent = null;
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 리듬게임 멀티플레이 서버 실행 중: http://localhost:${PORT}`);
});
