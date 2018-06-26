var fs = require("fs");
var c  = console;
var file = process.argv[2];

var dtable = {
  ""   :"000",
  "M"  :"001",
  "D"  :"010",
  "MD" :"011",
  "A"  :"100",
  "AM" :"101",
  "AD" :"110",
  "AMD":"111"
}

var atable = {
  "0":0,
  "1":0,
  "-1":0,
  "D":0,
  "A":0,
  "M":0,
  "!D":0,
  "!A":0,
  "-D":0,
  "-A":0,
  "D+1":0,
  "A+1":0,
  "D-1":0,
  "A-1":0,
  "D+A":0,
  "D-A":0,
  "A-D":0,
  "D&A":0,
  "D|A":0,
  "!M":1,
  "-M":1,
  "M+1":1,
  "M-1":1,
  "D+M":1,
  "D-M":1,
  "M-D":1,
  "D&M":1,
  "D|M":1

}

var jtable = {
  ""   :"000",
  "JGT":"001",
  "JEQ":"010",
  "JGE":"011",
  "JLT":"100",
  "JNE":"101",
  "JLE":"110",
  "JMP":"111"
}

var ctable = {
  "0"   :"101010",
  "1"   :"111111",
  "-1"  :"111010",
  "D"   :"001100",
  "A"   :"110000", 
  "M"   :"110000",
  "!D"  :"001101",
  "!A"  :"110001", 
  "!M"  :"110001",
  "-D"  :"001111",
  "-A"  :"110011",
  "-M"  :"110011",
  "D+1" :"011111",
  "A+1" :"110111",
  "M+1" :"110111",
  "D-1" :"001110",
  "A-1" :"110010",
  "M-1" :"110010",
  "D+A" :"000010",
  "D+M" :"000010",
  "D-A" :"010011",
  "D-M" :"010011",
  "A-D" :"000111",
  "M-D" :"000111",
  "D&A" :"000000",
  "D&M" :"000000",
  "D|A" :"010101",
  "D|M" :"010101"
}

var symTable = {
  "R0"  :0,
  "R1"  :1,
  "R2"  :2,
  "R3"  :3,
  "R4"  :4,
  "R5"  :5,
  "R6"  :6,
  "R7"  :7,
  "R8"  :8,
  "R9"  :9,
  "R10" :10,
  "R11" :11,
  "R12" :12,
  "R13" :13,
  "R14" :14,
  "R15" :15,
  "SP"  :0,
  "LCL" :1,
  "ARG" :2,
  "THIS":3, 
  "THAT":4,
  "KBD" :24576,
  "SCREEN":16384,
  "sum":17,
  "LOOP":4,
  "END":22
};

assembler(file+".asm");

function assembler(asmfile){
  var text = fs.readFileSync(asmfile, "utf8");
  var lines = text.split(/\r?\n/);
  console.log(JSON.stringify(lines, null, 2))
  pass(lines)
}

function pass(lines){
  console.log('==============pass===============')
  for(i = 0; i < lines.length; i++){
   var c = choose(lines[i]);
    if(c === null)continue;
    else if(lines[i].startsWith("@")){
      if(isNaN(c)!=false)c = symTable[c];
      var s = ntocode(parseInt(c), 16, 2)
      console.log("'%s' => %s",s,lines[i])
    }
   // else 
      //var s = wtocode(c);
    
  }
}

function choose(content){
  if(content.length === 0)return null;
  else if(content.startsWith("@")){
   // console.log("@")
    return content.substring(1).trim();
  }
  else if(content.startsWith("M") || content.startsWith("A") || content.startsWith("D") || content.startsWith("-") || content.startsWith("!") || content.startsWith("0") || content.startsWith("1")){
    //console.log("adm");
   if(content.match("=")=="=") var order = content.split("=");
   else var order = content.split(";");
   // console.log("%s %s",order[0],order[1])
   var s = wtocode(order);
   console.log("'%s' => %s",s,content);
  }
    
}

function ntocode(n, size, radix){//@
  var s = n.toString(radix)+"";
  while(s.length < size) s = "0" + s;
  return s;
}

function wtocode(order){//AMD...
 // console.log("%s %s",order[0],order[1])
  if(order[1].startsWith('J')!=true){
    var code = "111" + atable[order[0]] + ctable[order[1]] + dtable[order[0]];
    return code + jtable[""]
  }
   else {
     var code = "111" + atable[order[0]] + ctable[order[0]] + dtable[""]+jtable[order[1]];
     return code;
    }
  
}