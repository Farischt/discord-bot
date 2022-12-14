import fs from "fs/promises"
import path from "path"

import { DiscordBot } from "../types"
import { fileExtension } from "../utils"

const eventsDir = path.join(__dirname, "../events")

export default async function loader(
  bot: DiscordBot,
  dir = eventsDir
): Promise<void> {
  ;(await fs.readdir(dir, { withFileTypes: true }))
    .filter(
      (file) =>
        file.name !== "__tests__" && file.name !== `index${fileExtension}`
    )
    .forEach(async (file) => {
      if (file.name.endsWith(fileExtension) && !file.isDirectory()) {
        const event = (await import(`${dir}/${file.name}`)).default
        bot.on(event.name, event.bind(null, bot))
      }
    })
}
