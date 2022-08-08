const { Markup } = require("telegraf");

async function sendHtmlMessage(ctx, html) {
  try {
    await ctx.replyWithHTML(html);
    return true;
  } catch (error) {
    return false;
  }
}

async function sendInlineKeyboard(ctx, text, data) {
  try {
    await ctx.replyWithHTML(
      text,
      Markup.inlineKeyboard(
        data.map((item) => {
          return Markup.button.callback(item.text, item.callback_data);
        })
      )
    );
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  sendHtmlMessage,
  sendInlineKeyboard,
};
