import { MESSAGES } from './config.mjs'
import { getDayConfig } from './scripts/config.mjs'
import { getDayOutput, getBlockersOutput } from './scripts/output.mjs'

async function getStandupText(days) {
    let output = ''
    const blockers = []
    for (const [i, day] of days.entries()) {
        const config = await getDayConfig(day, i === 0, blockers) // only ask for the status on the first one
        output += getDayOutput(config)
    }
    output += getBlockersOutput(blockers)
    console.log(output)
}

getStandupText(MESSAGES)

