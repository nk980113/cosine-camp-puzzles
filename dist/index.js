import{createServer}from"node:http";import next from"next";import{Server}from"socket.io";import{readFile,writeFile}from"node:fs/promises";var dev=process.env.NODE_ENV!=="production",hostname="localhost",port=3e3,app=next({dev,hostname,port,turbo:!0}),handler=app.getRequestHandler(),accData=JSON.parse(await readFile("shared/accounts.json","utf-8")),randomPassword=Math.random().toString(16).slice(2),adminAcc=accData.find(([,name])=>name==="admin");if(adminAcc)adminAcc[2]=randomPassword;else{let randomToken=Math.random().toString(16).slice(2);accData.push([randomToken,"admin",randomPassword])}await writeFile("shared/accounts.json",JSON.stringify(accData),"utf-8");console.log(`Admin password: ${randomPassword}`);app.prepare().then(()=>{let httpServer=createServer(handler);new Server(httpServer).on("connection",socket=>{socket.on("login",(token,cb)=>{socket.data.token=token,socket.join(token),cb(accData.find(([t])=>t===token)[1]),console.log(`login ${token}`)}),socket.on("logout",()=>{socket.data.token&&(socket.leave(socket.data.token),delete socket.data.token,console.log("logout"))})}),httpServer.once("error",err=>{console.error(err),process.exit(1)}).listen(port,()=>{console.log(`> Ready on http://${hostname}:${port}`)})});
