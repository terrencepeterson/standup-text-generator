import PROJECT_CHOICES from '../projects.mjs'
import { getNameFromValue, getTasksText, getBoldText } from "./helpers.mjs"
import { OUTPUT_MESSAGES } from '../config.mjs'

function getProjectOutput(projectValue, tasks) {
    let projectOutput = getBoldText(getNameFromValue(PROJECT_CHOICES, projectValue))
    return getTasksText(projectOutput, tasks) + '\n\n'
}

export function getDayOutput(config) {
    // convert to output message here
    let output = OUTPUT_MESSAGES[config.message] + '\n'

    for (const [projectValue, tasks] of Object.entries(config.projects)) {
        output += getProjectOutput(projectValue, tasks)
    }

    return output += '\n\n'
}

export function getBlockersOutput(blockers) {
    let output = ':no_entry: ' + getBoldText('Blockers:')
    return blockers.length ? getTasksText(output, blockers, true) : output + `\n${getBoldText('None')}`
}

