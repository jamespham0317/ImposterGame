import asyncio
import websockets
import json
import random
import string
from backend.game import Game
from backend.sockets.runner import Engine

rooms = {} #key = roomid, value = Game
clients = {} # key = playerid, value = websocket


def generate_random_id(length=6):
    characters = string.ascii_letters.upper() + string.digits

    id =  ''.join(random.choice(characters) for _ in range(length))
    while id in rooms:
        id =  ''.join(random.choice(characters) for _ in range(length))
    
    return id

def create_room(room_id):
    game = Game(room_id)
    rooms[room_id] = game
    return game

def check_room(room_id):
    return room_id in rooms


async def handler(websocket):
    print("Client connected")
    async for message in websocket:
        try:
            data = json.loads(message)
        except json.JSONDecodeError:
            await websocket.send("Invalid JSON")
            continue
        
        msg_type = data.get("type", None)
        if msg_type == "create-room":
            roomid = generate_random_id()
            # client should send `playerid` and optional `name`
            playerid = data.get("playerid", None)
            name = data.get("name", None)

            game = create_room(roomid)
            await game.addPlayer(
                id=playerid,
                websocket=websocket,
                name=name
            )
            # send back the created room id as JSON so frontend can display/use it
            try:
                await websocket.send(json.dumps({"type": "room-created", "roomid": roomid}))
            except Exception as e:
                print("Failed to send room-created message:", e)

            createResponse = {
                "type": "room-created",
                "roomid": roomid
            }
            await websocket.send(json.dumps(createResponse))

        elif msg_type == "join-room":
            name = data.get("name", None)
            playerid = data.get("playerid", None)
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue

            clients[playerid] = websocket

            if not check_room(roomid):
                print("no room found", roomid)
                continue
            game = rooms[roomid]

            if game.state != "waiting":
                await websocket.send("Game already in progress")
                continue

            joinResponse = {
                "type": "player-joined",
                "roomid": roomid,
                "playerid": playerid,
                "name": name
            }

            await websocket.send(json.dumps(joinResponse))
            print(joinResponse)
            
            await game.addPlayer(
                id=playerid,
                websocket=websocket,
                name=name
            )


        elif msg_type == "start-game":
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue
            if not check_room(roomid):
                await websocket.send("Room not found")
                continue
            game = rooms[roomid]
            game.startGame()
        
            print(f"Game in room {roomid} started")

            startResponse = {
                "type": "game-started",
                "roomid": roomid
            }
            await game.emit(startResponse)
            
        elif msg_type == "request-order":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)
            if roomid is None:
                await websocket.send("No room ID provided")
                continue
            if not check_room(roomid):
                await websocket.send("Room not found")
                continue
            game = rooms[roomid]
            order = game.getOrder()

            orderResponse = {
                "type": "turn-list",
                "players": order
            }
            await websocket.send(json.dumps(orderResponse))
        elif msg_type == "request-imposter":
            playerid = data.get("playerid", None)
            roomid = data.get("roomid", None)

           
            game = rooms[roomid]
            imposter = next((p for p in game.players if p.role == "imposter"), None)

            if imposter is None:
                await websocket.send(json.dumps({
                     "type": "error", 
                     "message": "No imposter found"}))
                return
            
            
            await websocket.send(json.dumps({
                "type": "imposter-player",
                "playerid": imposter.id,
                "name": imposter.userName
            }))

        elif msg_type == "request-list":
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue
            if not check_room(roomid):
                await websocket.send("Room not found")
                continue

            game = rooms[roomid]

            await websocket.send(json.dumps(game.getListOfPlayers()))
        elif msg_type == "request-code":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)

            game = rooms[roomid]

            source_code = game.getSourceCode()
            
            
            await websocket.send(json.dumps({
                "type": "source-code",
                "questionId": game.questionId,
                "questionCategory": game.questionCategory,
                "questionTitle": game.questionTitle,
                "questionDifficulty": game.questionDifficulty,
                "questionDescription": game.questionDesc,
                "questionExamples": game.questionExample,
                "questionCategory": "Test Category",
                "code": source_code
            }))

            

        # elif msg_type == "request-time":
        #     roomid = data.get("roomid", None)


        #     game = rooms[roomid]
        #     timeLeft = game.timer.getTimeLeft()

        #     if timeLeft == 0:
        #         await game.nextTurn()

        #     await game.emit({
        #         "type": "time-left",
        #         "roomid": roomid,
        #         "timeLeft": timeLeft
        #     })

        elif msg_type == "request-tests":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)

            game = rooms[roomid]
            tests = game.getTests()

            await websocket.send(json.dumps({
                "type": "test-cases",
                "roomid": roomid,
                "playerid": playerid,
                "tests": tests
            }))

        # elif msg_type == "request-logs":
        #     roomid = data.get("roomid", None)
        #     playerid = data.get("playerid", None)

        #     game = rooms[roomid]
        #     commitLogs = game.getCommitLogs()


        #     await websocket.send(json.dumps({
        #         "type": "commit-logs",
        #         "playerid": playerid,
        #         "roomid": roomid,
        #         "commitLogs": commitLogs
        #     }))

        elif msg_type == "request-vote":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)

            game = rooms[roomid]
            votes = game.getVotes()

            await websocket.send(json.dumps({
                "type": "vote-info",
                "roomid": roomid,
                "playerid": playerid,
                "votes": votes
            }))
        
        elif msg_type == "start-round":
            roomid = data.get("roomid", None)
            game = rooms[roomid]
            await game.startRound()

        elif msg_type == "request-logs":
            roomid = data.get("roomid", None)
            game = rooms[roomid]
            print("SENDING LOGS")
            await websocket.send(json.dumps({
                "type": "log-list",
                "logs": game.getCommitLogs()['Commits']}))


        elif msg_type == "run-code":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)
            source_code = data.get("sourcecode", None)

            game = rooms[roomid]
            if game.state == "in-progress":
                results = game.runCode(source_code)

                passed = True
                scores = results[str(game.questionId)]['tests']
                for score in scores:
                    if score['passed'] == False:
                        passed = False
                        break
                

                all_passed = all(t["passed"] for t in results[str(game.questionId)]["tests"])
                if all_passed:
                    game.commit(playerid, source_code)
                await websocket.send(json.dumps({
                    "type": "test-results",
                    "roomid": roomid,
                    "playerid": playerid,
                    "results": results,
                    "complete": "passed" if passed else "failed"
                }))

        elif msg_type == "add-vote":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)       # the player casting the vote
            targetid = data.get("targetid", None)      # the player being voted against

            game = rooms[roomid]
            if game.state == "voting":
                game.addVote(targetid)
                votes = game.getVotes()

                await game.emit({
                    "type": "vote-added",
                    "roomid": roomid,
                    "votedFor": targetid,
                    "votes": votes
                })

        elif msg_type == "determine-winner":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)

            game = rooms[roomid]
            if game.state == "voting":
                imposter_wins = game.determineWinner()
                crewmate_wins = not imposter_wins
                votes = game.getVotes()

                await game.emit({
                    "type": "game-over",
                    "roomid": roomid,
                    "imposterWins": imposter_wins,
                    "crewmatesWin": crewmate_wins,
                    "votes": votes
                })
        elif msg_type == "log-code":
                    roomid = data.get("roomid", None)
                    playerid = data.get("playerid", None)
                    source_code = data.get("code", None)

                    game = rooms[roomid]
                    game.commit(playerid, source_code)

                    # Push the new "latest commit" to ALL players to avoid race with request-code
                    await game.emit({
                        "type": "source-code",
                        "questionId": game.questionId,
                        "questionCategory": game.questionCategory,
                        "questionTitle": game.questionTitle,
                        "questionDifficulty": game.questionDifficulty,
                        "questionDescription": game.questionDesc,
                        "questionExamples": game.questionExample,
                        "code": game.getSourceCode(),
                        "committedBy": playerid
                    })
            
        else:
            await websocket.send(f"Unknown message type: {msg_type}")


async def main():
   
    async with websockets.serve(handler, "0.0.0.0", 8765):
        
        game1 = create_room("123")
        print(game1.gameId)
        print("Running on ws://0.0.0.0:8765")
        
        await asyncio.Future()  # run forever

asyncio.run(main())