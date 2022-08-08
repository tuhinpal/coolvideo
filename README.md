![image](https://user-images.githubusercontent.com/51857187/183368713-9421ec6e-bc27-4f6d-900b-dd8837540293.png)

## Features 🪶

- Generate videos programmatically from telegram input
- High performance
- High quality videos

## Installation 📦

- Installation is pretty easy, click the button below to get started with Heroku (Set a cron job so it always runs).

  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tuhinpal/coolvideo/tree/master)

- Run on a VPS with docker 🐳

  ```bash
    git clone https://github.com/tuhinpal/coolvideo.git
    cd coolvideo
    docker build -t coolvideo .
    docker run -d -e BOT_TOKEN={PUT_YOUR_BOT_TOKEN} coolvideo
  ```

## Credits 🙏

This project uses [remotion](https://remotion.dev) to generate videos programatically with react.

## License 🎯

- Licensed under [Apache-2.0](https://github.com/tuhinpal/coolvideo/blob/master/LICENSE)
- Made by [Tuhin Kanti Pal](https://github.com/tuhinpal)

### Have a good day 🤘
