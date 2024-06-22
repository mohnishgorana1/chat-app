import { NextRequest } from "next/server";
import upload from "../lib/multer";
import { Writable } from 'stream';
import streamifier from 'streamifier'



export async function parseMultipartForm(request: NextRequest) {
    return new Promise((resolve, reject) => {
      const multerUpload = upload.single('avatar');
      const req = request as any; // Extend req with IncomingMessage properties
      const res = new Writable({
        write(chunk, encoding, callback) {
          callback();
        }
      });
  
      multerUpload(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(req);
      });
    });
  }
  