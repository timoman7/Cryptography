console.log("This encryption method is incredibly insecure, it was developed\nas a means of demonstrating basic encryption.\nIt is called TBES(Tim's Basic Encryption Service)");
function Cryptography(state, obfuscation, tData){
    let rv = "";
    let data;
    if(tData.toString != undefined) {
        data = tData.toString();
    }
    if(typeof state == "string"){
		if(state.toLowerCase() == 'e'){
            // console.log("Encrypting:",data);
            if(data.length%2!=0) {
                data += " ";
            }
            data = data.split("").reverse().join("");
			let odd = "";
			let even = "";
			for(let i = 0; i < data.length; i++){
                if(i%2 == 0) {
                    even += data[i].toString();
                } else if((i+1)%2 == 0) {
                    odd += data[i].toString();
                }
            }
			data = even + odd;
			let front = data.substr(0, Math.floor(data.length/2));
			let back  = data.substr(Math.floor(data.length/2));
			data = back + front;
			if(obfuscation == true){
                [...data].forEach((char)=>{
                    rv += String.fromCharCode(Math.pow(char.charCodeAt(0),2));
                });
            } else {
				rv = data;
            }
        }else if(state.toLowerCase() == 'd'){
			// console.log("Decrypting:", data);
			if(obfuscation == true){
                let tempData = "";
                [...data].forEach((char)=>{
                    tempData += String.fromCharCode(Math.sqrt(char.charCodeAt(0)));
                });
                data = tempData;
            }
			let back = data.substr(0, Math.floor(data.length/2));
            let front  = data.substr(Math.floor(data.length/2));
            console.log(back)
            let arrString = [];
			for(let i = 0; i < (front.length+back.length)/2; i++){
				arrString[i*2]      = front[i];
				arrString[1+(i*2)]  = back[i];
            }
            data = arrString.reverse().join('');
            if(data.length%2==0&&data.endsWith(' ')) {
                data = data.substr(0, data.length-1);
            }
			rv = data;
        }
    }
	return rv;
}
var EncryptedMessage = Cryptography("e", true, Cryptography("e", false, "Do not fold my data"));
console.log("Encrypted Message:", EncryptedMessage);
var DecryptedMessage = Cryptography("d", false,Cryptography("d", true, EncryptedMessage));
console.log("Decrypted Message:", DecryptedMessage);
window.addEventListener("load", function(){
    let LastAction = {
        c: "e",
        o: "t",
        d: "This is the message to encrypt",
        intent: ""
    };

    let Encryptor           = document.querySelector("#Encryptor");
    let obfuscateEncrypt    = document.querySelector("#ObfuscateEncrypt");
    let SubmitEncryption    = document.querySelector("#SubmitEncryption");
    
    let Decryptor           = document.querySelector("#Decryptor");
    let obfuscateDecrypt    = document.querySelector("#ObfuscateDecrypt");
    let SubmitDecryption    = document.querySelector("#SubmitDecryption");

    let Result              = document.querySelector("#result");

    let ResultSendButton    = document.querySelector("#resultSendButton");
    let CopyActionButton    = document.querySelector("#copyActionButton");

    let UrlToCopy           = document.querySelector("#urlToCopy");

    SubmitEncryption.addEventListener("click", function(){
        let message = Encryptor.value;
        Result.value = Cryptography("e", (obfuscateEncrypt.value == "yes"? true : false), message);
        LastAction.c = "e";
        LastAction.o = (obfuscateEncrypt.value == "yes"? "y" : "n");
        LastAction.d = encodeURI(Result.value);
    });
    SubmitDecryption.addEventListener("click", function(){
        let message = Decryptor.value;
        Result.value = Cryptography("d", (obfuscateDecrypt.value == "yes"? true : false), message);
        LastAction.c = "d";
        LastAction.o = (obfuscateDecrypt.value == "yes"? "y" : "n");
        LastAction.d = encodeURI(Result.value);
    });
    let crypt   = 1;    //  1 = encrypt 2 = decrypt
    let obf     = 1;    //  0 = false   1 = true
    let data    = "";
    let pageLoadPromise = new Promise(function(resolve, reject){
        let val = {};
        let tVal = location.search.split("&");
        tVal[0] = tVal[0].substr(1);
        for(let i = 0; i < tVal.length; i++) {
            let key = tVal[i].split("=")[0];
            let value = decodeURI(tVal[i].split("=")[1]);
            val[key] = value;
        }
        resolve(val);
    });
    pageLoadPromise.then((query) => {
        if(typeof query == "object") {
            if(query.c.toLowerCase() == "e") {                          //Encrypt
                if(query.intent.toLowerCase() == "decrypt") {           //To decrypt
                    Encryptor.value = query.d;
                } else if(query.intent.toLowerCase() == "encrypt") {    //To inform
                    Decryptor.value = query.d;
                }
                if(query.o.toLowerCase() == "y") {
                    obfuscateEncrypt.value = "yes";
                } else if(query.o.toLowerCase() == "n") {
                    obfuscateEncrypt.value = "no";
                }
            } else if(query.c.toLowerCase() == "d") {                   //Decrypt
                if(query.intent.toLowerCase() == "decrypt") {           //To inform
                    Decryptor = query.d;
                } else if(query.intent.toLowerCase() == "encrypt") {    //To encrypt
                    Encryptor = query.d;
                }
                if(query.o.toLowerCase() == "y") {
                    obfuscateDecrypt.value = "yes";
                } else if(query.o.toLowerCase() == "n") {
                    obfuscateDecrypt.value = "no";
                }
            }

        }
    });
    ResultSendButton.addEventListener("click", function(){
        let queryString;
        if(LastAction.c.toLowerCase() == "e") {
            LastAction.intent = "encrypt";
            queryString = `?c=${LastAction.c}&o=${LastAction.o}&intent=${LastAction.intent}&d=${LastAction.d}`;
        } else if(LastAction.c.toLowerCase() == "d") {
            LastAction.intent = "decrypt";
            queryString = `?c=${LastAction.c}&o=${LastAction.o}&intent=${LastAction.intent}&d=${Result.value}`;
        }
        UrlToCopy.value = location.origin + location.pathname + queryString;
    });
    CopyActionButton.addEventListener("click", function(){
        let queryString;
        if(LastAction.c.toLowerCase() == "e") {
            LastAction.intent = "decrypt";
            queryString = `?c=${LastAction.c}&o=${LastAction.o}&intent=${LastAction.intent}&d=${Result.value}`;
        } else if(LastAction.c.toLowerCase() == "d") {
            LastAction.intent = "encrypt";
            queryString = `?c=${LastAction.c}&o=${LastAction.o}&intent=${LastAction.intent}&d=${LastAction.d}`;
        }
        UrlToCopy.value = location.origin + location.pathname + queryString;
    });
});