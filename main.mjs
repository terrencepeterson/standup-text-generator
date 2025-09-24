#!/usr/bin/env node

import { MESSAGES } from './config.mjs'
import { getDayConfig } from './scripts/get-input.mjs'
import { getDayOutput, getBlockersOutput } from './scripts/output.mjs'

async function getStandupText(days) {
    let output = ''
    const blockers = []
    for (const [i, day] of days.entries()) {
        const shouldGetStatus = i === 0
        const config = await getDayConfig(day, shouldGetStatus, blockers) // only ask for the status on the first one
        output += getDayOutput(config)
    }
    output += getBlockersOutput(blockers)
    console.log(output)
}

getStandupText(MESSAGES)

