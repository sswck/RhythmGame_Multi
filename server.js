const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 클라이언트에게 public 폴더의 정적 파일(HTML, CSS, JS 등)을 제공
app.use(express.static("public"));

// 대기 중인 플레이어 (1:1 매칭용)
let waitingPlayer = null;

io.on("connection", (socket) => {
    console.log("유저 접속됨:", socket.id);

    // 1:1 매칭 시스템
    if (waitingPlayer) {
        // 이미 대기 중인 유저가 있다면, 방을 만들고 둘 다 입장시킵니다.
        const roomName = `room_${socket.id}`;
        socket.join(roomName);
        waitingPlayer.join(roomName);

        // 양쪽 클라이언트에게 매칭 성공 알림
        io.to(roomName).emit("match_found", { room: roomName });
        console.log(`매칭 성공: ${waitingPlayer.id} vs ${socket.id} (${roomName})`);

        // 대기열 초기화
        waitingPlayer = null;
    } else {
        // 대기 중인 유저가 없다면 자신이 대기열에 등록됩니다.
        waitingPlayer = socket;
        socket.emit("waiting", { message: "상대방을 기다리는 중..." });
    }

    // 클라이언트로부터 점수 업데이트 이벤트를 받으면 상대방에게 전달
    socket.on("update_score", (data) => {
        // socket.broadcast.to(방이름) -> 방에 있는 나를 제외한 모두에게 전송
        socket.broadcast.to(data.room).emit("opponent_update", data);
    });

    // 접속 종료 시
    socket.on("disconnect", () => {
        console.log("유저 접속 종료:", socket.id);
        if (waitingPlayer === socket) {
            waitingPlayer = null; // 대기 중이던 유저가 나갔다면 대기열 비우기
        }
        // TODO: 향후 플레이 도중 상대가 나가면 승리 처리하는 로직 추가
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 리듬게임 서버가 실행되었습니다: http://localhost:${PORT}`);
});
