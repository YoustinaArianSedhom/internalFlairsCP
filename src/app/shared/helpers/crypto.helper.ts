import AES from 'crypto-js/aes';
import UTF_8_ENCODER from 'crypto-js/enc-utf8';


export function encrypt(message: string, secret: string): string {
    return AES.encrypt(message, secret).toString();
}

export function decrypt(message: string, secret: string): string {
    return AES.decrypt(message, secret).toString(UTF_8_ENCODER);
}
