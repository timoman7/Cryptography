function Cryptography(state, obfuscation, tData){
	let rv = "";
	let data = tData.toString();
    if(typeof state == "string"){
		if(state.toLowerCase() == 'e'){
			// console.log("Encrypting:",data);
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
            data = arrString.join('');
            if(data.length%2 != 0) {
                data = (data.substr(2) + data.substr(0,2));
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
    let Encryptor           = document.querySelector("#Encryptor");
    let obfuscateEncrypt    = document.querySelector("#ObfuscateEncrypt");
    let SubmitEncryption    = document.querySelector("#SubmitEncryption");
    
    let Decryptor           = document.querySelector("#Decryptor");
    let obfuscateDecrypt    = document.querySelector("#ObfuscateDecrypt");
    let SubmitDecryption    = document.querySelector("#SubmitDecryption");

    let Result              = document.querySelector("#result");
    SubmitEncryption.addEventListener("click", function(){
        let message = Encryptor.value;
        if(obfuscateEncrypt.value == "yes") {
            Result.value    = Cryptography("e", true, message);
        } else if(obfuscateEncrypt.value == "no") {
            Result.value    = Cryptography("e", false, message);
        }
    });
    SubmitDecryption.addEventListener("click", function(){
        let message = Decryptor.value;
        if(obfuscateDecrypt.value == "yes") {
            Result.value    = Cryptography("d", true, message);
        } else if(obfuscateDecrypt.value == "no") {
            Result.value    = Cryptography("d", false, message);
        }
    });
});