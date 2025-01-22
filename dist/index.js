import{createServer}from"node:http";import next from"next";import{Server}from"socket.io";import{readFile,writeFile}from"node:fs/promises";var dev=process.env.NODE_ENV!=="production",hostname="0.0.0.0",port=Number(process.env.PORT)||3e3,app=next({dev,hostname,port,turbo:!0}),handler=app.getRequestHandler(),accData=JSON.parse(await readFile("shared/accounts.json","utf-8")),extraData=JSON.parse(await readFile("shared/extra.json","utf-8")),randomPassword=Math.random().toString(16).slice(2),adminAcc=accData.find(([,name])=>name==="admin");if(adminAcc)adminAcc[2]=randomPassword;else{let randomToken=Math.random().toString(16).slice(2);accData.push([randomToken,"admin",randomPassword])}await writeFile("shared/accounts.json",JSON.stringify(accData),"utf-8");console.log(`Admin password: ${randomPassword}`);var eventStatus=0,eventData={},readyList=new Set,leaderboardData=[];app.prepare().then(()=>{let httpServer=createServer(handler),io=new Server(httpServer);io.on("connection",socket=>{socket.emit("status",eventStatus),socket.on("login",(token,cb)=>{socket.data.token=token,socket.join(token);let name=accData.find(([t])=>t===token)[1];socket.data.name=name,cb(name),console.log(`login ${token}`),socket.emit("levelUp",eventData[socket.data.token])}),socket.on("logout",()=>{socket.data.token&&(socket.leave(socket.data.token),delete socket.data.token,delete socket.data.name,console.log("logout"))}),socket.on("createAccount",async(name,pw,slides,coord)=>{if(socket.data.name==="admin"){let randomToken=Math.random().toString(16).slice(2);accData.push([randomToken,name,pw]),extraData[randomToken]={slides,coord},await writeFile("shared/accounts.json",JSON.stringify(accData),"utf-8"),await writeFile("shared/extra.json",JSON.stringify(extraData),"utf-8")}}),socket.on("joinLeaderboard",cb=>{socket.join("leaderboard"),cb(leaderboardData)}),socket.on("leaveLeaderboard",()=>{socket.leave("leaderboard")}),socket.on("ready",()=>{leaderboardData.push([socket.data.name,0]),readyList.add(socket.data.token),io.to("leaderboard").emit("leaderboardUpdate",leaderboardData)}),socket.on("checkReady",cb=>{if(!socket.data.token)return cb(2);if(readyList.has(socket.data.token))return cb(1);cb(+!!eventStatus*2)}),socket.on("startEvent",()=>{socket.data.name==="admin"&&(eventData=Object.fromEntries([...readyList.entries()].map(([token])=>[token,0])),eventStatus=1,io.emit("status",eventStatus),setTimeout(()=>{eventStatus=2,io.emit("status",eventStatus),readyList=new Set},24e5).unref())}),socket.on("checkAnswer",(lv,ans)=>{let correct=!1;switch(lv){case 1:correct=ans.toLowerCase()==="over";break;case 2:correct=ans.toLowerCase()==="land";break;case 3:{let[x,y]=ans;correct=x===Math.floor(Math.log(extraData[socket.data.token].coord[0]))&&y===Math.floor(Math.log(extraData[socket.data.token].coord[1]));break}case 4:{let[x,y]=ans;correct=x===extraData[socket.data.token].coord[0]&&y===extraData[socket.data.token].coord[1];break}case 5:correct=ans.toLowerCase()==="zazi"}if(correct){eventData[socket.data.token]=lv;let acc=leaderboardData.find(([t])=>t===socket.data.name);acc&&(acc[1]=lv,leaderboardData.sort(([,s1],[,s2])=>s2-s1),io.to("leaderboard").emit("leaderboardUpdate",leaderboardData),io.to(socket.data.token).emit("levelUp",eventData[socket.data.token]))}}),socket.on("endEvent",()=>{eventStatus=0,io.emit("status",eventStatus),leaderboardData=[],io.to("leaderboard").emit("leaderboardUpdate",leaderboardData)})}),httpServer.once("error",err=>{console.error(err),process.exit(1)}).listen(port,()=>{console.log(`> Ready on http://${hostname}:${port}`)})});
