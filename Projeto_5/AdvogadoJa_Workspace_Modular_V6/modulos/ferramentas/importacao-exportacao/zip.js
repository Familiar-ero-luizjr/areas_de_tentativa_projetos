// ZIP sem compressão, gerado localmente, sem dependências externas.
const enc=new TextEncoder(),dec=new TextDecoder();
const u16=(v,o,n)=>{v[o]=n&255;v[o+1]=(n>>>8)&255};
const u32=(v,o,n)=>{u16(v,o,n);u16(v,o+2,n>>>16)};
const r16=(v,o)=>v[o]|v[o+1]<<8;
const r32=(v,o)=>(v[o]|v[o+1]<<8|v[o+2]<<16|v[o+3]<<24)>>>0;
const crc=(buf)=>{let c=0xffffffff;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0};
export function criarZip(entradas){let off=0;const local=[],cent=[];
 for(const [path,conteudo] of Object.entries(entradas)){const n=enc.encode(path),v=typeof conteudo==='string'?enc.encode(conteudo):conteudo,checksum=crc(v);const h=new Uint8Array(30+n.length);u32(h,0,0x04034b50);u16(h,4,20);u16(h,8,0);u32(h,14,checksum);u32(h,18,v.length);u32(h,22,v.length);u16(h,26,n.length);h.set(n,30);local.push(h,v);
 const c=new Uint8Array(46+n.length);u32(c,0,0x02014b50);u16(c,4,20);u16(c,6,20);u32(c,16,checksum);u32(c,20,v.length);u32(c,24,v.length);u16(c,28,n.length);u32(c,42,off);c.set(n,46);cent.push(c);off+=h.length+v.length}
 const csize=cent.reduce((a,x)=>a+x.length,0),count=Object.keys(entradas).length,end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,count);u16(end,10,count);u32(end,12,csize);u32(end,16,off);return new Blob([...local,...cent,end],{type:'application/zip'});
}
export async function lerZip(file){const buf=new Uint8Array(await file.arrayBuffer());let e=-1;for(let i=buf.length-22;i>=Math.max(0,buf.length-66000);i--)if(r32(buf,i)===0x06054b50){e=i;break}if(e<0)throw Error('ZIP sem diretório central');const count=r16(buf,e+10),base=r32(buf,e+16);let pos=base;const result={};for(let j=0;j<count;j++){if(r32(buf,pos)!==0x02014b50)throw Error('Índice ZIP inválido');const method=r16(buf,pos+10),size=r32(buf,pos+20),nlen=r16(buf,pos+28),xlen=r16(buf,pos+30),clen=r16(buf,pos+32),local=r32(buf,pos+42),name=dec.decode(buf.slice(pos+46,pos+46+nlen));if(r32(buf,local)!==0x04034b50)throw Error('Entrada ZIP inválida');const start=local+30+r16(buf,local+26)+r16(buf,local+28),data=buf.slice(start,start+size);let bytes=data;if(method===8){if(!('DecompressionStream' in window))throw Error('ZIP comprimido não suportado neste navegador');const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));bytes=new Uint8Array(await new Response(stream).arrayBuffer())}else if(method!==0)throw Error('Compressão ZIP não suportada: '+method);
 if(name.endsWith('.json')&&!name.includes('..')&&!name.startsWith('/'))result[name]=dec.decode(bytes);pos+=46+nlen+xlen+clen}
 return result;
}
