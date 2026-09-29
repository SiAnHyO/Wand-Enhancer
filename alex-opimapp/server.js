const http=require('http'),fs=require('fs'),path=require('path');
const port=process.env.PORT||3000,root=__dirname;
function headers(type){return {'Content-Type':type,'Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate','Pragma':'no-cache','Expires':'0','Surrogate-Control':'no-store'};}
http.createServer((req,res)=>{
  if(req.url==='/health'){res.writeHead(200,headers('application/json'));return res.end('{"ok":true}')}
  let u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u);
  if(u==='/'||!path.extname(u))f=path.join(root,'index.html');
  fs.readFile(f,(e,d)=>{
    if(e)return fs.readFile(path.join(root,'index.html'),(x,h)=>{
      if(x){res.writeHead(404,headers('text/plain; charset=utf-8'));return res.end('Not found')}
      res.writeHead(200,headers('text/html; charset=utf-8'));res.end(h)
    });
    const ext=path.extname(f),type=ext==='.html'?'text/html; charset=utf-8':ext==='.css'?'text/css; charset=utf-8':ext==='.js'?'application/javascript; charset=utf-8':'text/plain; charset=utf-8';
    res.writeHead(200,headers(type));res.end(d)
  })
}).listen(port,'0.0.0.0');
