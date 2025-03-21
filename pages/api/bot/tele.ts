import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BOT_TYPE,
  Command,
  GAME_ALLOW_GROUP,
  GPT_ALLOW_GROUP,
  GPT_TEXT_LIMIT,
  MOCKING_SENTENCES,
} from "./../../../common/constant";
import { randomInt } from "./../../../common/helper";
import { correctGrammar, translateToEng, translateToVie } from "./gemini";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {
      text,
      from,
      chat,
      reply_to_message,
    } = req?.body?.message || {};
    // const text = reply_to_message?.text ?? reply_to_message?.caption;
    if (from?.is_bot) {
      console.log('Bot is not allow');
      return res.json({ success: false });
    }

    const command = text?.toLowerCase();
    if (!command) {
      console.log('Command is not valid');
      return res.json({ success: false });
    }

    if (command.startsWith(Command.GAMING_COMMAND)) {
      await handleTaggingEvent({ groupId: chat?.id }, res); 
    } else if (command.startsWith(Command.CHECK_GRAMMAR)) {
      await handleCheckGrammar({ groupId: chat?.id, command: text }, res);
    } else if (command.startsWith(Command.TRANSLATE_ENG)) {
      await handleTranslateToEng({ groupId: chat?.id, command: text }, res);
    } else if (command.startsWith(Command.TRANSLATE_VIE)) {
      await handleTranslateToVie({ groupId: chat?.id, command: text }, res);
    }

    // switch (command?.toLowerCase()) {
    //   case Command.GAMING_COMMAND:
    //   case Command.GAMING_LONG_COMMAND:
        
    //     break;
    //   // case Command.TRANSLATE_ENG:
    //   //   this.eventEmitter.emit(LANGUAGE.TRANSLATE, { text, targetLang: 'en', groupId: chat?.id });
    //   //   break;
    //   // case Command.TRANSLATE_VIE:
    //   //   this.eventEmitter.emit(LANGUAGE.TRANSLATE, { text, targetLang: 'vi', groupId: chat?.id });
    //   //   break;
    //   case Command.CHECK_GRAMMAR:
    //     this.eventEmitter.emit(LANGUAGE.CORRECT_GRAMMAR, { text, groupId: chat?.id });
    //     break;
    //   // case Command.CHAT_WITH_AI:
    //   //   this.eventEmitter.emit(LANGUAGE.CHAT, { text, groupId: chat?.id });
    //   //   break;
    //   default:
    //     console.log("Command not valid");
    // }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error });
  }
}

async function handleTaggingEvent(payload: any, res: NextApiResponse) {
  if (!GAME_ALLOW_GROUP.includes(payload.groupId)) {
    console.log('Group is not allow');
    return res.json({ success: false });
  }
  const randomNumber = randomInt(0, MOCKING_SENTENCES.length - 1);
  const randomMockingSentence = MOCKING_SENTENCES[randomNumber];
  await sendTeleMessage({
    chat_id: payload.groupId,
    // text: `Let\'s play game \n @VN_DaDra @GoatInTheShell @tannguyen090697 \n @salingun ${randomMockingSentence}`,
    text: `Game nào ae \n @VN_DaDra @GoatInTheShell @tannguyen090697 \n Và tất nhiên anh @GoatOutTheShell aka @lnnam79 sẽ từ chối`,
  }, BOT_TYPE.GAME);
}

async function handleCheckGrammar(payload: any, res: NextApiResponse) {
  const { groupId, command } = payload;

  if (!GPT_ALLOW_GROUP.includes(groupId)) {
    console.log('Group is not allow');
    return res.json({ success: false });
  }

  let response;
  if (!command?.length || command.length > GPT_TEXT_LIMIT) response = 'Message is not valid';
  else {
    const chat = replaceCommand(command);
    response = await correctGrammar(chat);
  }

  await sendTeleMessage({
    chat_id: groupId,
    text: response,
  }, BOT_TYPE.GPT);
}

async function handleTranslateToEng(payload: any, res: NextApiResponse) {
  const { groupId, command } = payload;

  if (!GPT_ALLOW_GROUP.includes(groupId)) {
    console.log('Group is not allow');
    return res.json({ success: false });
  }

  let response;
  if (!command?.length || command.length > GPT_TEXT_LIMIT) response = 'Message is not valid';
  else {
    const chat = replaceCommand(command);
    response = await translateToEng(chat);
  }

  await sendTeleMessage({
    chat_id: groupId,
    text: response,
  }, BOT_TYPE.GPT);
}

async function handleTranslateToVie(payload: any, res: NextApiResponse) {
  const { groupId, command } = payload;

  if (!GPT_ALLOW_GROUP.includes(groupId)) {
    console.log('Group is not allow');
    return res.json({ success: false });
  }

  let response;
  if (!command?.length || command.length > GPT_TEXT_LIMIT) response = 'Message is not valid';
  else {
    const chat = replaceCommand(command);
    response = await translateToVie(chat);
  }

  await sendTeleMessage({
    chat_id: groupId,
    text: response,
  }, BOT_TYPE.GPT);
}

function replaceCommand(fullMessage: string) {
  return fullMessage.replace(/^\/[^\s@]+(@\S*)?\s*/, '').trim();
}

function sendTeleMessage(data: any, botEndpoint: string | undefined) {
  try {
    const endpoint = botEndpoint + '/sendMessage';
    return axios.post(endpoint, null, {
      params: data,
    });
  } catch (error: any) {
    console.error(error.message, error.stack);
  }
}
