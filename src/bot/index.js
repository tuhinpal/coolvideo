require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const context = require("./helpers/context");
const steptext = require("./helpers/steptext");
const { sendHtmlMessage, sendInlineKeyboard } = require("./helpers/telegraf");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const Util = require("util");
const asyncExec = Util.promisify(exec);
const fs = require("fs");
const app = require("express")();

let jobs = [];

bot.start((ctx) =>
  ctx.reply(
    "Hello, I can generate your cool intro video programatically. Send /create to get started!\n\nPart of @tprojects"
  )
);

bot.help((ctx) =>
  ctx.reply(
    "I can generate your cool intro video programatically. Send /create to get started!"
  )
);

bot.command("/create", async (ctx) => {
  // create a new context

  try {
    let step = context.create(ctx.from.id);
    await sendHtmlMessage(ctx, steptext[step]);
  } catch (error) {
    await sendHtmlMessage(
      ctx,
      `Something went wrong while create context: ${error.message}`
    );
  }
});

bot.on("text", async (ctx) => {
  try {
    let getcontext = context.get(ctx.from.id);
    let step = getcontext.step;

    switch (step) {
      case "titleHeading": {
        let nextContext = context.update(ctx.from.id, step, {
          ...getcontext.props,
          titleHeading: ctx.message.text,
        });
        await sendHtmlMessage(ctx, steptext[nextContext]);
        break;
      }
      case "titleSubheading": {
        let nextContext = context.update(ctx.from.id, step, {
          ...getcontext.props,
          titleSubheading: ctx.message.text,
        });
        await sendHtmlMessage(ctx, steptext[nextContext]);
        break;
      }
      case "otherTexts": {
        let nextContext = context.update(
          ctx.from.id,
          step,
          {
            ...getcontext.props,
            otherTexts: [
              ...(getcontext.props.otherTexts || []),
              ctx.message.text,
            ],
          },
          true
        );
        await sendInlineKeyboard(ctx, "Enter more", [
          {
            text: "I'm done",
            callback_data: "done",
          },
        ]);
        break;
      }
      case "endHeading": {
        context.remove(ctx.from.id);
        let jobId = uuidv4();
        await sendHtmlMessage(
          ctx,
          `Generating video. Video will automatically send once ready. It might take a while.`
        );
        jobs.push({
          id: jobId,
          status: "pending",
          telegramId: ctx.from.id,
          props: {
            ...getcontext.props,
            endHeading: ctx.message.text,
          },
        });
        break;
      }
    }
  } catch (error) {
    sendHtmlMessage(ctx, error.message);
  }
});

bot.on("callback_query", async (ctx) => {
  try {
    let getcontext = context.get(ctx.from.id);
    if (ctx.callbackQuery.data === "done") {
      let nextContext = context.update(
        ctx.from.id,
        "otherTexts",
        getcontext.props
      );
      await sendHtmlMessage(ctx, steptext[nextContext]);
    }
  } catch (error) {
    sendHtmlMessage(ctx, error.message);
  }
});

setInterval(async () => {
  let isAnyJobRunning = jobs.filter((job) => job.status === "running");
  if (isAnyJobRunning.length === 0) {
    let job = jobs.find((job) => job.status === "pending");
    if (job) {
      job.status = "running";
      let result = await createVideo(job.props, job.id);
      job.status = result.status ? "finished" : "failed";
      if (result.status) {
        try {
          await bot.telegram.sendVideo(
            job.telegramId,
            {
              source: `./out/${job.id}.mp4`,
            },
            {
              caption: `Here is your cool intro video!`,
            }
          );
        } catch (e) {
          console.log("faild send video", e);
        }
      } else {
        try {
          await bot.telegram.sendMessage(
            job.telegramId,
            `Something went wrong while generating video: ${result.message}`
          );
        } catch (_) {}
      }
    }
  }
}, 5000);

async function createVideo(props, id) {
  console.log(`Elapsed renderer`);
  // child process to create video
  try {
    fs.writeFileSync(`./props.json`, JSON.stringify(props));
    await asyncExec(
      `npx remotion render ./src/remotion/index.jsx  CoolVideo ./out/${id}.mp4 --props=./props.json`
    );

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  } finally {
    try {
      fs.unlinkSync(`./props.json`);
    } catch (_) {}
  }
}

bot.launch().then(() => {
  console.log("Bot is launched");
});

// Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

// launch dummy server to keep app alive

app.get("/", (req, res) =>
  res.redirect(307, "https://github.com/tuhinpal/coolvideo")
);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
