import { randomInt } from "./../../../common/helper";
import {
  ALLOW_GROUP,
  Command,
  MOCKING_SENTENCES,
} from "./../../../common/constant";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {
      text: command,
      from,
      chat,
      reply_to_message,
    } = req?.body?.message || {};
    const text = reply_to_message?.text ?? reply_to_message?.caption;
    if (from?.is_bot) {
      console.log("Bot is not allow");
      return res.status(401).json({ success: false });
    }
    if (!ALLOW_GROUP.includes(chat?.id)) {
      console.log("Group is not allow");
      return res.status(401).json({ success: false });
    }

    switch (command?.toLowerCase()) {
      case Command.GAMING:
        await handleTaggingEvent({ groupId: chat?.id });
        break;
      // case Command.TRANSLATE_ENG:
      //   this.eventEmitter.emit(LANGUAGE.TRANSLATE, { text, targetLang: 'en', groupId: chat?.id });
      //   break;
      // case Command.TRANSLATE_VIE:
      //   this.eventEmitter.emit(LANGUAGE.TRANSLATE, { text, targetLang: 'vi', groupId: chat?.id });
      //   break;
      // case Command.CHECK_GRAMMAR:
      //   this.eventEmitter.emit(LANGUAGE.CORRECT_GRAMMAR, { text, groupId: chat?.id });
      //   break;
      // case Command.CHAT_WITH_AI:
      //   this.eventEmitter.emit(LANGUAGE.CHAT, { text, groupId: chat?.id });
      //   break;
      default:
        console.log("Command not valid");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function handleTaggingEvent(payload: any) {
  const randomNumber = randomInt(0, MOCKING_SENTENCES.length - 1);
  const randomMockingSentence = MOCKING_SENTENCES[randomNumber];
  await sendTeleMessage({
    chat_id: payload.groupId,
    text: `Let\'s play game \n @VN_DaDra @GoatInTheShell @tannguyen090697 \n @salingun ${randomMockingSentence}`,
  });
}

function sendTeleMessage(data: any) {
  try {
    const endpoint = process.env.TELEGRAM_BOT_ENDPOINT + "/sendMessage";
    return axios.post(endpoint, null, {
      params: data,
    });
  } catch (error: any) {
    const errorMessage = error.errors
      ? error.errors.map((err: any) => err.toString()).join(", ")
      : error.toString();
    console.error(errorMessage);
  }
}
