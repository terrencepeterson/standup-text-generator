import PROJECT_CHOICES from '../projects.mjs'
import { getNameFromValue, getTasksText, getBoldText } from "./helpers.mjs"

function getProjectOutput(projectValue, tasks) {
    let projectOutput = getBoldText(getNameFromValue(PROJECT_CHOICES, projectValue))
    return getTasksText(projectOutput, tasks) + '\n'
}

export function getDayOutput(config) {
    let output = config.message + '\n'

    for (const [projectValue, tasks] of Object.entries(config.projects)) {
        output += getProjectOutput(projectValue, tasks)
    }

    return output += '\n'
}

export function getBlockersOutput(blockers) {
    let output = ':no_entry: ' + getBoldText('Blockers:')
    return blockers.length ? getTasksText(output, blockers, true) : output + `\n${getBoldText('None')}`
}

