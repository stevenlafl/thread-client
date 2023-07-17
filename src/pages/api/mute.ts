import { NextApiRequest, NextApiResponse } from "next";
import { ThreadsAPI } from 'threads-api';
import { setTimeout } from 'timers/promises';
import * as fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, my_device_id, my_user_id, user_id } = req.body;
  
  let payload: any = {};

  if (fs.existsSync('./json/mute.json')) {
    console.log('sent test mute');
    payload = JSON.parse(fs.readFileSync('./json/mute.json', 'utf8'));
    await setTimeout(1000);
  }
  else {
    try {
      if (user_id) {
        const client = new ThreadsAPI({ verbose: true, token, userID: my_user_id, deviceID: my_device_id });
        payload = await client.mute({userID: user_id});
      }
    } catch (e: any) {
      payload = e.data ? e.data : {
        'error': e.message
      };
    }
  }

  return res.status(200).json(payload);
}